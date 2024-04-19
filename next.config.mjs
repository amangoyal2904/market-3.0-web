/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "img.etimg.com",
      },
    ],
  },
};

export default nextConfig;
