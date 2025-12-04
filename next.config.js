/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Оптимизации для мобильных
  poweredByHeader: false,
  compress: true,
  // Предотвращаем кэширование проблем
  generateEtags: true,
}

module.exports = nextConfig