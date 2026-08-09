/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.tebex.io" },
      { protocol: "https", hostname: "*.tebex.io" },
      { protocol: "https", hostname: "cdn.tebex.io" },
    ],
  },
};

module.exports = nextConfig;
