// next.config.mjs

/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'multi-tool-website.vercel.app',
          },
        ],
        destination: 'https://dhanbyte.me:path*',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
};

export default config;
