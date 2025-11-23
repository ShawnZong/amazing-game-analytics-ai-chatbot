import { z } from 'zod';

/**
 * Analysis Tool Argument Schemas
 *
 * Zod schemas for analysis tools that perform statistical calculations
 * and data analysis on game datasets.
 */

/**
 * Schema for execute_calculation tool
 * Performs statistical operations on a dataset
 */
export const ExecuteCalculationArgsSchema = z.object({
  data: z
    .array(z.number())
    .min(1)
    .describe(
      'Array of numeric values to analyze (e.g., Metacritic scores, ratings, release years)',
    ),
  operation: z
    .enum([
      'mean',
      'median',
      'mode',
      'sum',
      'min',
      'max',
      'standardDeviation',
      'variance',
      'percentile',
      'count',
    ])
    .describe('Statistical operation to perform on the data'),
  percentile_value: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe('Percentile value (0-100) when operation is "percentile"'),
  group_by: z.string().optional().describe('Optional field name to group data by (for future use)'),
});

/**
 * Schema for compare_groups tool
 * Compares statistics between two or more groups
 */
export const CompareGroupsArgsSchema = z.object({
  groups: z
    .array(
      z.object({
        name: z
          .string()
          .describe('Name of the group (e.g., "PlayStation", "Xbox", "Action Genre")'),
        data: z.array(z.number()).min(1).describe('Numeric data for this group'),
      }),
    )
    .min(2)
    .describe('Array of groups to compare, each with a name and data array'),
  operation: z
    .enum(['mean', 'median', 'sum', 'min', 'max', 'count'])
    .default('mean')
    .describe('Statistical operation to apply to each group'),
});

/**
 * Schema for trend_analysis tool
 * Analyzes trends in time-series data
 */
export const TrendAnalysisArgsSchema = z.object({
  data: z
    .array(
      z.object({
        x: z.number().describe('X-axis value (e.g., year, month, timestamp)'),
        y: z.number().describe('Y-axis value (e.g., rating, count, score)'),
      }),
    )
    .min(2)
    .describe('Array of data points with x and y coordinates'),
  analysis_type: z
    .enum(['linear_regression', 'growth_rate', 'moving_average'])
    .default('linear_regression')
    .describe('Type of trend analysis to perform'),
  window_size: z
    .number()
    .min(2)
    .optional()
    .describe('Window size for moving average (required if analysis_type is "moving_average")'),
});

/**
 * Schema for correlation_analysis tool
 * Finds correlation between two datasets
 */
export const CorrelationAnalysisArgsSchema = z.object({
  dataset1: z.array(z.number()).min(2).describe('First dataset (e.g., Metacritic scores)'),
  dataset2: z.array(z.number()).min(2).describe('Second dataset (e.g., user ratings)'),
  dataset1_name: z.string().default('Dataset 1').describe('Name of the first dataset'),
  dataset2_name: z.string().default('Dataset 2').describe('Name of the second dataset'),
});
