import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}