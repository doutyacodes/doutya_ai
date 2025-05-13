// import GlobalApi from "@/app/api/_services/GlobalApi";
// import NewPage2 from "./_component/NewPage2";

// export async function generateMetadata({ params }) {
//   // Destructure the 'id' from params
//   const { id } = await params;
//   // Check if ID exists and is valid
//   if (!id || isNaN(id)) {
//     console.error("Invalid or missing ID");
//     return {
//       title: "News Details",
//       description: "Explore the latest news.",
//     };
//   }

//   try {
//     // Fetch the metadata for the news item using GlobalApi
//     const response = await GlobalApi.fetchOneNews2({ id: parseInt(id) });
//     const { title, description, image_url } = response.data.newsData || {};

//     // If no valid data is returned, fall back to defaults
//     return {
//       title: title || "News Details",
//       description: description || "Explore the latest news.",
//       openGraph: {
//         title: title || "News Details",
//         description: description || "Explore the latest news.",
//         images: image_url
//           ? [`https://wowfy.in/testusr/images/${image_url}`]
//           : [],
//         type: "article",
//         locale: "en_US",  // Optional: specify the locale
//         site_name: "Your Website", // Optional: specify your website name
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: title || "News Details",
//         description: description || "Explore the latest news.",
//         images: image_url
//           ? [`https://wowfy.in/testusr/images/${image_url}`]
//           : [],
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching metadata:", error);
//     return {
//       title: "News Details",
//       description: "Explore the latest news.",
//     };
//   }
// }

// export default function NewsSection() {
//   return <NewPage2 />;
// }

import GlobalApi from "@/app/api/_services/GlobalApi";
import NewPage2 from "./_component/NewPage2";
import { notFound } from 'next/navigation';

// Schema component for JSON-LD
function NewsSchema({ article }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image_url ? `https://wowfy.in/testusr/images/${article.image_url}` : undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Organization',
      name: 'Doutya News'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Doutya News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.doutya.com/logo2.png' // Update with your actual logo URL
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.doutya.com/viewpoint/${article.id}`
    }
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!id || isNaN(id)) {
    return notFound();
  }

  try {
    const response = await GlobalApi.fetchOneNews2({ id: parseInt(id) });
    const newsData = response.data.newsData;

    if (!newsData) {
      return notFound();
    }

    const { title, description, image_url, created_at, categoryNames } = newsData;

    // Create clean description without HTML and truncate
    const cleanDescription = description 
      ? description.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
      : 'Explore the latest news from multiple perspectives on Doutya News.';

    // Format categories for meta tags
    const categories = categoryNames?.split(',').map(cat => cat.trim()) || [];

    return {
      title: title || 'News Details | Doutya News',
      description: cleanDescription,
      keywords: categories.join(', '),
      openGraph: {
        title: title || 'News Details | Doutya News',
        description: cleanDescription,
        url: `https://www.doutya.com/viewpoint/${id}`,
        type: 'article',
        article: {
          publishedTime: created_at,
          modifiedTime: created_at,
          section: categories[0] || 'News',
          tags: categories,
        },
        images: image_url ? [
          {
            url: `https://wowfy.in/testusr/images/${image_url}`,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [],
        siteName: 'Doutya News',
      },
      twitter: {
        card: 'summary_large_image',
        title: title || 'News Details | Doutya News',
        description: cleanDescription,
        images: image_url ? [`https://wowfy.in/testusr/images/${image_url}`] : [],
      },
      alternates: {
        canonical: `https://www.doutya.com/viewpoint/${id}`,
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return notFound();
  }
}

export default async function NewsSection({ params }) {
  const { id } = await params;
  try {
    const response = await GlobalApi.fetchOneNews2({ id: parseInt(id) });
    const newsData = response.data.newsData;
    if (!newsData) {
      return notFound();
    }

    // Add JSON-LD script
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(NewsSchema({article: newsData}))
          }}
        />
        <NewPage2 />
      </>
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return notFound();
  }
}