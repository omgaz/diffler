const benchmarker = require('./benchmarker');
const diffler = require('../src');
const metadatav3 = require('./data/json-metadata-v3');
const metadatav2 = require('./data/json-metadata-v2');

const suite = function() {
  diffler(metadatav2, metadatav3);
}

const ops = benchmarker.bench10(suite);
const benchmark = 236941; // update value to set new benchmark
console.info(`Executed ${ops} ops/s`);
const diff = Math.round(100 - ((benchmark / ops) * 100));

if (diff === 0) {
  console.log('Bench complete: Code hasn\'t changed.');
  return;
} else if (diff < -10) {
  console.error(`Bench complete: Code ran ${Math.abs(diff)}% slower, it's time to do something.`);
  return;
}
const message = diff > 0 ? 'faster': 'slower';
console.info(`Bench complete: Code ran ${Math.abs(diff)}% ${message} than benchmark.`);
