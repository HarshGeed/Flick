/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/det4iaj3p/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
