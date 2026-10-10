import { MetadataRoute } from 'next';

const BASE_URL = 'https://etf-dividend-web.pages.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
