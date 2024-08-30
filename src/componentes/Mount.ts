import { div, stroke, texture } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { normRand, poly, randChoice } from '@/utilidades/Util';
import roca from './roca';
import { tree02, tree04, tree05, tree06, tree07, tree08 } from './Tree';
import { arch01 } from './Arch';
import type { Punto } from '@/tipos';

export function flatMount(
  xoff: number,
  yoff: number,
  seed = 0,
  args?: { alto?: number; ancho?: number; tex?: number; cho?: number; ret?: number }
) {
  const predeterminados = {
    alto: 40 + Math.random() * 400,
    ancho: 400 + Math.random() * 200,
    tex: 80,
    cho: 0.5,
    ret: 0,
  };

  const { alto, ancho, tex, cho } = { ...predeterminados, ...args };

  let canv = '';
  const puntos: Punto[][] = [];
  const reso = [5, 50];
  let hoff = 0;
  const flat: Punto[][] = [];

  for (let j = 0; j < reso[0]; j++) {
    hoff += (Math.random() * yoff) / 100;
    puntos.push([]);
    flat.push([]);

    for (let i = 0; i < reso[1]; i++) {
      const x = (i / reso[1] - 0.5) * Math.PI;
      const y = (Math.cos(x * 2) + 1) * noise(x + 10, j * 0.1, seed);
      const p = 1 - (j / reso[0]) * 0.6;
      const nx = (x / Math.PI) * ancho * p;
      let ny = -y * alto * p + hoff;
      const h = 100;

      if (ny < -h * cho + hoff) {
        ny = -h * cho + hoff;
        if (flat[flat.length - 1].length % 2 == 0) {
          flat[flat.length - 1].push([nx, ny]);
        }
      } else {
        if (flat[flat.length - 1].length % 2 == 1) {
          flat[flat.length - 1].push(puntos[puntos.length - 1][puntos[puntos.length - 1].length - 1]);
        }
      }

      puntos[puntos.length - 1].push([nx, ny]);
    }
  }

  //WHITE BG
  canv += poly(puntos[0].concat([[0, reso[0] * 4]]), {
    x: xoff,
    y: yoff,
    fil: 'white',
    str: 'none',
  });

  //OUTLINE
  canv += stroke(
    puntos[0].map((x) => [x[0] + xoff, x[1] + yoff]),
    { col: 'rgba(100,100,100,0.3)', noi: 1, ancho: 3 }
  );

  canv += texture(puntos, {
    xof: xoff,
    yof: yoff,
    tex: tex,
    ancho: 2,
    dis: function () {
      if (Math.random() > 0.5) {
        return 0.1 + 0.4 * Math.random();
      } else {
        return 0.9 - 0.4 * Math.random();
      }
    },
  });

  let grlist1: Punto[] = [];
  let grlist2: Punto[] = [];

  for (let i = 0; i < flat.length; i += 2) {
    if (flat[i].length >= 2) {
      grlist1.push(flat[i][0]);
      grlist2.push(flat[i][flat[i].length - 1]);
    }
  }

  if (grlist1.length == 0) {
    return canv;
  }

  let wb = [grlist1[0][0], grlist2[0][0]];

  for (let i = 0; i < 3; i++) {
    const p = 0.8 - i * 0.2;
    grlist1.unshift([wb[0] * p, grlist1[0][1] - 5]);
    grlist2.unshift([wb[1] * p, grlist2[0][1] - 5]);
  }

  wb = [grlist1[grlist1.length - 1][0], grlist2[grlist2.length - 1][0]];

  for (let i = 0; i < 3; i++) {
    const p = 0.6 - i * i * 0.1;
    grlist1.push([wb[0] * p, grlist1[grlist1.length - 1][1] + 1]);
    grlist2.push([wb[1] * p, grlist2[grlist2.length - 1][1] + 1]);
  }

  const d = 5;
  grlist1 = div(grlist1, d);
  grlist2 = div(grlist2, d);

  const grlist = grlist1.reverse().concat(grlist2.concat([grlist1[0]]));

  for (let i = 0; i < grlist.length; i++) {
    const v = (1 - Math.abs((i % d) - d / 2) / (d / 2)) * 0.12;
    grlist[i][0] *= 1 - v + noise(grlist[i][1] * 0.5) * v;
  }
  /*       for (let i = 0; i < ptlist.length; i++){
        canv += poly(ptlist[i],{xof:xoff,yof:yoff,str:"red",fil:"none",ancho:2})
      }
 */
  canv += poly(grlist, {
    x: xoff,
    y: yoff,
    str: 'none',
    fil: 'white',
    ancho: 2,
  });

  canv += stroke(
    grlist.map((x) => [x[0] + xoff, x[1] + yoff]),
    {
      ancho: 3,
      col: 'rgba(100,100,100,0.2)',
    }
  );

  const bound = (puntos: Punto[]) => {
    let xmin = Infinity;
    let xmax = 0;
    let ymin = Infinity;
    let ymax = 0;

    puntos.forEach(([x, y]) => {
      if (x < xmin) xmin = x;
      if (x > xmax) xmax = x;
      if (y < ymin) ymin = y;
      if (y > ymax) ymax = y;
    });
    console.log({ xmin, xmax, ymin, ymax });
    return { xmin, xmax, ymin, ymax };
  };

  const svg = flatDec(xoff, yoff, bound(grlist));
  // if (svg.includes('NaN')) console.log(svg);
  canv += svg;

  return canv;
}

export function flatDec(xoff: number, yoff: number, grbd: { xmin: number; xmax: number; ymin: number; ymax: number }) {
  let canv = '';
  const tt = randChoice([0, 0, 1, 2, 3, 4]);

  for (let j = 0; j < Math.random() * 5; j++) {
    canv += roca(
      xoff + normRand(grbd.xmin, grbd.xmax),
      yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-10, 10) + 10,
      Math.random() * 100,
      {
        ancho: 10 + Math.random() * 20,
        alto: 10 + Math.random() * 20,
        sha: 2,
      }
    );
  }

  for (let j = 0; j < randChoice<number>([0, 0, 1, 2]); j++) {
    const xr = xoff + normRand(grbd.xmin, grbd.xmax);
    const yr = yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20;

    for (let k = 0; k < 2 + Math.random() * 3; k++) {
      canv += tree08(xr + Math.min(Math.max(normRand(-30, 30), grbd.xmin), grbd.xmax), yr, {
        alto: 60 + Math.random() * 40,
      });
    }
  }

  if (tt == 0) {
    for (let j = 0; j < Math.random() * 3; j++) {
      canv += roca(
        xoff + normRand(grbd.xmin, grbd.xmax),
        yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
        Math.random() * 100,
        {
          ancho: 50 + Math.random() * 20,
          alto: 40 + Math.random() * 20,
          sha: 5,
        }
      );
    }
  }

  if (tt == 1) {
    const pmin = Math.random() * 0.5;
    const pmax = Math.random() * 0.5 + 0.5;
    const xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
    const xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;

    for (let i = xmin; i < xmax; i += 30) {
      canv += tree05(xoff + i + 20 * normRand(-1, 1), yoff + (grbd.ymin + grbd.ymax) / 2 + 20, {
        alto: 100 + Math.random() * 200,
      });
    }

    for (let j = 0; j < Math.random() * 4; j++) {
      canv += roca(
        xoff + normRand(grbd.xmin, grbd.xmax),
        yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
        Math.random() * 100,
        {
          ancho: 50 + Math.random() * 20,
          alto: 40 + Math.random() * 20,
          sha: 5,
        }
      );
    }
  } else if (tt == 2) {
    for (let i = 0; i < randChoice<number>([1, 1, 1, 1, 2, 2, 3]); i++) {
      const xr = normRand(grbd.xmin, grbd.xmax);
      const yr = (grbd.ymin + grbd.ymax) / 2;
      canv += tree04(xoff + xr, yoff + yr + 20, {});

      for (let j = 0; j < Math.random() * 2; j++) {
        canv += roca(
          xoff + Math.max(grbd.xmin, Math.min(grbd.xmax, xr + normRand(-50, 50))),
          yoff + yr + normRand(-5, 5) + 20,
          j * i * Math.random() * 100,
          {
            ancho: 50 + Math.random() * 20,
            alto: 40 + Math.random() * 20,
            sha: 5,
          }
        );
      }
    }
  } else if (tt == 3) {
    for (let i = 0; i < randChoice<number>([1, 1, 1, 1, 2, 2, 3]); i++) {
      canv += tree06(xoff + normRand(grbd.xmin, grbd.xmax), yoff + (grbd.ymin + grbd.ymax) / 2, {
        alto: 60 + Math.random() * 60,
      });
    }
  } else if (tt == 4) {
    const pmin = Math.random() * 0.5;
    const pmax = Math.random() * 0.5 + 0.5;
    const xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
    const xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
    for (let i = xmin; i < xmax; i += 20) {
      canv += tree07(xoff + i + 20 * normRand(-1, 1), yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-1, 1) + 0, {
        alto: normRand(40, 80),
      });
    }
  }

  for (let i = 0; i < 50 * Math.random(); i++) {
    canv += tree02(xoff + normRand(grbd.xmin, grbd.xmax), yoff + normRand(grbd.ymin, grbd.ymax));
  }
  const ts = randChoice([0, 0, 0, 0, 1]);

  if (ts == 1 && tt != 4) {
    canv += arch01(xoff + normRand(grbd.xmin, grbd.xmax), yoff + (grbd.ymin + grbd.ymax) / 2 + 20, Math.random(), {
      ancho: normRand(160, 200),
      alto: normRand(80, 100),
      per: Math.random(),
    });
  }

  return canv;
}
