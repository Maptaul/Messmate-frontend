import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error("BACKEND_URL is not set. Copy .env.example to .env.local.");
}

const nextConfig: NextConfig = {
  reactCompiler: true,

  // The browser only ever talks to this app. Proxying the API through our own
  // origin makes the backend's auth cookies first-party, so proxy.ts can read
  // them and no browser treats them as third-party.
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl.replace(/\/+$/, "")}/api/v1/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
