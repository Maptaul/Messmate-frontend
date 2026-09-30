/** Running totals: [1, 2, 3] → [1, 3, 6]. */
export const cumulative = (values: number[]) => {
  let sum = 0;
  return values.map((value) => {
    sum += value;
    return sum;
  });
};

/** The last few points of a series — what a KPI sparkline draws. */
export const lastPoints = (values: number[], count = 7) => values.slice(-count);
