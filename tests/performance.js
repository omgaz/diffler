const benchmarker = require('./benchmarker');
const diffler = require('../src');
const metadatav3 = require('./data/json-metadata-v3');
const metadatav2 = require('./data/json-metadata-v2');

function suite() {
  diffler(metadatav2, metadatav3);
}

const ops = benchmarker.bench10(suite);
const benchmark = 255538; // update value to set new benchmark
console.info(`Executed ${ops} ops/s`);
const opsDiff = benchmark / ops;
const opsDiffAsPercentage = Math.round(opsDiff * 100);
const opsDiffAsPercentageDifference = 100 - opsDiffAsPercentage;

if (opsDiffAsPercentageDifference === 0) {
  console.log("Bench complete: Code hasn't changed.");
  return;
} else if (opsDiffAsPercentageDifference < -10) {
  console.error(
    `Bench complete: Code ran ${Math.abs(opsDiffAsPercentageDifference)}% slower, it's time to do something.`,
  );
  return;
}
const message = opsDiffAsPercentageDifference > 0 ? 'faster' : 'slower';
console.info(`Bench complete: Code ran ${Math.abs(opsDiffAsPercentageDifference)}% ${message} than benchmark.`);
