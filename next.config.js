/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Additional ignores for common PDF.js build issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    if (isServer) {
      config.externals.push({ canvas: 'commonjs canvas' });
    }

    return config;
  },
};

module.exports = nextConfig;
