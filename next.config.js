/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'graph.facebook.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        process: false,
      }
      
      // Exclude problematic packages from client bundle
      config.externals = config.externals || []
      config.externals.push({
        'undici': 'undici',
        '@firebase/auth': '@firebase/auth',
        'firebase/auth': 'firebase/auth'
      })
    }
    
    return config
  },
}

module.exports = nextConfig 