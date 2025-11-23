import { z } from 'zod';
import * as ss from 'simple-statistics';
import {
  ExecuteCalculationArgsSchema,
  CompareGroupsArgsSchema,
  TrendAnalysisArgsSchema,
  CorrelationAnalysisArgsSchema,
} from '../../schemas/args';

/**
 * Execute statistical calculation on a dataset
 *
 * Performs various statistical operations including mean, median, mode,
 * standard deviation, percentiles, and more.
 *
 * @param args - Calculation parameters including data and operation type
 * @returns Object containing the operation result and metadata
 */
export const executeCalculation = async (args: z.infer<typeof ExecuteCalculationArgsSchema>) => {
  const { data, operation, percentile_value } = args;

  let result: number | number[] | undefined;
  let description = '';

  switch (operation) {
    case 'mean':
      result = ss.mean(data);
      description = 'Average (arithmetic mean) of the dataset';
      break;

    case 'median':
      result = ss.median(data);
      description = 'Middle value of the dataset when sorted';
      break;

    case 'mode':
      result = ss.mode(data);
      description = 'Most frequently occurring value(s) in the dataset';
      break;

    case 'sum':
      result = ss.sum(data);
      description = 'Total sum of all values';
      break;

    case 'min':
      result = ss.min(data);
      description = 'Minimum value in the dataset';
      break;

    case 'max':
      result = ss.max(data);
      description = 'Maximum value in the dataset';
      break;

    case 'standardDeviation':
      result = ss.standardDeviation(data);
      description = 'Standard deviation (measure of variability)';
      break;

    case 'variance':
      result = ss.variance(data);
      description = 'Variance (square of standard deviation)';
      break;

    case 'percentile':
      if (percentile_value === undefined) {
        throw new Error('percentile_value is required when operation is "percentile"');
      }
      result = ss.quantile(data, percentile_value / 100);
      description = `${percentile_value}th percentile of the dataset`;
      break;

    case 'count':
      result = data.length;
      description = 'Number of data points';
      break;

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return {
    operation,
    result,
    description,
    data_points: data.length,
    input_range: {
      min: ss.min(data),
      max: ss.max(data),
    },
  };
};

/**
 * Compare statistics across multiple groups
 *
 * Computes the same statistical operation for each group and returns
 * a comparison with rankings and differences.
 *
 * @param args - Groups to compare and operation to perform
 * @returns Object with comparison results, rankings, and analysis
 */
export const compareGroups = async (args: z.infer<typeof CompareGroupsArgsSchema>) => {
  const { groups, operation } = args;

  const results = groups.map(group => {
    let value: number;

    switch (operation) {
      case 'mean':
        value = ss.mean(group.data);
        break;
      case 'median':
        value = ss.median(group.data);
        break;
      case 'sum':
        value = ss.sum(group.data);
        break;
      case 'min':
        value = ss.min(group.data);
        break;
      case 'max':
        value = ss.max(group.data);
        break;
      case 'count':
        value = group.data.length;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return {
      name: group.name,
      value,
      data_points: group.data.length,
      range: {
        min: ss.min(group.data),
        max: ss.max(group.data),
      },
    };
  });

  // Sort by value descending
  const ranked = [...results].sort((a, b) => b.value - a.value);

  // Calculate differences from best
  const best = ranked[0];
  const comparisons = ranked.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    data_points: item.data_points,
    difference_from_best: item.value - best.value,
    percentage_of_best: best.value !== 0 ? (item.value / best.value) * 100 : 0,
  }));

  return {
    operation,
    comparison: comparisons,
    summary: {
      best: {
        name: best.name,
        value: best.value,
      },
      worst: {
        name: ranked[ranked.length - 1].name,
        value: ranked[ranked.length - 1].value,
      },
      difference: best.value - ranked[ranked.length - 1].value,
    },
  };
};

/**
 * Analyze trends in time-series data
 *
 * Performs trend analysis including linear regression, growth rate calculation,
 * and moving averages to identify patterns over time.
 *
 * @param args - Time-series data points and analysis type
 * @returns Trend analysis results with predictions and insights
 */
export const trendAnalysis = async (args: z.infer<typeof TrendAnalysisArgsSchema>) => {
  const { data, analysis_type, window_size } = args;

  // Sort data by x value
  const sortedData = [...data].sort((a, b) => a.x - b.x);

  if (analysis_type === 'linear_regression') {
    const xValues = sortedData.map(d => d.x);
    const yValues = sortedData.map(d => d.y);

    const regression = ss.linearRegression([xValues, yValues]);
    const regressionLine = ss.linearRegressionLine(regression);

    // Calculate R-squared (coefficient of determination)
    const yMean = ss.mean(yValues);
    const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssRes = yValues.reduce(
      (sum, y, i) => sum + Math.pow(y - regressionLine(xValues[i]), 2),
      0,
    );
    const rSquared = 1 - ssRes / ssTot;

    return {
      analysis_type: 'linear_regression',
      regression: {
        slope: regression.m,
        intercept: regression.b,
        equation: `y = ${regression.m.toFixed(4)}x + ${regression.b.toFixed(4)}`,
      },
      r_squared: rSquared,
      trend_direction:
        regression.m > 0.1 ? 'increasing' : regression.m < -0.1 ? 'decreasing' : 'stable',
      interpretation:
        regression.m > 0
          ? `Positive trend: values increase by approximately ${regression.m.toFixed(2)} per unit increase in x`
          : regression.m < 0
            ? `Negative trend: values decrease by approximately ${Math.abs(regression.m).toFixed(2)} per unit increase in x`
            : 'Stable trend: values remain relatively constant',
      data_points: sortedData.length,
    };
  } else if (analysis_type === 'growth_rate') {
    if (sortedData.length < 2) {
      throw new Error('At least 2 data points required for growth rate analysis');
    }

    const firstValue = sortedData[0].y;
    const lastValue = sortedData[sortedData.length - 1].y;
    const periods = sortedData[sortedData.length - 1].x - sortedData[0].x;

    const totalGrowthRate = ((lastValue - firstValue) / firstValue) * 100;
    const averageGrowthRate = totalGrowthRate / periods;

    return {
      analysis_type: 'growth_rate',
      total_growth_rate: totalGrowthRate,
      average_growth_rate_per_period: averageGrowthRate,
      starting_value: firstValue,
      ending_value: lastValue,
      periods,
      interpretation:
        totalGrowthRate > 0
          ? `Growth of ${totalGrowthRate.toFixed(2)}% over ${periods} periods`
          : `Decline of ${Math.abs(totalGrowthRate).toFixed(2)}% over ${periods} periods`,
    };
  } else if (analysis_type === 'moving_average') {
    if (!window_size || window_size < 2) {
      throw new Error('window_size must be at least 2 for moving average');
    }

    if (sortedData.length < window_size) {
      throw new Error(
        `Not enough data points (${sortedData.length}) for window size ${window_size}`,
      );
    }

    const movingAverages: Array<{ x: number; y: number; average: number }> = [];

    for (let i = 0; i <= sortedData.length - window_size; i++) {
      const window = sortedData.slice(i, i + window_size);
      const average = ss.mean(window.map(d => d.y));
      movingAverages.push({
        x: window[Math.floor(window.length / 2)].x,
        y: window[Math.floor(window.length / 2)].y,
        average,
      });
    }

    return {
      analysis_type: 'moving_average',
      window_size,
      moving_averages: movingAverages,
      smoothed_trend:
        movingAverages[movingAverages.length - 1].average > movingAverages[0].average
          ? 'increasing'
          : 'decreasing',
      data_points: sortedData.length,
    };
  }

  throw new Error(`Unknown analysis type: ${analysis_type}`);
};

/**
 * Calculate correlation between two datasets
 *
 * Computes the Pearson correlation coefficient to measure the strength
 * and direction of the linear relationship between two variables.
 *
 * @param args - Two datasets to correlate
 * @returns Correlation coefficient and interpretation
 */
export const correlationAnalysis = async (args: z.infer<typeof CorrelationAnalysisArgsSchema>) => {
  const { dataset1, dataset2, dataset1_name, dataset2_name } = args;

  if (dataset1.length !== dataset2.length) {
    throw new Error('Both datasets must have the same number of data points');
  }

  if (dataset1.length < 2) {
    throw new Error('At least 2 data points required for correlation analysis');
  }

  const correlation = ss.sampleCorrelation(dataset1, dataset2);

  // Interpret correlation strength
  const absCorr = Math.abs(correlation);
  let strength = '';
  if (absCorr >= 0.9) strength = 'very strong';
  else if (absCorr >= 0.7) strength = 'strong';
  else if (absCorr >= 0.5) strength = 'moderate';
  else if (absCorr >= 0.3) strength = 'weak';
  else strength = 'very weak';

  const direction = correlation > 0 ? 'positive' : correlation < 0 ? 'negative' : 'no';

  return {
    correlation_coefficient: correlation,
    strength,
    direction,
    dataset1_name,
    dataset2_name,
    interpretation:
      correlation > 0
        ? `${strength} ${direction} correlation: as ${dataset1_name} increases, ${dataset2_name} tends to increase`
        : correlation < 0
          ? `${strength} ${direction} correlation: as ${dataset1_name} increases, ${dataset2_name} tends to decrease`
          : 'No linear correlation between the datasets',
    data_points: dataset1.length,
  };
};
