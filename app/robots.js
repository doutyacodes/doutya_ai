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
      sitemap: 'www.zaeser.com/sitemap.xml',
    };
  }
  