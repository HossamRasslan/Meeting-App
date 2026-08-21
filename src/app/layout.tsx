import './globals.css';
import Providers from './providers';
export const metadata={title:'Meetly — Meeting Notes',description:'Meeting notes for Microsoft 365'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Providers>{children}</Providers></body></html>}