import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className="h-full">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
          }} 
        />
        {children}
      </body>
    </html>
  );
}
