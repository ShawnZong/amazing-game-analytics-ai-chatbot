import {
  ExecuteCalculationArgsSchema,
  CompareGroupsArgsSchema,
  TrendAnalysisArgsSchema,
  CorrelationAnalysisArgsSchema,
} from '@rawg-analytics/shared/schemas';
import {
  executeCalculation,
  compareGroups,
  trendAnalysis,
  correlationAnalysis,
} from '../tools/analysis/analysis';

/**
 * Analysis Tools
 *
 * Array of MCP tools for statistical analysis and data calculations.
 * These tools enable complex analytics on game data, including
 * statistical calculations, group comparisons, trend analysis, and correlations.
 *
 * Example use cases:
 * - "What's the average Metacritic score for PC games released in Q1 2024?"
 * - "Which genre had the most highly-rated games in 2023?"
 * - "How do PlayStation exclusive ratings compare to Xbox exclusives?"
 * - "Is there a correlation between Metacritic scores and user ratings?"
 */
export const ANALYSIS_TOOLS = [
  {
    name: 'execute_calculation',
    title: 'Execute Statistical Calculation',
    description:
      'Perform statistical calculations on numeric datasets. Supports operations including mean (average), median, mode, sum, min, max, standard deviation, variance, percentiles, and count. Use this to analyze game scores, ratings, release years, or any numeric game data. For example: calculate average Metacritic score, find median rating, or determine the 90th percentile of game prices.',
    schema: ExecuteCalculationArgsSchema,
    execute: executeCalculation,
  },
  {
    name: 'compare_groups',
    title: 'Compare Statistical Groups',
    description:
      'Compare statistics across multiple groups of data. Computes the same statistical operation (mean, median, sum, min, max, or count) for each group and provides rankings, differences, and percentage comparisons. Perfect for comparing platforms (PlayStation vs Xbox vs PC), genres (Action vs RPG vs Strategy), or time periods. Returns a ranked comparison with the best and worst performers identified.',
    schema: CompareGroupsArgsSchema,
    execute: compareGroups,
  },
  {
    name: 'trend_analysis',
    title: 'Analyze Trends Over Time',
    description:
      'Analyze time-series data to identify trends and patterns. Supports three types of analysis: (1) Linear Regression - finds the line of best fit and calculates slope to determine if values are rising or falling; (2) Growth Rate - calculates percentage change over time periods; (3) Moving Average - smooths data by averaging values within a sliding window. Use this to track rating trends by year, release patterns over time, or score evolution across game series.',
    schema: TrendAnalysisArgsSchema,
    execute: trendAnalysis,
  },
  {
    name: 'correlation_analysis',
    title: 'Calculate Correlation Between Datasets',
    description:
      'Calculate the Pearson correlation coefficient between two numeric datasets to measure the strength and direction of their linear relationship. Returns a correlation value from -1 (perfect negative correlation) to +1 (perfect positive correlation), with interpretation of strength (very weak, weak, moderate, strong, very strong) and direction (positive or negative). Use this to find relationships like: Do Metacritic scores correlate with user ratings? Is there a relationship between game length and ratings?',
    schema: CorrelationAnalysisArgsSchema,
    execute: correlationAnalysis,
  },
];
