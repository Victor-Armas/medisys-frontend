import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Permite todas las rutas dentro de Cloudinary
      },
    ],
  },
};

export default nextConfig;
