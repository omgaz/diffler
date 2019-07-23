exports.bench = function (f) {
  let ops = 0;
  const startMs = Date.now();
  const end = startMs + 1000;
  while(Date.now() < end) {
    f();
    ops++;
  }
  return ops;
};

exports.bench10 = function(f) {
  let ops = 0;
  for(let i = 0; i < 10; i++) {
    ops += exports.bench(f);
  }
  return ops / 10;
}
