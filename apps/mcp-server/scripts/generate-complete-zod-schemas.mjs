import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openApiPath = join(__dirname, '../src/schemas/rawg-api-openapi.json');
const outputPath = join(__dirname, '../src/schemas/rawg-api-openapi-zod.ts');

const spec = JSON.parse(readFileSync(openApiPath, 'utf-8'));

// Track all referenced definitions
const referencedDefinitions = new Set();

/**
 * Convert OpenAPI property to Zod schema string
 */
const propertyToZod = (prop, propName, required = []) => {
  const isRequired = required.includes(propName);

  if (prop.$ref) {
    const defName = prop.$ref.split('/').pop();
    referencedDefinitions.add(defName);
    return `${defName}Schema`;
  }

  let schema = '';

  // Handle type
  if (prop.type === 'string') {
    schema = 'z.string()';

    // Handle string formats
    if (prop.format === 'date') {
      schema = 'z.string()'; // Keep as string, add description
    } else if (prop.format === 'date-time') {
      schema = 'z.string()'; // Keep as string, add description
    } else if (prop.format === 'uri') {
      schema = 'z.string().url()';
    } else if (prop.format === 'slug') {
      schema = 'z.string()';
    } else if (prop.format === 'decimal') {
      schema = 'z.string()'; // Keep as string for decimal
    }

    // Handle string constraints
    if (prop.minLength !== undefined) {
      schema += `.min(${prop.minLength})`;
    }
    if (prop.maxLength !== undefined) {
      schema += `.max(${prop.maxLength})`;
    }
    if (prop.pattern) {
      // Escape backslashes in regex patterns
      const escapedPattern = prop.pattern.replace(/\\/g, '\\\\');
      schema += `.regex(/${escapedPattern}/)`;
    }
    if (prop.enum) {
      const enumValues = prop.enum.map(v => JSON.stringify(v)).join(', ');
      schema = `z.enum([${enumValues}])`;
    }
  } else if (prop.type === 'integer') {
    schema = 'z.number().int()';
    if (prop.minimum !== undefined) {
      schema += `.min(${prop.minimum})`;
    }
    if (prop.maximum !== undefined) {
      schema += `.max(${prop.maximum})`;
    }
  } else if (prop.type === 'number') {
    schema = 'z.number()';
  } else if (prop.type === 'boolean') {
    schema = 'z.boolean()';
  } else if (prop.type === 'array') {
    if (prop.items) {
      const itemSchema = propertyToZod(prop.items, propName + 'Item', []);
      schema = `z.array(${itemSchema})`;
    } else {
      schema = 'z.array(z.unknown())';
    }
  } else if (prop.type === 'object') {
    if (prop.properties) {
      const objProps = Object.entries(prop.properties)
        .map(([name, p]) => {
          const propSchema = propertyToZod(p, name, prop.required || []);
          return `    ${name}: ${propSchema},`;
        })
        .join('\n');
      schema = `z.object({\n${objProps}\n  })`;
    } else {
      schema = 'z.record(z.unknown())';
    }
  } else {
    schema = 'z.unknown()';
  }

  // Handle nullable
  if (prop['x-nullable']) {
    schema += '.nullable()';
  }

  // Handle optional
  if (!isRequired && prop.readOnly !== true) {
    schema += '.optional()';
  }

  return schema;
};

/**
 * Convert OpenAPI parameter to Zod schema
 */
const parameterToZod = param => {
  let schema = '';

  if (param.type === 'string') {
    schema = 'z.string()';
  } else if (param.type === 'integer') {
    schema = 'z.number().int()';
  } else if (param.type === 'number') {
    schema = 'z.number()';
  } else if (param.type === 'boolean') {
    schema = 'z.boolean()';
  } else {
    schema = 'z.unknown()';
  }

  // Path parameters can be string or number
  if (param.in === 'path') {
    schema = 'z.union([z.string(), z.number()])';
  }

  if (!param.required && param.in !== 'path') {
    schema += '.optional()';
  }

  return schema;
};

/**
 * Generate Zod schema for an OpenAPI definition
 */
const generateDefinitionSchema = (defName, definition) => {
  if (!definition || !definition.type) {
    return `export const ${defName}Schema = z.unknown();`;
  }

  const required = definition.required || [];
  const properties = definition.properties || {};

  const props = Object.entries(properties)
    .map(([propName, prop]) => {
      const zodSchema = propertyToZod(prop, propName, required);
      return `  ${propName}: ${zodSchema},`;
    })
    .join('\n');

  return `export const ${defName}Schema = z.object({\n${props}\n});`;
};

/**
 * Generate response schema from OpenAPI response definition
 */
const generateResponseSchema = response => {
  if (!response || !response.schema) {
    return 'z.void()';
  }

  const schema = response.schema;

  if (schema.$ref) {
    const defName = schema.$ref.split('/').pop();
    referencedDefinitions.add(defName);
    return `${defName}Schema`;
  }

  // Handle inline object schemas
  if (schema.type === 'object' && schema.properties) {
    const required = schema.required || [];
    const props = Object.entries(schema.properties)
      .map(([propName, prop]) => {
        const zodSchema = propertyToZod(prop, propName, required);
        return `    ${propName}: ${zodSchema},`;
      })
      .join('\n');
    return `z.object({\n${props}\n  })`;
  }

  return 'z.unknown()';
};

console.log('🔨 Generating Zod schemas from OpenAPI specification...\n');

// First pass: Generate all definition schemas
const definitions = spec.definitions || {};
const definitionSchemas = [];

// Mark all definitions as potentially referenced
Object.keys(definitions).forEach(defName => {
  referencedDefinitions.add(defName);
});

console.log(`📦 Found ${Object.keys(definitions).length} definitions`);

// Generate schemas for all definitions
Object.entries(definitions).forEach(([defName, definition]) => {
  const schemaCode = generateDefinitionSchema(defName, definition);
  definitionSchemas.push({ name: defName, code: schemaCode });
});

// Generate endpoints
const endpoints = [];
let endpointCount = 0;

console.log(`🔗 Processing ${Object.keys(spec.paths).length} API paths...\n`);

Object.entries(spec.paths).forEach(([path, methods]) => {
  const getMethod = methods.get;
  if (!getMethod) return;

  endpointCount++;
  const operationId = getMethod.operationId;
  const summary = getMethod.summary || '';
  const description = getMethod.description || '';

  // Convert path from OpenAPI format to Zodios format
  const zodiosPath = path.replace(/{([^}]+)}/g, ':$1');

  // Collect all parameters
  const operationParams = getMethod.parameters || [];
  const pathLevelParams = methods.parameters || [];
  const allParams = [...operationParams, ...pathLevelParams];

  // Deduplicate parameters by name
  const paramMap = new Map();
  allParams.forEach(param => {
    if (!paramMap.has(param.name)) {
      paramMap.set(param.name, param);
    }
  });

  // Generate parameter definitions
  const parameters = Array.from(paramMap.values()).map(param => {
    const typeLabel = param.in === 'path' ? 'Path' : 'Query';
    const zodSchema = parameterToZod(param);

    return `      {
        name: "${param.name}",
        type: "${typeLabel}",
        schema: ${zodSchema},
      }`;
  });

  // Get response schema
  const response = getMethod.responses['200'];
  const responseSchema = generateResponseSchema(response);

  // Build endpoint object
  const endpointCode = `  {
    method: "get",
    path: "${zodiosPath}",
    alias: "${operationId}",${description ? `\n    description: ${JSON.stringify(description)},` : ''}
    requestFormat: "json",
    parameters: [
${parameters.join(',\n')}
    ],
    response: ${responseSchema},
  }`;

  endpoints.push(endpointCode);
});

console.log(`✅ Generated ${endpointCount} endpoint definitions`);
console.log(`✅ Generated ${definitionSchemas.length} type schemas\n`);

// Generate the complete file
const fileContent = `import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

// Type Schemas from OpenAPI Definitions
${definitionSchemas.map(def => def.code).join('\n\n')}

// API Endpoints
const endpoints = makeApi([
${endpoints.join(',\n')}
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
`;

writeFileSync(outputPath, fileContent, 'utf-8');

console.log('✨ Successfully generated complete Zod schemas!');
console.log(`📝 Output file: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - ${definitionSchemas.length} type definitions`);
console.log(`   - ${endpointCount} API endpoints`);
console.log(`   - ${referencedDefinitions.size} referenced types\n`);
