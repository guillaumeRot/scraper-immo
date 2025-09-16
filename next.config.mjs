/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("playwright"); // Empêche Next de bundler playwright
    return config;
  },
};

export default nextConfig;
