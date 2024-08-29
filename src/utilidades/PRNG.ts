let s = 1234;
const p = 999979; //9887//983
const q = 999983; //9967//991
const m = p * q;

const hash = (x: number) => {
  const y = window.btoa(JSON.stringify(x));
  let z = 0;
  for (let i = 0; i < y.length; i++) {
    z += y.charCodeAt(i) * Math.pow(128, i);
  }
  return z;
};

export function seed(x: number) {
  if (x == undefined) {
    x = new Date().getTime();
  }
  let y = 0;
  let z = 0;

  function redo() {
    y = (hash(x) + z) % m;
    z += 1;
  }

  while (y % p == 0 || y % q == 0 || y == 0 || y == 1) {
    redo();
  }

  s = y;
  console.log(['int seed', s]);
  for (var i = 0; i < 10; i++) {
    next();
  }
}

function next() {
  s = (s * s) % m;
  return s / m;
}

export function test(f: () => number) {
  const F =
    f ||
    function () {
      return next();
    };
  const t0 = new Date().getTime();
  const chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < 10000000; i++) {
    chart[Math.floor(F() * 10)] += 1;
  }
  console.log(chart);
  console.log('finished in ' + (new Date().getTime() - t0));
  return chart;
}

Math.random = function () {
  return next();
};
