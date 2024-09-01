import type { ArgsArbol1, ArgsArbol2, ArgsArbol3, ArgsTwig, Punto } from '@/tipos';
import { DOS_PI, MEDIO_PI, PI, TRES_PI } from '@/utilidades/constantes';
import { blob, div, stroke } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { buscarCentro, triangulate } from '@/utilidades/Polytools';
import { distance, loopNoise, normRand, poly, randChoice, randGaussian } from '@/utilidades/Util';

export function tree01(x: number, y: number, args: ArgsArbol1) {
  const predeterminados = {
    alto: 50,
    ancho: 3,
    col: 'rgba(100,100,100,0.5)',
    noi: 0.5,
  };

  const { alto, ancho, col } = { ...predeterminados, ...args };

  let reso = 10;
  const nslist = [];

  for (let i = 0; i < reso; i++) {
    nslist.push([noise(i * 0.5), noise(i * 0.5, 0.5)]);
  }

  let leafcol;

  if (col.includes('rgba(')) {
    leafcol = col.replace('rgba(', '').replace(')', '').split(',');
  } else {
    leafcol = ['100', '100', '100', '0.5'];
  }

  let canv = '';
  const line1: Punto[] = [];
  const line2: Punto[] = [];

  for (let i = 0; i < reso; i++) {
    const nx = x;
    const ny = y - (i * alto) / reso;

    if (i >= reso / 4) {
      for (let j = 0; j < (reso - i) / 5; j++) {
        const [r, g, b] = leafcol;
        canv += blob(nx + (Math.random() - 0.5) * ancho * 1.2 * (reso - i), ny + (Math.random() - 0.5) * ancho, {
          len: Math.random() * 20 * (reso - i) * 0.2 + 10,
          ancho: Math.random() * 6 + 3,
          ang: ((Math.random() - 0.5) * PI) / 6,
          col: `rgba(${r},${g},${b},${(Math.random() * 0.2 + parseFloat(leafcol[3])).toFixed(1)})`,
        });
      }
    }
    line1.push([nx + (nslist[i][0] - 0.5) * ancho - ancho / 2, ny]);
    line2.push([nx + (nslist[i][1] - 0.5) * ancho + ancho / 2, ny]);
  }
  canv += poly(line1, { fil: 'none', str: col, ancho: 1.5 }) + poly(line2, { fil: 'none', str: col, ancho: 1.5 });
  return canv;
}

export function tree02(x: number, y: number, args?: ArgsArbol2) {
  const predeterminados = {
    alto: 16,
    ancho: 8,
    clu: 5,
    col: 'rgba(100,100,100,0.5)',
    noi: 0.5,
  };

  const { alto, ancho, clu, col } = { ...predeterminados, ...args };

  let leafcol;

  if (col.includes('rgba(')) {
    leafcol = col.replace('rgba(', '').replace(')', '').split(',');
  } else {
    leafcol = ['100', '100', '100', '0.5'];
  }

  let canv = '';

  for (let i = 0; i < clu; i++) {
    canv += blob(x + randGaussian() * clu * 4, y + randGaussian() * clu * 4, {
      ang: MEDIO_PI,
      fun: (x: number) => {
        return x <= 1 ? Math.pow(Math.sin(x * PI) * x, 0.5) : -Math.pow(Math.sin((x - 2) * PI * (x - 2)), 0.5);
      },
      ancho: Math.random() * ancho * 0.75 + ancho * 0.5,
      len: Math.random() * alto * 0.75 + alto * 0.5,
      col,
    });
  }

  return canv;
}

export function tree03(x: number, y: number, args: ArgsArbol3) {
  const predeterminados = {
    alto: 50,
    ancho: 5,
    ben: () => 0,
    col: 'rgba(100,100,100,0.5)',
    noi: 0.5,
  };

  const { alto, ancho, ben, col } = { ...predeterminados, ...args };

  const reso = 10;
  const nslist = [];
  for (let i = 0; i < reso; i++) {
    nslist.push([noise(i * 0.5), noise(i * 0.5, 0.5)]);
  }

  let leafcol;
  if (col.includes('rgba(')) {
    leafcol = col.replace('rgba(', '').replace(')', '').split(',');
  } else {
    leafcol = ['100', '100', '100', '0.5'];
  }
  let canv = '';
  let blobs = '';
  const line1 = [];
  const line2 = [];

  for (let i = 0; i < reso; i++) {
    const nx = x + ben(i / reso) * 100;
    const ny = y - (i * alto) / reso;
    if (i >= reso / 5) {
      for (let j = 0; j < (reso - i) * 2; j++) {
        const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
        const ox = Math.random() * ancho * 2 * shape((reso - i) / reso);
        const [r, g, b] = leafcol;

        blobs += blob(nx + ox * randChoice<number>([-1, 1]), ny + (Math.random() - 0.5) * ancho * 2, {
          len: ox * 2,
          ancho: Math.random() * 6 + 3,
          ang: ((Math.random() - 0.5) * PI) / 6,
          col: `rgba(${r},${g},${b},${(Math.random() * 0.2 + parseFloat(leafcol[3])).toFixed(3)})`,
        });
      }
    }
    line1.push([nx + (((nslist[i][0] - 0.5) * ancho - ancho / 2) * (reso - i)) / reso, ny]);
    line2.push([nx + (((nslist[i][1] - 0.5) * ancho + ancho / 2) * (reso - i)) / reso, ny]);
  }
  const lc = line1.concat(line2.reverse());
  canv += poly(lc, { fil: 'white', str: col, ancho: 1.5 });
  canv += blobs;
  return canv;
}

function branch(args: ArgsArbol1) {
  const predeterminadoRama = {
    alto: 300,
    ancho: 6,
    ang: 0,
    det: 10,
    ben: PI * 0.2,
  };
  const { alto, ancho, ang, det, ben } = { ...predeterminadoRama, ...args };

  let tlist;
  let nx = 0;
  let ny = 0;
  tlist = [[nx, ny]];
  let a0 = 0;
  const g = 3;

  for (let i = 0; i < g; i++) {
    a0 += (ben / 2 + (Math.random() * ben) / 2) * randChoice<number>([-1, 1]);
    nx += (Math.cos(a0) * alto) / g;
    ny -= (Math.sin(a0) * alto) / g;
    tlist.push([nx, ny]);
  }

  const ta = Math.atan2(tlist[tlist.length - 1][1], tlist[tlist.length - 1][0]);

  for (let i = 0; i < tlist.length; i++) {
    const a = Math.atan2(tlist[i][1], tlist[i][0]);
    const d = Math.sqrt(tlist[i][0] * tlist[i][0] + tlist[i][1] * tlist[i][1]);
    tlist[i][0] = d * Math.cos(a - ta + ang);
    tlist[i][1] = d * Math.sin(a - ta + ang);
  }

  const trlist1 = [];
  const trlist2 = [];
  const span = det;
  const tl = (tlist.length - 1) * span;
  let lx = 0;
  let ly = 0;

  for (let i = 0; i < tl; i += 1) {
    const lastp = tlist[Math.floor(i / span)];
    const nextp = tlist[Math.ceil(i / span)];
    const p = (i % span) / span;
    const nx = lastp[0] * (1 - p) + nextp[0] * p;
    const ny = lastp[1] * (1 - p) + nextp[1] * p;

    const ang = Math.atan2(ny - ly, nx - lx);
    const woff = ((noise(i * 0.3) - 0.5) * ancho * alto) / 80;

    let b = 0;
    if (p == 0) {
      b = Math.random() * ancho;
    }

    const nw = ancho * (((tl - i) / tl) * 0.5 + 0.5);
    trlist1.push([nx + Math.cos(ang + MEDIO_PI) * (nw + woff + b), ny + Math.sin(ang + MEDIO_PI) * (nw + woff + b)]);
    trlist2.push([nx + Math.cos(ang - MEDIO_PI) * (nw - woff + b), ny + Math.sin(ang - MEDIO_PI) * (nw - woff + b)]);
    lx = nx;
    ly = ny;
  }

  return [trlist1, trlist2];
}

function twig(tx: number, ty: number, dep: number, args: ArgsTwig) {
  const predeterminados = { dir: 1, sca: 1, ancho: 1, ang: 0, lea: [true, 12] };
  const { dir, sca, ancho, ang, lea } = { ...predeterminados, ...args };

  let canv = '';
  const twlist = [];
  const tl = 10;
  const hs = Math.random() * 0.5 + 0.5;
  const fun1 = (x: number) => Math.pow(x, 0.5);
  const fun2 = (i: number) => -1 / Math.pow(i / tl + 1, 5) + 1;

  const tfun = randChoice([fun2]);
  const a0 = ((Math.random() * PI) / 6) * dir + ang;
  for (let i = 0; i < tl; i++) {
    const mx = dir * tfun(i / tl) * 50 * sca * hs;
    const my = -i * 5 * sca;
    const a = Math.atan2(my, mx);
    const d = Math.pow(mx * mx + my * my, 0.5);
    const nx = Math.cos(a + a0) * d;
    const ny = Math.sin(a + a0) * d;

    twlist.push([nx + tx, ny + ty]);
    if ((i == ((tl / 3) | 0) || i == (((tl * 2) / 3) | 0)) && dep > 0) {
      canv += twig(nx + tx, ny + ty, dep - 1, {
        ang: ang,
        sca: sca * 0.8,
        ancho: ancho,
        dir: dir * randChoice<number>([-1, 1]),
        lea: lea,
      });
    }
    if (i == tl - 1 && lea[0] == true) {
      for (let j = 0; j < 5; j++) {
        const dj = (j - 2.5) * 5;
        canv += blob(
          nx + tx + Math.cos(ang) * dj * ancho,
          ny + ty + (Math.sin(ang) * dj - lea[1] / (dep + 1)) * ancho,
          {
            ancho: (6 + 3 * Math.random()) * ancho,
            len: (15 + 12 * Math.random()) * ancho,
            ang: ang / 2 + MEDIO_PI + DOS_PI * (Math.random() - 0.5),
            col: 'rgba(100,100,100,' + (0.5 + dep * 0.2).toFixed(3) + ')',
            fun: (x: number) => {
              return x <= 1 ? Math.pow(Math.sin(x * PI) * x, 0.5) : -Math.pow(Math.sin((x - 2) * PI * (x - 2)), 0.5);
            },
          }
        );
      }
    }
  }
  canv += stroke(twlist, {
    ancho: 1,
    fun: (x) => Math.cos((x * PI) / 2),
    col: 'rgba(100,100,100,0.5)',
  });
  return canv;
}

function barkify(x, y, trlist) {
  function bark(x, y, ancho, ang) {
    var len = 10 + 10 * Math.random();
    var noi = 0.5;
    var fun = (x) => (x <= 1 ? Math.pow(Math.sin(x * PI), 0.5) : -Math.pow(Math.sin((x + 1) * PI), 0.5));
    var reso = 20.0;
    var canv = '';

    var lalist = [];
    for (var i = 0; i < reso + 1; i++) {
      var p = (i / reso) * 2;
      var xo = len / 2 - Math.abs(p - 1) * len;
      var yo = (fun(p) * ancho) / 2;
      var a = Math.atan2(yo, xo);
      var l = Math.sqrt(xo * xo + yo * yo);
      lalist.push([l, a]);
    }
    var nslist = [];
    var n0 = Math.random() * 10;
    for (var i = 0; i < reso + 1; i++) {
      nslist.push(noise(i * 0.05, n0));
    }

    loopNoise(nslist);
    var brklist = [];
    for (var i = 0; i < lalist.length; i++) {
      var ns = nslist[i] * noi + (1 - noi);
      var nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
      var ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
      brklist.push([nx, ny]);
    }
    var fr = Math.random();
    canv += stroke(brklist, {
      ancho: 0.8,
      noi: 0,
      col: 'rgba(100,100,100,0.4)',
      out: 0,
      fun: function (x) {
        return Math.sin((x + fr) * TRES_PI);
      },
    });

    return canv;
  }
  var canv = '';

  for (var i = 2; i < trlist[0].length - 1; i++) {
    var a0 = Math.atan2(trlist[0][i][1] - trlist[0][i - 1][1], trlist[0][i][0] - trlist[0][i - 1][0]);
    var a1 = Math.atan2(trlist[1][i][1] - trlist[1][i - 1][1], trlist[1][i][0] - trlist[1][i - 1][0]);
    var p = Math.random();
    var nx = trlist[0][i][0] * (1 - p) + trlist[1][i][0] * p;
    var ny = trlist[0][i][1] * (1 - p) + trlist[1][i][1] * p;
    if (Math.random() < 0.2) {
      canv += blob(nx + x, ny + y, {
        noi: 1,
        len: 15,
        ancho: 6 - Math.abs(p - 0.5) * 10,
        ang: (a0 + a1) / 2,
        col: 'rgba(100,100,100,0.6)',
      });
    } else {
      canv += bark(nx + x, ny + y, 5 - Math.abs(p - 0.5) * 10, (a0 + a1) / 2);
    }

    if (Math.random() < 0.05) {
      var jl = Math.random() * 2 + 2;
      var xya = randChoice([
        [trlist[0][i][0], trlist[0][i][1], a0],
        [trlist[1][i][0], trlist[1][i][1], a1],
      ]);
      for (var j = 0; j < jl; j++) {
        canv += blob(
          xya[0] + x + Math.cos(xya[2]) * (j - jl / 2) * 4,
          xya[1] + y + Math.sin(xya[2]) * (j - jl / 2) * 4,
          {
            ancho: 4,
            len: 4 + 6 * Math.random(),
            ang: a0 + MEDIO_PI,
            col: 'rgba(100,100,100,0.6)',
          }
        );
      }
    }
  }
  var trflist = trlist[0].concat(trlist[1].slice().reverse());
  var rglist = [[]];
  for (var i = 0; i < trflist.length; i++) {
    if (Math.random() < 0.5) {
      rglist.push([]);
    } else {
      rglist[rglist.length - 1].push(trflist[i]);
    }
  }

  for (var i = 0; i < rglist.length; i++) {
    rglist[i] = div(rglist[i], 4);
    for (var j = 0; j < rglist[i].length; j++) {
      rglist[i][j][0] += (noise(i, j * 0.1, 1) - 0.5) * (15 + 5 * randGaussian());
      rglist[i][j][1] += (noise(i, j * 0.1, 2) - 0.5) * (15 + 5 * randGaussian());
    }
    canv += stroke(
      rglist[i].map((v) => [v[0] + x, v[1] + y]),
      { ancho: 1.5, col: 'rgba(100,100,100,0.7)', out: 0 }
    );
  }
  return canv;
}

export function tree04(x, y, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 300;
  var ancho = args.ancho != undefined ? args.ancho : 6;
  var col = args.col != undefined ? args.col : 'rgba(100,100,100,0.5)';
  var noi = args.noi != undefined ? args.noi : 0.5;

  var canv = '';
  var txcanv = '';
  var twcanv = '';

  var trlist = branch({ alto: alto, ancho: ancho, ang: -MEDIO_PI });
  txcanv += barkify(x, y, trlist);
  trlist = trlist[0].concat(trlist[1].reverse());

  var trmlist = [];

  for (var i = 0; i < trlist.length; i++) {
    if ((i >= trlist.length * 0.3 && i <= trlist.length * 0.7 && Math.random() < 0.1) || i == trlist.length / 2 - 1) {
      var ba = PI * 0.2 - PI * 1.4 * (i > trlist.length / 2);
      var brlist = branch({
        alto: alto * (Math.random() + 1) * 0.3,
        ancho: ancho * 0.5,
        ang: ba,
      });

      brlist[0].splice(0, 1);
      brlist[1].splice(0, 1);
      var foff = function (v) {
        return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
      };
      txcanv += barkify(x, y, [brlist[0].map(foff), brlist[1].map(foff)]);

      for (var j = 0; j < brlist[0].length; j++) {
        if (Math.random() < 0.2 || j == brlist[0].length - 1) {
          twcanv += twig(brlist[0][j][0] + trlist[i][0] + x, brlist[0][j][1] + trlist[i][1] + y, 1, {
            ancho: alto / 300,
            ang: ba > -MEDIO_PI ? ba : ba + PI,
            sca: (0.5 * alto) / 300,
            dir: ba > -MEDIO_PI ? 1 : -1,
          });
        }
      }
      brlist = brlist[0].concat(brlist[1].reverse());
      trmlist = trmlist.concat(
        brlist.map(function (v) {
          return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
        })
      );
    } else {
      trmlist.push(trlist[i]);
    }
  }
  canv += poly(trmlist, { x, y, fil: 'white', str: col, ancho: 0 });

  trmlist.splice(0, 1);
  trmlist.splice(trmlist.length - 1, 1);
  canv += stroke(
    trmlist.map((v) => [v[0] + x, v[1] + y]),
    {
      col: 'rgba(100,100,100,' + (0.4 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: (x) => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  canv += txcanv;
  canv += twcanv;
  return canv;
}

export function tree05(x, y, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 300;
  var ancho = args.ancho != undefined ? args.ancho : 5;
  var col = args.col != undefined ? args.col : 'rgba(100,100,100,0.5)';
  var noi = args.noi != undefined ? args.noi : 0.5;

  var canv = '';
  var txcanv = '';
  var twcanv = '';

  var trlist = branch({ alto: alto, ancho: ancho, ang: -MEDIO_PI, ben: 0 });
  txcanv += barkify(x, y, trlist);
  trlist = trlist[0].concat(trlist[1].reverse());

  var trmlist = [];

  for (var i = 0; i < trlist.length; i++) {
    var p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
    if (
      (i >= trlist.length * 0.2 && i <= trlist.length * 0.8 && i % 3 == 0 && Math.random() > p) ||
      i == trlist.length / 2 - 1
    ) {
      var bar = Math.random() * 0.2;
      var ba = -bar * PI - (1 - bar * 2) * PI * (i > trlist.length / 2);
      var brlist = branch({
        alto: alto * (0.3 * p - Math.random() * 0.05),
        ancho: ancho * 0.5,
        ang: ba,
        ben: 0.5,
      });

      brlist[0].splice(0, 1);
      brlist[1].splice(0, 1);
      var foff = function (v) {
        return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
      };
      //txcanv += barkify(x,y,[brlist[0].map(foff),brlist[1].map(foff)])

      for (var j = 0; j < brlist[0].length; j++) {
        if (j % 20 == 0 || j == brlist[0].length - 1) {
          twcanv += twig(brlist[0][j][0] + trlist[i][0] + x, brlist[0][j][1] + trlist[i][1] + y, 0, {
            ancho: alto / 300,
            ang: ba > -MEDIO_PI ? ba : ba + PI,
            sca: (0.2 * alto) / 300,
            dir: ba > -MEDIO_PI ? 1 : -1,
            lea: [true, 5],
          });
        }
      }
      brlist = brlist[0].concat(brlist[1].reverse());
      trmlist = trmlist.concat(
        brlist.map(function (v) {
          return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
        })
      );
    } else {
      trmlist.push(trlist[i]);
    }
  }

  canv += poly(trmlist, { x, y, fil: 'white', str: col, ancho: 0 });

  trmlist.splice(0, 1);
  trmlist.splice(trmlist.length - 1, 1);
  canv += stroke(
    trmlist.map((v) => [v[0] + x, v[1] + y]),
    {
      col: 'rgba(100,100,100,' + (0.4 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: (x) => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  canv += txcanv;
  canv += twcanv;
  return canv;
}

export function tree06(x, y, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 100;
  var ancho = args.ancho != undefined ? args.ancho : 6;
  var col = args.col != undefined ? args.col : 'rgba(100,100,100,0.5)';

  var canv = '';
  var txcanv = '';
  var twcanv = '';

  function fracTree(xoff, yoff, dep, args) {
    var args = args != undefined ? args : {};
    var alto = args.alto != undefined ? args.alto : 300;
    var ancho = args.ancho != undefined ? args.ancho : 5;
    var ang = args.ang != undefined ? args.ang : 0;
    var ben = args.ben != undefined ? args.ben : PI * 0.2;

    var trlist = branch({
      alto: alto,
      ancho: ancho,
      ang: ang,
      ben: ben,
      det: alto / 20,
    });
    txcanv += barkify(xoff, yoff, trlist);
    trlist = trlist[0].concat(trlist[1].reverse());

    var trmlist = [];

    for (var i = 0; i < trlist.length; i++) {
      var p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
      if (
        ((Math.random() < 0.025 && i >= trlist.length * 0.2 && i <= trlist.length * 0.8) ||
          i == ((trlist.length / 2) | 0) - 1 ||
          i == ((trlist.length / 2) | 0) + 1) &&
        dep > 0
      ) {
        var bar = 0.02 + Math.random() * 0.08;
        var ba = bar * PI - bar * 2 * PI * (i > trlist.length / 2);

        var brlist = fracTree(trlist[i][0] + xoff, trlist[i][1] + yoff, dep - 1, {
          alto: alto * (0.7 + Math.random() * 0.2),
          ancho: ancho * 0.6,
          ang: ang + ba,
          ben: 0.55,
        });

        for (var j = 0; j < brlist.length; j++) {
          if (Math.random() < 0.03) {
            twcanv += twig(brlist[j][0] + trlist[i][0] + xoff, brlist[j][1] + trlist[i][1] + yoff, 2, {
              ang: ba * (Math.random() * 0.5 + 0.75),
              sca: 0.3,
              dir: ba > 0 ? 1 : -1,
              lea: [false, 0],
            });
          }
        }

        trmlist = trmlist.concat(
          brlist.map(function (v) {
            return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
          })
        );
      } else {
        trmlist.push(trlist[i]);
      }
    }
    return trmlist;
  }

  var trmlist = fracTree(x, y, 3, {
    alto: alto,
    ancho: ancho,
    ang: -MEDIO_PI,
    ben: 0,
  });

  canv += poly(trmlist, { x, y, fil: 'white', str: col, ancho: 0 });

  trmlist.splice(0, 1);
  trmlist.splice(trmlist.length - 1, 1);
  canv += stroke(
    trmlist.map((v) => [v[0] + x, v[1] + y]),
    {
      col: 'rgba(100,100,100,' + (0.4 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: () => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  canv += txcanv;
  canv += twcanv;
  return canv;
}

export function tree07(x, y, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 60;
  var ancho = args.ancho != undefined ? args.ancho : 4;
  var ben =
    args.ben != undefined
      ? args.ben
      : function (x) {
          return Math.sqrt(x) * 0.2;
        };
  var col = args.col != undefined ? args.col : 'rgba(100,100,100,1)';
  var noi = args.noi != undefined ? args.noi : 0.5;

  const reso = 10;
  var nslist = [];
  for (var i = 0; i < reso; i++) {
    nslist.push([noise(i * 0.5), noise(i * 0.5, 0.5)]);
  }
  var leafcol;
  if (col.includes('rgba(')) {
    leafcol = col.replace('rgba(', '').replace(')', '').split(',');
  } else {
    leafcol = ['100', '100', '100', '1'];
  }
  var canv = '';
  var line1 = [];
  var line2 = [];
  var T = [];

  for (var i = 0; i < reso; i++) {
    var nx = x + ben(i / reso) * 100;
    var ny = y - (i * alto) / reso;
    if (i >= reso / 4) {
      for (var j = 0; j < 1; j++) {
        var bpl = blob(
          nx + (Math.random() - 0.5) * ancho * 1.2 * (reso - i) * 0.5,
          ny + (Math.random() - 0.5) * ancho * 0.5,
          {
            len: Math.random() * 50 + 20,
            ancho: Math.random() * 12 + 12,
            ang: (-Math.random() * PI) / 6,
            col:
              'rgba(' +
              leafcol[0] +
              ',' +
              leafcol[1] +
              ',' +
              leafcol[2] +
              ',' +
              parseFloat(leafcol[3]).toFixed(3) +
              ')',
            fun: function (x) {
              return x <= 1 ? 2.75 * x * Math.pow(1 - x, 1 / 1.8) : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
            },
            ret: 1,
          }
        );

        //canv+=poly(bpl,{fil:col,ancho:0})
        T = T.concat(
          triangulate(bpl, {
            area: 50,
            convex: true,
            optimize: false,
          })
        );
      }
    }
    line1.push([nx + (nslist[i][0] - 0.5) * ancho - ancho / 2, ny]);
    line2.push([nx + (nslist[i][1] - 0.5) * ancho + ancho / 2, ny]);
  }

  //canv += poly(line1.concat(line2.reverse()),{fil:col,ancho:0})
  T = triangulate(line1.concat(line2.reverse()), {
    area: 50,
    convex: true,
    optimize: true,
  }).concat(T);

  for (var k = 0; k < T.length; k++) {
    var m = buscarCentro(T[k]);
    var c = (noise(m[0] * 0.02, m[1] * 0.02) * 200 + 50) | 0;
    var co = 'rgba(' + c + ',' + c + ',' + c + ',0.8)';
    canv += poly(T[k], { fil: co, str: co, ancho: 0 });
  }
  return canv;
}

export function tree08(x: number, y: number, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 80;
  var ancho = args.ancho != undefined ? args.ancho : 1;
  var col = args.col != undefined ? args.col : 'rgba(100,100,100,0.5)';

  var canv = '';
  var txcanv = '';
  var twcanv = '';

  var ang = normRand(-1, 1) * PI * 0.2;

  var trlist = branch({
    alto: alto,
    ancho: ancho,
    ang: -MEDIO_PI + ang,
    ben: PI * 0.2,
    det: alto / 20,
  });
  //txcanv += barkify(x,y,trlist)

  trlist = trlist[0].concat(trlist[1].reverse());

  function fracTree(xoff, yoff, dep, args) {
    var args = args != undefined ? args : {};
    var ang = args.ang != undefined ? args.ang : -MEDIO_PI;
    var len = args.len != undefined ? args.len : 15;
    var ben = args.ben != undefined ? args.ben : 0;

    const fun = dep == 0 ? (x: number) => Math.cos(0.5 * PI * x) : () => 1;
    var spt = [xoff, yoff];
    var ept = [xoff + Math.cos(ang) * len, yoff + Math.sin(ang) * len];

    let trmlist: Punto[] = [
      [xoff, yoff],
      [xoff + len, yoff],
    ];

    const bfun = randChoice<(x: number) => number>([(x) => Math.sin(x * PI), (x) => -Math.sin(x * PI)]);

    trmlist = div(trmlist, 10);

    for (var i = 0; i < trmlist.length; i++) {
      trmlist[i][1] += bfun(i / trmlist.length) * 2;
    }
    for (var i = 0; i < trmlist.length; i++) {
      var d = distance(trmlist[i], spt);
      var a = Math.atan2(trmlist[i][1] - spt[1], trmlist[i][0] - spt[0]);
      trmlist[i][0] = spt[0] + d * Math.cos(a + ang);
      trmlist[i][1] = spt[1] + d * Math.sin(a + ang);
    }

    var tcanv = '';
    tcanv += stroke(trmlist, {
      fun: fun,
      ancho: 0.8,
      col: 'rgba(100,100,100,0.5)',
    });
    if (dep != 0) {
      var nben = ben + randChoice<number>([-1, 1]) * PI * 0.001 * dep * dep;
      if (Math.random() < 0.5) {
        tcanv += fracTree(ept[0], ept[1], dep - 1, {
          ang: ang + ben + PI * randChoice<number>([normRand(-1, 0.5), normRand(0.5, 1)]) * 0.2,
          len: len * normRand(0.8, 0.9),
          ben: nben,
        });
        tcanv += fracTree(ept[0], ept[1], dep - 1, {
          ang: ang + ben + PI * randChoice<number>([normRand(-1, -0.5), normRand(0.5, 1)]) * 0.2,
          len: len * normRand(0.8, 0.9),
          ben: nben,
        });
      } else {
        tcanv += fracTree(ept[0], ept[1], dep - 1, {
          ang: ang + ben,
          len: len * normRand(0.8, 0.9),
          ben: nben,
        });
      }
    }
    return tcanv;
  }

  for (var i = 0; i < trlist.length; i++) {
    if (Math.random() < 0.2) {
      twcanv += fracTree(x + trlist[i][0], y + trlist[i][1], Math.floor(4 * Math.random()), {
        alto: 20,
        ang: -MEDIO_PI - ang * Math.random(),
      });
    } else if (i == Math.floor(trlist.length / 2)) {
      twcanv += fracTree(x + trlist[i][0], y + trlist[i][1], 3, {
        alto: 25,
        ang: -MEDIO_PI + ang,
      });
    }
  }

  canv += poly(trlist, { x, y, fil: 'white', str: col, ancho: 0 });

  canv += stroke(
    trlist.map((v) => [v[0] + x, v[1] + y]),
    {
      col: 'rgba(100,100,100,' + (0.6 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: (x) => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  canv += txcanv;
  canv += twcanv;
  //console.log(canv)
  return canv;
}
