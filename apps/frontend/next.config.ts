// next.config.mjs
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Initialize Cloudflare adapter for dev
await initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your existing Next.js config here
};

export default nextConfig;
