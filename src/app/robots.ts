import { MetadataRoute } from 'next';

const BASE_URL = 'https://etf-dividend-web.pages.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Yeti',
          'OAI-SearchBot',
          'Claude-SearchBot',
          'PerplexityBot',
          'ChatGPT-User',
          'Claude-User',
          'Perplexity-User',
        ],
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
