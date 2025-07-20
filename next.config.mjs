// next.config.mjs

export default {
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
        destination: 'https://multi-tool-website.dhanbyte.me',
        permanent: true,
      },
    ];
  },
};
