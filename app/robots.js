export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/',
          '/.next/',
        ],
      },
      sitemap: 'https://axaranews.com/sitemap.xml',
    };
  }
  