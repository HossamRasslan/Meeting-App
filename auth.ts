import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { db } from './src/lib-db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [MicrosoftEntraID({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER || 'https://login.microsoftonline.com/common/v2.0',
    authorization: { params: { scope: 'openid profile email User.Read Calendars.Read offline_access' } },
  })],
  callbacks: {
    async signIn({ user, account }) {
      const email = user.email;
      if (account?.provider === 'microsoft-entra-id') {
        if (!email) return false;
        await db.user.upsert({
          where: { email },
          update: { microsoftId: account.providerAccountId, name: user.name, image: user.image, lastLoginAt: new Date() },
          create: { microsoftId: account.providerAccountId, email, name: user.name, image: user.image, lastLoginAt: new Date() },
        });
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account?.access_token) token.accessToken = account.access_token;
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await db.user.findUnique({ where: { email: session.user.email } });
        const userId = dbUser?.id ?? token.sub;
        if (userId) {
          (session.user as typeof session.user & { id?: string }).id = userId;
        }
      }
      (session as typeof session & { accessToken?: string }).accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  pages: { signIn: '/' },
});
