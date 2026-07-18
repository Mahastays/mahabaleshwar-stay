import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/vendor/', '/bookings/', '/profile/'],
    },
    sitemap: 'https://mahastays.com/sitemap.xml',
  };
}
