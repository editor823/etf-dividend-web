import { MetadataRoute } from 'next';
import { GUIDE_POSTS } from '@/lib/data/guides-data';

const BASE_URL = 'https://etf-dividend-web.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. 기본 핵심 정적 페이지 (실제 변경 및 공시 기준일 제공)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: '2026-03-25',
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: '2026-03-25',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: '2026-03-25',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: '2026-03-15',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: '2026-03-15',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: '2026-03-15',
      changeFrequency: 'monthly',
      priority: 0.6,
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
