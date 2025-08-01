
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
   return [
    {
        source: '/(.*)',
         headers: [
          {
             key: 'X-Frame-Options',
             value: 'ALLOWALL',
             },
             ],
            },
          ];
        },
      };
      export default nextConfig;

