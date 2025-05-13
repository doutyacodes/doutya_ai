import { MetadataRoute } from 'next';
import GlobalApi from './api/_services/GlobalApi';

export default async function sitemap() {
  try {
    // Fetch the articles and extract data from axios response
    const response = await GlobalApi.FetchNewsAdult({ region: 'International' });
    const articlesData = response.data;

    const sitemapEntries = [
      {
        url: 'https://www.doutya.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];

    // Process top news groups
    const topNewsEntries = articlesData.newsTopGroupedByGroupId.flatMap(group => 
      group.newsItems.map(article => ({
        url: `https://www.doutya.com/news/${article.id}`,
        lastModified: new Date(article.updated_at || article.created_at),
        changeFrequency: 'daily',
        priority: 0.9,
      }))
    );

    // Process regular news groups
    const regularNewsEntries = articlesData.newsGroupedByGroupId.flatMap(group =>
      group.newsItems.map(article => ({
        url: `https://www.doutya.com/news/${article.id}`,
        lastModified: new Date(article.updated_at || article.created_at),
        changeFrequency: 'daily',
        priority: 0.9,
      }))
    );

    // Combine all entries
    return [...sitemapEntries, ...topNewsEntries, ...regularNewsEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: 'https://www.doutya.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}