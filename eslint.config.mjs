import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Compiled TypeScript output
    "dist/**",
    "**/dist/**",
    "*.tsbuildinfo",
    "**/*.tsbuildinfo",
    // OpenNext build output
    ".open-next/**",
    "**/.open-next/**",
    // Wrangler build output
    ".wrangler/**",
    "**/.wrangler/**",
    // Vercel build output (legacy)
    ".vercel/**",
    "**/.vercel/**",
  ]),
]);

export default eslintConfig;
