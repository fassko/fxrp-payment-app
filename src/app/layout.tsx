import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { geistSans, geistMono } from '../lib/fonts';

export const metadata: Metadata = {
  title: "FXRP Payment App",
  description: "FXRP payments on Coston2 using Flare Network",
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
