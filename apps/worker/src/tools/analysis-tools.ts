/**
 * Analysis-related LangChain tools
 * 
 * This module provides 4 tools for statistical analysis of game data:
 * - Execute calculations (mean, median, mode, etc.)
 * - Compare groups
 * - Trend analysis
 * - Correlation analysis
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import {
  ExecuteCalculationArgsSchema,
  CompareGroupsArgsSchema,
  TrendAnalysisArgsSchema,
  CorrelationAnalysisArgsSchema,
} from '@rawg-analytics/shared/schemas';
import { createMcpTool } from './utils/tool-factory';
import type { Env } from '../lib/types';

/**
 * Creates a tool to perform statistical calculations
 */
export const createExecuteCalculationTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'execute_calculation',
    'Perform statistical calculations on numeric datasets. Supports operations including mean (average), median, mode, sum, min, max, standard deviation, variance, percentiles, and count. Use this to analyze game scores, ratings, release years, or any numeric game data. For example: calculate average Metacritic score, find median rating, or determine the 90th percentile of game prices.',
    ExecuteCalculationArgsSchema
  );

/**
 * Creates a tool to compare statistics across groups
 */
export const createCompareGroupsTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'compare_groups',
    'Compare statistics across multiple groups of data. Computes the same statistical operation (mean, median, sum, min, max, or count) for each group and provides rankings, differences, and percentage comparisons. Perfect for comparing platforms (PlayStation vs Xbox vs PC), genres (Action vs RPG vs Strategy), or time periods. Returns a ranked comparison with the best and worst performers identified.',
    CompareGroupsArgsSchema
  );

/**
 * Creates a tool to analyze trends in time-series data
 */
export const createTrendAnalysisTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'trend_analysis',
    'Analyze time-series data to identify trends and patterns. Supports three types of analysis: (1) Linear Regression - finds the line of best fit and calculates slope to determine if values are rising or falling; (2) Growth Rate - calculates percentage change over time periods; (3) Moving Average - smooths data by averaging values within a sliding window. Use this to track rating trends by year, release patterns over time, or score evolution across game series.',
    TrendAnalysisArgsSchema
  );

/**
 * Creates a tool to calculate correlations between datasets
 */
export const createCorrelationAnalysisTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'correlation_analysis',
    'Calculate the Pearson correlation coefficient between two numeric datasets to measure the strength and direction of their linear relationship. Returns a correlation value from -1 (perfect negative correlation) to +1 (perfect positive correlation), with interpretation of strength (very weak, weak, moderate, strong, very strong) and direction (positive or negative). Use this to find relationships like: Do Metacritic scores correlate with user ratings? Is there a relationship between game length and ratings?',
    CorrelationAnalysisArgsSchema
  );

/**
 * Creates all analysis-related tools
 * 
 * @param env - Cloudflare Worker environment
 * @returns Array of 4 analysis tools
 */
export const createAnalysisTools = (env: Env): DynamicStructuredTool[] => [
  createExecuteCalculationTool(env),
  createCompareGroupsTool(env),
  createTrendAnalysisTool(env),
  createCorrelationAnalysisTool(env),
];

