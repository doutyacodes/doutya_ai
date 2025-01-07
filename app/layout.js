// import { Poppins } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import { NextIntlClientProvider } from "next-intl";
// import { getLocale, getMessages } from "next-intl/server";
// import Head from "next/head"; // Import Head to manage HTML head metadata
// import { Inter } from 'next/font/google'
 
// const inter = Inter({ subsets: ['latin'] })

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"], // Choose the weights you want to include
// });

// export const metadata = {
//   title: "Axara News : From All Angles, For All Ages",
//   description:
//     "Experience news from every angle with an in-depth, multi-perspective coverage at its core. Plus, a dedicated Kids section for age-appropriate news and our Magic Box for AI-crafted explanations and stories. Axara News—tailored for every reader, every story, every perspective.",
//   url: "https://axaranews.com", // Add the URL for social media sharing
//   image: "https://axaranews.com/favicon-32x32.png", // Add an image for preview (you can replace with a more specific image)
// };

// export default async function RootLayout({ children }) {
//   const locale = await getLocale();
//   const messages = await getMessages();

//   return (
//     <html lang={locale}>
//       <Head>
//         {/* Favicon and icons */}
//         <link rel="icon" href="/favicon.ico" />
//         <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
//         <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
//         <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
//         <link rel="manifest" href="/site.webmanifest" />

//         {/* Meta tags for social media and SEO */}
//         <meta name="theme-color" content="#ffffff" />
//         <meta property="og:image" content={"https://axaranews.com/logo2.png"} />
//         <meta name="description" content={metadata.description} />
//         <meta property="og:title" content={metadata.title} />
//         <meta property="og:description" content={metadata.description} />
//         <meta property="og:url" content={metadata.url} />
//         <meta property="og:type" content="website" />
        
//         {/* Twitter meta tags */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={metadata.title} />
//         <meta name="twitter:description" content={metadata.description} />
//         <meta name="twitter:image" content={"https://axaranews.com/logo2.png"} />
        
//         {/* Pinterest meta tags */}
//         <meta name="pinterest" content="nopin" />
        
//         {/* Facebook Open Graph meta tags */}
//         <meta property="fb:app_id" content="your-facebook-app-id" /> {/* Replace with your FB app ID */}
        
//         {/* LinkedIn Share meta tags */}
//         <meta name="linkedin:share" content="true" />
//       </Head>
//       <body className={`${poppins.className} min-h-screen`}>
//         <NextIntlClientProvider messages={messages}>
//           <Toaster />
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }


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
    default: "Axara News : From All Angles, For All Ages",
    template: '%s | Axara News'
  },
  description: "Experience news from every angle with an in-depth, multi-perspective coverage at its core. Plus, a dedicated Kids section for age-appropriate news and our Magic Box for AI-crafted explanations and stories. Axara News—tailored for every reader, every story, every perspective.",
  metadataBase: new URL('https://axaranews.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Axara News : From All Angles, For All Ages",
    description: "Experience news from every angle with an in-depth, multi-perspective coverage at its core. Plus, a dedicated Kids section for age-appropriate news and our Magic Box for AI-crafted explanations and stories. Axara News—tailored for every reader, every story, every perspective.",
    url: 'https://axaranews.com',
    siteName: 'Axara News',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://axaranews.com/logo2.png',
        width: 1200,
        height: 630,
        alt: 'Axara News Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Axara News : From All Angles, For All Ages",
    description: "Experience news from every angle with an in-depth, multi-perspective coverage at its core.",
    images: ['https://axaranews.com/logo2.png'],
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
    // apple: [
    //   { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    // ],
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