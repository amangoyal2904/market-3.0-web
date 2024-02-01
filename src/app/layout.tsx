import "../styles/globals.css";
import "../styles/common.scss";
import { Metadata } from 'next';
import { StateProvider } from "../store/StateContext";
 
export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}