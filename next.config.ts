// next.config.ts

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ... aturan rewrite yang sudah ada
      {
        source: '/api/menu',
        destination: 'https://ayamgorengsuharti.vercel.app/api/menu',
      },
      {
        source: '/api/kategori',
        destination: 'https://ayamgorengsuharti.vercel.app/api/kategori',
      },
      {
        source: '/api/orders',
        destination: 'https://ayamgorengsuharti.vercel.app/api/orders',
      },
      {
        source: '/api/metode-pembayaran',
        destination: 'https://ayamgorengsuharti.vercel.app/api/metode-pembayaran',
      },
      {
        source: '/api/orders/:id',
        destination: 'https://ayamgorengsuharti.vercel.app/api/orders/:id',
      },
      {
        source: '/api/konfirmasi-pembayaran/:id',
        destination: 'https://ayamgorengsuharti.vercel.app/api/konfirmasi-pembayaran/:id',
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