import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    POCKETBASE_URL: 'http://openclaw-pocketbase-293529-91-98-173-16316.traefik.me',
  },
}

export default nextConfig
