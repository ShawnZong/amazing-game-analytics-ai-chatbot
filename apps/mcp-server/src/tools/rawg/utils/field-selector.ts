/**
 * Field Selection Utility
 *
 * Allows clients to specify which fields they want from API responses.
 * Supports nested field selection using dot notation (e.g., "platforms.name").
 */

type FieldPath = string;
type FieldPaths = FieldPath[];

/**
 * Selects specified fields from a data object
 *
 * @param data - The data object to filter
 * @param fields - Array of field paths to include (e.g., ["id", "name", "platforms.name"])
 * @returns Filtered data object with only specified fields
 *
 * @example
 * ```ts
 * const data = { id: 1, name: "Game", rating: 4.5, platforms: [{ name: "PC" }] };
 * const filtered = selectFields(data, ["id", "name", "platforms.name"]);
 * // Returns: { id: 1, name: "Game", platforms: [{ name: "PC" }] }
 * ```
 */
export const selectFields = (
  data: unknown,
  fields?: FieldPaths,
): unknown => {
  // If no fields specified, return all data
  if (!fields || fields.length === 0) {
    return data;
  }

  // Handle null/undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => selectFields(item, fields));
  }

  // Handle objects
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    // Group fields by top-level key
    const fieldGroups = new Map<string, FieldPaths>();
    const topLevelFields = new Set<string>();

    for (const field of fields) {
      if (field.includes('.')) {
        const [topLevel, ...rest] = field.split('.');
        const nestedPath = rest.join('.');
        if (!fieldGroups.has(topLevel)) {
          fieldGroups.set(topLevel, []);
        }
        fieldGroups.get(topLevel)!.push(nestedPath);
      } else {
        topLevelFields.add(field);
      }
    }

    // Include top-level fields
    for (const field of topLevelFields) {
      if (field in obj) {
        result[field] = obj[field];
      }
    }

    // Include nested fields
    for (const [topLevel, nestedFields] of fieldGroups.entries()) {
      if (topLevel in obj) {
        result[topLevel] = selectFields(obj[topLevel], nestedFields);
      }
    }

    return result;
  }

  // Return primitive values as-is
  return data;
};

/**
 * Selects fields from paginated API responses
 *
 * Handles responses with structure: { count, next, previous, results: [...] }
 *
 * @param response - Paginated API response
 * @param fields - Array of field paths to include
 * @returns Filtered paginated response
 */
export const selectFieldsFromPaginatedResponse = (
  response: unknown,
  fields?: FieldPaths,
): unknown => {
  if (!fields || fields.length === 0) {
    return response;
  }

  if (typeof response === 'object' && response !== null) {
    const obj = response as Record<string, unknown>;

    // Check if this is a paginated response
    if ('results' in obj && Array.isArray(obj.results)) {
      return {
        ...obj,
        results: selectFields(obj.results, fields),
      };
    }
  }

  // Not a paginated response, apply field selection directly
  return selectFields(response, fields);
};

