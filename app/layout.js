import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google'
import VisitorTracker from "./_components/(analytics)/VisitorTracker";


const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});


export const metadata = {
  title: {
    default: "Doutya News : World's First Multi-Perspective News Portal | From All Angles, For All Ages",
    template: '%s | Doutya News'
  },
  description: "Experience news from every angle with an in-depth, multi-perspective coverage at its core. Plus, a dedicated Kids section for age-appropriate news and our Magic Box for AI-crafted explanations and stories. Doutya News—tailored for every reader, every story, every perspective.",
  metadataBase: new URL('https://www.doutya.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Doutya News : World's First Multi-Perspective News Portal | From All Angles, For All Ages",
    description: "Experience news from every angle with an in-depth, multi-perspective coverage at its core. Plus, a dedicated Kids section for age-appropriate news and our Magic Box for AI-crafted explanations and stories. Doutya News—tailored for every reader, every story, every perspective.",
    url: 'https://www.doutya.com',
    siteName: 'Doutya News',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.doutya.com/images/logo2.png',
        width: 1200,
        height: 630,
        alt: 'Doutya News Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Doutya News : World's First Multi-Perspective News Portal | From All Angles, For All Ages",
    description: "Experience news from every angle with an in-depth, multi-perspective coverage at its core.",
    images: ['https://www.doutya.com/images/logo2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],

  },
  manifest: '/site.webmanifest',
  other: {
    'pinterest': 'nopin',
    'fb:app_id': 'your-facebook-app-id', // Replace with your actual FB app ID
    'linkedin:share': 'true',
  },
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${poppins.className} min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <Toaster />
          <VisitorTracker /> {/* Client-side logic */}
          {children} 
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}