import GlobalApi from "@/app/api/_services/GlobalApi";
import NewPage2 from "./_component/NewPage2";
import { notFound } from 'next/navigation';

// Schema components for JSON-LD
function NewsArticleSchema({ article }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description?.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
    image: article.image_url ? [
      `https://wowfy.in/testusr/images/${article.image_url}`
    ] : undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Organization',
      name: 'Doutya News Platform'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Doutya News Platform',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.doutya.com/images/logo2.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.doutya.com/news/${article.id}`
    },
    articleSection: article.categoryNames?.split(',').map(cat => cat.trim())[0] || 'News',
    keywords: article.categoryNames?.split(',').map(cat => cat.trim()).join(', ')
  };
}

function BreadcrumbSchema({ article }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.doutya.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'News',
        item: 'https://www.doutya.com/news'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.categoryNames?.split(',').map(cat => cat.trim())[0] || 'Article',
        item: `https://www.doutya.com/news/category/${article.categoryNames?.split(',').map(cat => cat.trim())[0]?.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: `https://www.doutya.com/news/${article.id}`
      }
    ]
  };
}

function OrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Doutya News Platform',
    url: 'https://www.doutya.com',
    logo: 'https://www.doutya.com/images/logo2.png',
    sameAs: [
      'https://www.facebook.com/doutyaNews',
      'https://twitter.com/doutyaNews',
      'https://www.instagram.com/doutyaNews',
      'https://www.linkedin.com/company/doutya'
    ]
  };
}

export async function generateMetadata({ params }) {
  const { id } = params;
  if (!id || isNaN(id)) {
    return notFound();
  }

  try {
    const response = await GlobalApi.fetchOneNews2({ id: parseInt(id) });
    const newsData = response.data.newsData;

    if (!newsData) {
      return notFound();
    }

    const { 
      title, 
      description, 
      image_url, 
      created_at, 
      updated_at,
      categoryNames 
    } = newsData;

    // Create clean description without HTML and truncate
    const cleanDescription = description 
      ? description.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
      : 'Explore the latest news from multiple perspectives on Doutya News.';

    // Format categories for meta tags
    const categories = categoryNames?.split(',').map(cat => cat.trim()) || [];
    const primaryCategory = categories[0] || 'News';

    // Format published date for meta tags
    const formattedDate = new Date(created_at).toISOString();
    const modifiedDate = updated_at ? new Date(updated_at).toISOString() : formattedDate;

    return {
      title: `${title || 'News Article'} | Doutya News Platform`,
      description: cleanDescription,
      keywords: [...categories, 'news', 'doutya', 'current events', primaryCategory.toLowerCase()].join(', '),
      authors: [{ name: 'Doutya News Platform' }],
      publisher: 'Doutya News Platform',
      openGraph: {
        title: title || 'News Article | Doutya News Platform',
        description: cleanDescription,
        url: `https://www.doutya.com/news/${id}`,
        type: 'article',
        publishedTime: formattedDate,
        modifiedTime: modifiedDate,
        authors: ['Doutya News Platform'],
        section: primaryCategory,
        tags: categories,
        locale: 'en_US',
        images: image_url ? [
          {
            url: `https://wowfy.in/testusr/images/${image_url}`,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [
          {
            url: 'https://www.doutya.com/default-news-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Doutya News Platform',
          }
        ],
        siteName: 'Doutya News Platform',
      },
      twitter: {
        card: 'summary_large_image',
        title: title || 'News Article | Doutya News Platform',
        description: cleanDescription,
        site: '@doutyaNews',
        creator: '@doutyaNews',
        images: image_url ? 
          [`https://wowfy.in/testusr/images/${image_url}`] : 
          ['https://www.doutya.com/default-news-image.jpg'],
      },
      // facebook: {
      //   appId: '123456789012345', // Replace with your Facebook App ID
      // },
      alternates: {
        canonical: `https://www.doutya.com/news/${id}`,
        languages: {
          'en-US': `https://www.doutya.com/news/${id}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-video-preview': -1,
          'max-snippet': -1,
        }
      },
      other: {
        'format-detection': 'telephone=no',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'apple-mobile-web-app-title': 'Doutya News',
      }
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return notFound();
  }
}

export default async function NewsSection({ params }) {
  const { id } = params;
  
  try {
    const response = await GlobalApi.fetchOneNews2({ id: parseInt(id) });
    const newsData = response.data.newsData;
    
    if (!newsData) {
      return notFound();
    }

    // Add all JSON-LD schemas
    return (
      <>
        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(NewsArticleSchema({article: newsData}))
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(BreadcrumbSchema({article: newsData}))
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(OrganizationSchema())
          }}
        />
        
        <NewPage2 newsData={newsData} />
      </>
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return notFound();
  }
}

// Enable incremental static regeneration
export const revalidate = 3600; // Revalidate pages every hour

// Generate static paths for popular articles
export async function generateStaticParams() {
  try {
    const response = await GlobalApi.fetchPopularNews();
    const popularNews = response.data.newsData || [];
    
    return popularNews.map((news) => ({
      id: news.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static paths:", error);
    return [];
  }
}