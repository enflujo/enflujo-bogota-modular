import type { OpcionesMontaña } from '@/tipos';
import { stroke, texture } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { normRand, poly, randChoice } from '@/utilidades/Util';
import { arch02, arch03, arch04 } from '@/componentes/Arch';
import roca from '@/componentes/roca';
import torreLuz from '@/componentes/torreLuz';
import { tree01, tree02, tree03 } from '@/componentes/Tree';

export default function montaña(xoff: number, yoff: number, seed = 0, args?: OpcionesMontaña) {
  const predeterminados = {
    alto: 100 + Math.random() * 400,
    ancho: 400 + Math.random() * 200,
    tex: 200,
    veg: true,
    ret: 0,
    col: '',
  };
  const { alto, ancho, tex, veg } = { ...predeterminados, ...args };

  let canv = '';
  const ptlist: number[][][] = [];
  const h = alto;
  const w = ancho;
  const reso = [10, 50];
  let hoff = 0;

  for (let j = 0; j < reso[0]; j++) {
    hoff += (Math.random() * yoff) / 100;
    ptlist.push([]);

    for (let i = 0; i < reso[1]; i++) {
      const x = (i / reso[1] - 0.5) * Math.PI;
      let y = Math.cos(x);
      y *= noise(x + 10, j * 0.15, seed);
      const p = 1 - j / reso[0];
      ptlist[ptlist.length - 1].push([(x / Math.PI) * w * p, -y * h * p + hoff]);
    }
  }

  function vegetate(
    treeFunc: (x: number, y: number) => string,
    growthRule: (i: number, j: number) => boolean,
    proofRule: (veglist: number[][], i: number) => boolean
  ) {
    const veglist = [];

    for (let i = 0; i < ptlist.length; i += 1) {
      for (let j = 0; j < ptlist[i].length; j += 1) {
        if (growthRule(i, j)) {
          veglist.push([ptlist[i][j][0], ptlist[i][j][1]]);
        }
      }
    }

    for (let i = 0; i < veglist.length; i++) {
      if (proofRule(veglist, i)) {
        canv += treeFunc(veglist[i][0], veglist[i][1]);
      }
    }
  }

  //RIM
  // vegetate(
  //   (x: number, y: number) => {
  //     return tree02(x + xoff, y + yoff - 5, {
  //       col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) + ')',
  //       clu: 2,
  //     });
  //   },
  //   (i: number, j: number) => {
  //     const ns = noise(j * 0.1, seed);
  //     return i == 0 && ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / h > 0.2;
  //   },
  //   () => true
  // );

  //WHITE BG
  canv += poly(ptlist[0].concat([[0, reso[0] * 4]]), {
    xof: xoff,
    yof: yoff,
    fil: 'white',
    str: 'none',
  });
  //OUTLINE
  canv += stroke(
    ptlist[0].map((x) => [x[0] + xoff, x[1] + yoff]),
    { col: 'rgba(100,100,100,0.3)', noi: 1, ancho: 3 }
  );

  canv += foot(ptlist, { xof: xoff, yof: yoff });
  canv += texture(ptlist, {
    xof: xoff,
    yof: yoff,
    tex: tex,
    sha: randChoice([0, 0, 0, 0, 5]),
  });

  //TOP
  // vegetate(
  //   (x: number, y: number) => {
  //     return tree02(x + xoff, y + yoff, {
  //       col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) + ')',
  //     });
  //   },
  //   (i: number, j: number) => {
  //     const ns = noise(i * 0.1, j * 0.1, seed + 2);
  //     return ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / h > 0.5;
  //   },
  //   () => true
  // );

  if (veg) {
    //MIDDLE
    // vegetate(
    //   (x: number, y: number) => {
    //     let ht = ((h + y) / h) * 70;
    //     ht = ht * 0.3 + Math.random() * ht * 0.7;
    //     return tree01(x + xoff, y + yoff, {
    //       alto: ht,
    //       ancho: Math.random() * 3 + 1,
    //       col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) + ')',
    //     });
    //   },
    //   (i: number, j: number) => {
    //     const ns = noise(i * 0.2, j * 0.05, seed);
    //     return !!(j % 2 && ns * ns * ns * ns < 0.012 && Math.abs(ptlist[i][j][1]) / h < 0.3);
    //   },
    //   (veglist: number[][], i: number) => {
    //     let counter = 0;
    //     for (let j = 0; j < veglist.length; j++) {
    //       if (
    //         i != j &&
    //         Math.pow(veglist[i][0] - veglist[j][0], 2) + Math.pow(veglist[i][1] - veglist[j][1], 2) < 30 * 30
    //       ) {
    //         counter++;
    //       }
    //       if (counter > 2) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   }
    // );
    //BOTTOM
    // vegetate(
    //   (x: number, y: number) => {
    //     let ht = ((h + y) / h) * 120;
    //     ht = ht * 0.5 + Math.random() * ht * 0.5;
    //     const bc = Math.random() * 0.1;
    //     const bp = 1;
    //     return tree03(x + xoff, y + yoff, {
    //       alto: ht,
    //       ben: (x) => Math.pow(x * bc, bp),
    //       col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) + ')',
    //     });
    //   },
    //   (i: number, j: number) => {
    //     const ns = noise(i * 0.2, j * 0.05, seed);
    //     return (j == 0 || j == ptlist[i].length - 1) && ns * ns * ns * ns < 0.012;
    //   },
    //   () => true
    // );
  }

  //BOTT ARCH
  // vegetate(
  //   (x: number, y: number) => {
  //     const tt = randChoice([0, 0, 1, 1, 1, 2]);

  //     if (tt == 1) {
  //       return arch02(x + xoff, y + yoff, seed, {
  //         ancho: normRand(40, 70),
  //         sto: randChoice([1, 2, 2, 3]),
  //         rot: Math.random(),
  //         sty: randChoice([1, 2, 3]),
  //       });
  //     } else if (tt == 2) {
  //       return arch04(x + xoff, y + yoff, seed, {
  //         sto: randChoice([1, 1, 1, 2, 2]),
  //       });
  //     } else {
  //       return '';
  //     }
  //   },
  //   (i: number, j: number) => {
  //     const ns = noise(i * 0.2, j * 0.05, seed + 10);
  //     return i != 0 && (j == 1 || j == ptlist[i].length - 2) && ns * ns * ns * ns < 0.008;
  //   },
  //   () => true
  // );

  //TOP ARCH
  // vegetate(
  //   (x: number, y: number) => {
  //     return arch03(x + xoff, y + yoff, seed, {
  //       sto: randChoice([5, 7]),
  //       ancho: 40 + Math.random() * 20,
  //     });
  //   },
  //   (i: number, j: number) => i == 1 && Math.abs(j - ptlist[i].length / 2) < 1 && Math.random() < 0.02,
  //   () => true
  // );

  vegetate(
    (x: number, y: number) => torreLuz(x + xoff, y + yoff),
    (i: number, j: number) => {
      const ns = noise(i * 0.2, j * 0.05, seed + 20 * Math.PI);
      return i % 2 == 0 && (j == 1 || j == ptlist[i].length - 2) && ns * ns * ns * ns < 0.002;
    },
    () => true
  );

  //BOTT ROCK
  // vegetate(
  //   (x: number, y: number) => {
  //     return roca(x + xoff, y + yoff, seed, {
  //       ancho: 20 + Math.random() * 20,
  //       alto: 20 + Math.random() * 20,
  //       sha: 2,
  //     });
  //   },
  //   (i: number, j: number) => (j == 0 || j == ptlist[i].length - 1) && Math.random() < 0.1,
  //   () => true
  // );

  return canv;
}

function foot(ptlist: number[][][], args: { xof?: number; yof?: number; ret?: number }) {
  const predeterminados = { xof: 0, yof: 0, ret: 0 };
  const { xof, yof } = { ...predeterminados, ...args };
  const ftlist: number[][][] = [];
  const span = 10;
  let ni = 0;

  for (let i = 0; i < ptlist.length - 2; i += 1) {
    if (i == ni) {
      ni = Math.min(ni + +randChoice([1, 2]), ptlist.length - 1);
      ftlist.push([]);
      ftlist.push([]);

      for (let j = 0; j < Math.min(ptlist[i].length / 8, 10); j++) {
        ftlist[ftlist.length - 2].push([ptlist[i][j][0] + noise(j * 0.1, i) * 10, ptlist[i][j][1]]);
        ftlist[ftlist.length - 1].push([
          ptlist[i][ptlist[i].length - 1 - j][0] - noise(j * 0.1, i) * 10,
          ptlist[i][ptlist[i].length - 1 - j][1],
        ]);
      }

      ftlist[ftlist.length - 2] = ftlist[ftlist.length - 2].reverse();
      ftlist[ftlist.length - 1] = ftlist[ftlist.length - 1].reverse();

      for (let j = 0; j < span; j++) {
        const p = j / span;
        const x1 = ptlist[i][0][0] * (1 - p) + ptlist[ni][0][0] * p;
        const x2 = ptlist[i][ptlist[i].length - 1][0] * (1 - p) + ptlist[ni][ptlist[i].length - 1][0] * p;
        let y1 = ptlist[i][0][1] * (1 - p) + ptlist[ni][0][1] * p;
        let y2 = ptlist[i][ptlist[i].length - 1][1] * (1 - p) + ptlist[ni][ptlist[i].length - 1][1] * p;
        const vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
        y1 += vib * 5 + noise(xof * 0.05, i) * 5;
        y2 += vib * 5 + noise(xof * 0.05, i) * 5;

        ftlist[ftlist.length - 2].push([x1, y1]);
        ftlist[ftlist.length - 1].push([x2, y2]);
      }
    }
  }

  let canv = '';

  for (let i = 0; i < ftlist.length; i++) {
    canv += poly(ftlist[i], {
      xof: xof,
      yof: yof,
      fil: 'white',
      str: 'none',
    });
  }

  for (let j = 0; j < ftlist.length; j++) {
    canv += stroke(
      ftlist[j].map((x) => [x[0] + xof, x[1] + yof]),
      {
        col: 'rgba(100,100,100,' + (0.1 + Math.random() * 0.1).toFixed(3) + ')',
        ancho: 1,
      }
    );
  }

  return canv;
}
