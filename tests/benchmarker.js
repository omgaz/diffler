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

function bench10(func) {
  let ops = 0;
  for (let i = 0; i < 10; i++) {
    ops += exports.bench(func);
  }
  return ops / 10;
}

exports.bench = bench;
exports.bench10 = bench10;
