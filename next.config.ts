// next.config.ts

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ... aturan rewrite yang sudah ada
      {
        source: '/api/menu',
        destination: 'https://www.ayamgorengsuharti.com/api/menu',
      },
      {
        source: '/api/kategori',
        destination: 'https://www.ayamgorengsuharti.com/api/kategori',
      },
      {
        source: '/api/orders',
        destination: 'https://www.ayamgorengsuharti.com/api/orders',
      },
      {
        source: '/api/metode-pembayaran',
        destination: 'https://www.ayamgorengsuharti.com/api/metode-pembayaran',
      },
      {
        source: '/api/orders/:id',
        destination: 'https://www.ayamgorengsuharti.com/api/orders/:id',
      },
      {
        source: '/api/konfirmasi-pembayaran/:id',
        destination: 'https://www.ayamgorengsuharti.com/api/konfirmasi-pembayaran/:id',
      },
       {
        source: '/api/menu/:id',
        destination: 'https://www.ayamgorengsuharti.com/api/menu/:id',
      },
    ]
  },

  // TAMBAHKAN BLOK INI
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hhfjdkifsrugdgvfrciw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig