import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VideoDelusion — Motion Designer & Video Editor Portfolio',
  description:
    'Avant-garde personal portfolio for a high-level video editor and motion graphics artist. Featuring real-time color grading, WebGL 3D scenes, and an interactive playhead scroll experience.',
  keywords: ['video editor', 'motion graphics', 'compositor', 'portfolio', 'DaVinci Resolve', 'Nuke'],
  openGraph: {
    title: 'VideoDelusion — Motion Designer Portfolio',
    description: 'An avant-garde WebGL portfolio with real-time color grading.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#080808] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
