import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Royalty Nowcast MVP',
  description: 'Veckovis prognos av intäkter för Master, Publishing och Närstående',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}