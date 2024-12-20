import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Head from "next/head"; // Import Head to manage HTML head metadata

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Choose the weights you want to include
});

export const metadata = {
  title: "Axara | News for kids.",
  description:
    "Axara is an AI-powered educational platform for children aged 2-12, offering personalized stories, interactive learning, and fun explanations on any topic. Designed to fuel curiosity and learning through play, Axara adapts to each child's unique needs, helping them explore the world in an engaging, age-appropriate way.",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <Head>
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta tags for social media and SEO */}
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:image" content="https://axaranews.com/favicon.ico" />
        <meta name="description" content={metadata.description} />

        {/* Structured Data for SearchAction */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://www.axaranews.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.axaranews.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
          `}
        </script>

        {/* Optional: Breadcrumb Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.axaranews.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "World",
                "item": "https://www.axaranews.com/world"
              }
            ]
          }
          `}
        </script>

      </Head>
      <body className={`${poppins.className} min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <Toaster />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
