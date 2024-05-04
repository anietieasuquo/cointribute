import CircularDependencyPlugin from 'circular-dependency-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (webpackConfig, { webpack, isServer }) => {
    webpackConfig.plugins.push(
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd()
      })
    );
    webpackConfig.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, '');
        switch (mod) {
          case 'buffer':
            resource.request = 'buffer';
            break;
          case 'stream':
            resource.request = 'readable-stream';
            break;
          case 'crypto':
            resource.request = 'crypto';
            break;
          case 'fs':
            resource.request = 'fs';
            break;
          default:
            throw new Error(`Not found ${mod}`);
        }
      })
    );
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      buffer: 'buffer',
      stream: 'readable-stream',
      crypto: 'crypto',
      fs: 'fs'
    };

    webpackConfig.resolve.fallback = {
      fs: false
    };

    if (!isServer) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        fs: 'empty'
      };
    }

    return webpackConfig;
  },
  experimental: {
    esmExternals: false
  }
};

export default nextConfig;
