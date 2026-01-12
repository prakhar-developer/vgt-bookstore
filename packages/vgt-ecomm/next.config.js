/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // swcMinify is now default in Next. js 16 - REMOVE IT
  // No experimental features needed
}

module.exports = nextConfig