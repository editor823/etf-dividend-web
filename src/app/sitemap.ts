import { MetadataRoute } from 'next';
import { GUIDE_POSTS } from '@/lib/data/guides-data';

const BASE_URL = 'https://etf-dividend-web.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. 기본 핵심 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. 가이드 블로그 아티클 동적 페이지
  const guidePages: MetadataRoute.Sitemap = GUIDE_POSTS.map((post) => ({
    url: `${BASE_URL}/guides/${post.slug}`,
    lastModified: post.publishedDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages];
}
