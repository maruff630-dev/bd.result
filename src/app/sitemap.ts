import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bd.result.vercel.app';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/result`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    // We could map all keywords or dynamic years here, but typically you just index main routes and maybe some static variations
    // Adding variations for SEO purpose
    {
      url: `${baseUrl}?exam=ssc`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}?exam=hsc`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}?year=2026`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}?year=2020`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    }
  ];
}
