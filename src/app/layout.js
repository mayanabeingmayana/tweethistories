import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Twitter Clone',
  description: 'A Twitter clone built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`} suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
