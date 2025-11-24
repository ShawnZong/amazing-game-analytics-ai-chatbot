import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  /**
   * R2 Incremental Cache (Optional)
   * 
   * Uncomment to enable R2-based caching for Next.js incremental static regeneration.
   * This can significantly improve performance for pages with ISR, but requires:
   * 1. An R2 bucket to be created in your Cloudflare account
   * 2. R2 bucket binding in wrangler.jsonc
   * 3. R2 storage costs (pay-as-you-go pricing)
   * 
   * To enable:
   * 1. Create an R2 bucket in Cloudflare Dashboard
   * 2. Add R2 binding to wrangler.jsonc:
   *    "r2_buckets": [{ "binding": "CACHE", "bucket_name": "your-bucket-name" }]
   * 3. Uncomment the import and incrementalCache line below
   * 
   * Docs: https://opennext.js.org/cloudflare/caching
   */
  // import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
  // incrementalCache: r2IncrementalCache,
});
