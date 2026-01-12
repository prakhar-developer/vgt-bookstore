/** @type {import('next').NextConfig} */
const nextConfig = {
  images:  {
    remotePatterns:  [
      {
        protocol:  'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  webpack: (config, { isServer }) => {
    // Disable cache
    config.cache = false;
    
    // Ignore MongoDB optional dependencies (not needed for basic usage)
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'aws4': 'commonjs aws4',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        'kerberos': 'commonjs kerberos',
        '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
        'gcp-metadata': 'commonjs gcp-metadata',
        'snappy': 'commonjs snappy',
        'socks': 'commonjs socks',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      });
    }
    
    return config;
  },
};

module.exports = nextConfig;