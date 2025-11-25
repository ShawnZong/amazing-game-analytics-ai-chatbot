import { generate } from 'openapi-zod-client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFile = join(__dirname, '../src/schemas/rawg-api-openapi.json');
const outputDir = join(__dirname, '../src/schemas/generated');

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

try {
  await generate({
    input: inputFile,
    output: outputDir,
    // Only generate schemas, not the full client
    // We'll extract what we need
  });
  console.log('✅ Zod schemas generated successfully!');
} catch (error) {
  console.error('❌ Error generating schemas:', error);
  process.exit(1);
}


