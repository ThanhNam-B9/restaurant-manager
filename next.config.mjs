/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "4000",
      // },
      {
        hostname: "api-bigboy.duthanhduoc.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
