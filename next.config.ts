/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akrbqrnjbqackswyymjx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/imagens/**",
      },
    ],
  },
};

module.exports = nextConfig;
