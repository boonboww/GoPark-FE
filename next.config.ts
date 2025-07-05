// next.config.js (nếu dùng .ts thì là next.config.ts)
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ bỏ qua ESLint khi build
  },
  // Bạn có thể thêm config khác ở đây (nếu có)
};

module.exports = nextConfig;
