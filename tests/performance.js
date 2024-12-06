const benchmarker = require('./benchmarker');
const diffler = require('../src');
const metadatav3 = require('./data/json-metadata-v3');
const metadatav2 = require('./data/json-metadata-v2');

/**
 * Function to run the diffler comparison as a benchmark suite.
 */
function suite() {
  diffler(metadatav2, metadatav3);
}

// Run the benchmark suite and get operations per second
const ops = benchmarker.bench10(suite);

// Set the benchmark value for comparison
const benchmark = 466763; // Update this value to set a new benchmark

// Log the number of operations per second
console.info(`Executed ${ops} ops/s`);

// Calculate the difference between the benchmark and the current ops
const opsDiff = benchmark / ops;
const opsDiffAsPercentage = Math.round(opsDiff * 100);
const opsDiffAsPercentageDifference = 100 - opsDiffAsPercentage;

// Check if the performance has changed
if (opsDiffAsPercentageDifference === 0) {
  console.log("Bench complete: Code hasn't changed.");
  return;
} else if (opsDiffAsPercentageDifference < -10) {
  console.error(
    `Bench complete: Code ran ${Math.abs(opsDiffAsPercentageDifference)}% slower, it's time to do something.`,
  );
  return;
}

// Determine if the code ran faster or slower than the benchmark
const message = opsDiffAsPercentageDifference > 0 ? 'faster' : 'slower';

// Log the performance difference
console.info(`Bench complete: Code ran ${Math.abs(opsDiffAsPercentageDifference)}% ${message} than benchmark.`);
