/**
 * Runs the provided function as many times as possible.
 *
 * @param {Function} func - The function to benchmark.
 * @returns {number} The number of operations performed.
 */
function bench(func) {
  let ops = 0;
  const startMs = Date.now();
  const end = startMs + 1000;
  while (Date.now() < end) {
    func();
    ops++;
  }
  return ops;
}

/**
 * Runs the provided function 10 times and averages the results.
 *
 * @param {Function} func - The function to benchmark.
 * @returns {number} The average number of operations performed per second.
 */
function bench10(func) {
  let ops = 0;
  for (let i = 0; i < 10; i++) {
    ops += exports.bench(func);
  }
  return ops / 10; // Return the average ops/sec
}

// Export the benchmarking functions
exports.bench = bench;
exports.bench10 = bench10;
