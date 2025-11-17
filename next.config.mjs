/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.VERCEL_URL ?? 'localhost']
    }
  }
};

export default nextConfig;
