import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openApiPath = join(__dirname, '../src/schemas/rawg-api-openapi.json');
const outputPath = join(__dirname, '../src/schemas/rawg-generated.ts');

const spec = JSON.parse(readFileSync(openApiPath, 'utf-8'));

// Helper to convert OpenAPI type to Zod schema
const typeToZod = (param) => {
  const { type, format, description } = param;
  
  let schema = '';
  
  if (type === 'string') {
    schema = 'z.string()';
  } else if (type === 'integer' || type === 'number') {
    schema = 'z.number()';
  } else if (type === 'boolean') {
    schema = 'z.boolean()';
  } else {
    schema = 'z.unknown()';
  }
  
  // Handle union types for path parameters (can be string or number)
  if (param.in === 'path' && (type === 'string' || type === 'integer')) {
    schema = 'z.union([z.string(), z.number()])';
  }
  
  // Make optional if not required
  if (!param.required && param.in !== 'path') {
    schema += '.optional()';
  }
  
  // Add description if available
  if (description) {
    schema += `.describe(${JSON.stringify(description)})`;
  }
  
  return schema;
};

// Extract games endpoints
const gamesEndpoints = Object.entries(spec.paths).filter(([path]) => path.startsWith('/games'));

const schemas = [];
const exports = [];

// Common pagination schema
const paginationFields = `
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().optional().describe('Number of results to return per page.'),`;

gamesEndpoints.forEach(([path, methods]) => {
  const getMethod = methods.get;
  if (!getMethod) return;
  
  const operationId = getMethod.operationId;
  const summary = getMethod.summary || '';
  
  // Extract path and query parameters
  const pathParams = [];
  const queryParams = [];
  
  // Get parameters from operation
  const operationParams = getMethod.parameters || [];
  // Also check path-level parameters
  const pathLevelParams = methods.parameters || [];
  const allParams = [...operationParams, ...pathLevelParams];
  
  allParams.forEach(param => {
    if (param.in === 'path') {
      pathParams.push(param);
    } else if (param.in === 'query') {
      queryParams.push(param);
    }
  });
  
  // Generate schema name (convert to PascalCase, handle hyphens)
  const schemaName = operationId
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'ArgsSchema';
  
  // Build schema fields (use Map to deduplicate)
  const fieldMap = new Map();
  
  // Add path parameters first
  pathParams.forEach(param => {
    if (!fieldMap.has(param.name)) {
      const zodSchema = typeToZod(param);
      fieldMap.set(param.name, zodSchema);
    }
  });
  
  // Add query parameters
  queryParams.forEach(param => {
    if (!fieldMap.has(param.name)) {
      const zodSchema = typeToZod(param);
      fieldMap.set(param.name, zodSchema);
    }
  });
  
  // Convert map to array of field strings
  const fields = Array.from(fieldMap.entries()).map(([name, schema]) => 
    `  ${name}: ${schema},`
  );
  
  // Build schema
  const schemaCode = `export const ${schemaName} = z.object({
${fields.join('\n')}
});`;
  
  schemas.push(schemaCode);
  exports.push(schemaName);
});

// Generate the file
const fileContent = `import { z } from 'zod';

// Auto-generated Zod schemas from OpenAPI specification
// DO NOT EDIT MANUALLY - This file is generated from rawg-api-openapi.json

${schemas.join('\n\n')}
`;

writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`✅ Generated Zod schemas: ${exports.length} schemas`);
console.log(`📝 Output: ${outputPath}`);

