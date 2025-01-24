import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Roboto_Mono, Lato, Roboto, Open_Sans } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Add new Google Fonts

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const roboto = Roboto({
  subsets: ['latin'],

  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-opensans',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: "WhosBetterAt - who's better at what in smash?",
  description: "decide which smash characters are better at what!",
  icons: {
    icon: '/favicon.ico',
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${robotoMono.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
