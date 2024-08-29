import { div, stroke, texture } from '../utilidades/cosas';
import { noise } from '../utilidades/Perlin';
import { midPt, triangulate } from '../utilidades/Polytools';
import { normRand, poly, randChoice } from '../utilidades/Util';
import { arch01 } from './Arch';
import roca from './roca';
import { tree02, tree04, tree05, tree06, tree07, tree08 } from './Tree';

export function flatMount(
  xoff: number,
  yoff: number,
  seed = 0,
  args?: { hei?: number; wid?: number; tex?: number; cho?: number; ret?: number }
) {
  const predeterminados = {
    hei: 40 + Math.random() * 400,
    wid: 400 + Math.random() * 200,
    tex: 80,
    cho: 0.5,
    ret: 0,
  };

  const { hei, wid, tex, cho } = { ...predeterminados, ...args };

  let canv = '';
  const ptlist: number[][] = [];
  const reso = [5, 50];
  let hoff = 0;
  const flat: number[][] = [];

  for (let j = 0; j < reso[0]; j++) {
    hoff += (Math.random() * yoff) / 100;
    ptlist.push([]);
    flat.push([]);

    for (let i = 0; i < reso[1]; i++) {
      const x = (i / reso[1] - 0.5) * Math.PI;
      let y = Math.cos(x * 2) + 1;
      y *= noise(x + 10, j * 0.1, seed);
      const p = 1 - (j / reso[0]) * 0.6;
      const nx = (x / Math.PI) * wid * p;
      let ny = -y * hei * p + hoff;
      const h = 100;

      if (ny < -h * cho + hoff) {
        ny = -h * cho + hoff;
        if (flat[flat.length - 1].length % 2 == 0) {
          flat[flat.length - 1].push([nx, ny]);
        }
      } else {
        if (flat[flat.length - 1].length % 2 == 1) {
          flat[flat.length - 1].push(ptlist[ptlist.length - 1][ptlist[ptlist.length - 1].length - 1]);
        }
      }

      ptlist[ptlist.length - 1].push([nx, ny]);
    }
  }

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
    { col: 'rgba(100,100,100,0.3)', noi: 1, wid: 3 }
  );

  canv += texture(ptlist, {
    xof: xoff,
    yof: yoff,
    tex: tex,
    wid: 2,
    dis: function () {
      if (Math.random() > 0.5) {
        return 0.1 + 0.4 * Math.random();
      } else {
        return 0.9 - 0.4 * Math.random();
      }
    },
  });
  var grlist1 = [];
  var grlist2 = [];
  for (var i = 0; i < flat.length; i += 2) {
    if (flat[i].length >= 2) {
      grlist1.push(flat[i][0]);
      grlist2.push(flat[i][flat[i].length - 1]);
    }
  }

  if (grlist1.length == 0) {
    return canv;
  }
  var wb = [grlist1[0][0], grlist2[0][0]];
  for (var i = 0; i < 3; i++) {
    var p = 0.8 - i * 0.2;

    grlist1.unshift([wb[0] * p, grlist1[0][1] - 5]);
    grlist2.unshift([wb[1] * p, grlist2[0][1] - 5]);
  }
  wb = [grlist1[grlist1.length - 1][0], grlist2[grlist2.length - 1][0]];
  for (var i = 0; i < 3; i++) {
    var p = 0.6 - i * i * 0.1;
    grlist1.push([wb[0] * p, grlist1[grlist1.length - 1][1] + 1]);
    grlist2.push([wb[1] * p, grlist2[grlist2.length - 1][1] + 1]);
  }

  var d = 5;
  grlist1 = div(grlist1, d);
  grlist2 = div(grlist2, d);

  var grlist = grlist1.reverse().concat(grlist2.concat([grlist1[0]]));
  for (var i = 0; i < grlist.length; i++) {
    var v = (1 - Math.abs((i % d) - d / 2) / (d / 2)) * 0.12;
    grlist[i][0] *= 1 - v + noise(grlist[i][1] * 0.5) * v;
  }
  /*       for (var i = 0; i < ptlist.length; i++){
        canv += poly(ptlist[i],{xof:xoff,yof:yoff,str:"red",fil:"none",wid:2})
      }
 */
  canv += poly(grlist, {
    xof: xoff,
    yof: yoff,
    str: 'none',
    fil: 'white',
    wid: 2,
  });
  canv += stroke(
    grlist.map((x) => [x[0] + xoff, x[1] + yoff]),
    {
      wid: 3,
      col: 'rgba(100,100,100,0.2)',
    }
  );

  const bound = (plist: number[][]) => {
    let xmin;
    let xmax;
    let ymin;
    let ymax;

    for (let i = 0; i < plist.length; i++) {
      if (xmin == undefined || plist[i][0] < xmin) {
        xmin = plist[i][0];
      }
      if (xmax == undefined || plist[i][0] > xmax) {
        xmax = plist[i][0];
      }
      if (ymin == undefined || plist[i][1] < ymin) {
        ymin = plist[i][1];
      }
      if (ymax == undefined || plist[i][1] > ymax) {
        ymax = plist[i][1];
      }
    }

    return { xmin, xmax, ymin, ymax };
  };

  canv += flatDec(xoff, yoff, bound(grlist));

  return canv;
}

export function flatDec(xoff, yoff, grbd) {
  let canv = '';
  const tt = randChoice([0, 0, 1, 2, 3, 4]);

  for (let j = 0; j < Math.random() * 5; j++) {
    canv += roca(
      xoff + normRand(grbd.xmin, grbd.xmax),
      yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-10, 10) + 10,
      Math.random() * 100,
      {
        wid: 10 + Math.random() * 20,
        hei: 10 + Math.random() * 20,
        sha: 2,
      }
    );
  }
  for (let j = 0; j < +randChoice([0, 0, 1, 2]); j++) {
    var xr = xoff + normRand(grbd.xmin, grbd.xmax);
    var yr = yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20;
    for (var k = 0; k < 2 + Math.random() * 3; k++) {
      canv += tree08(xr + Math.min(Math.max(normRand(-30, 30), grbd.xmin), grbd.xmax), yr, {
        hei: 60 + Math.random() * 40,
      });
    }
  }

  if (tt == 0) {
    for (var j = 0; j < Math.random() * 3; j++) {
      canv += roca(
        xoff + normRand(grbd.xmin, grbd.xmax),
        yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
        Math.random() * 100,
        {
          wid: 50 + Math.random() * 20,
          hei: 40 + Math.random() * 20,
          sha: 5,
        }
      );
    }
  }
  if (tt == 1) {
    var pmin = Math.random() * 0.5;
    var pmax = Math.random() * 0.5 + 0.5;
    var xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
    var xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
    for (var i = xmin; i < xmax; i += 30) {
      canv += tree05(xoff + i + 20 * normRand(-1, 1), yoff + (grbd.ymin + grbd.ymax) / 2 + 20, {
        hei: 100 + Math.random() * 200,
      });
    }
    for (var j = 0; j < Math.random() * 4; j++) {
      canv += roca(
        xoff + normRand(grbd.xmin, grbd.xmax),
        yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
        Math.random() * 100,
        {
          wid: 50 + Math.random() * 20,
          hei: 40 + Math.random() * 20,
          sha: 5,
        }
      );
    }
  } else if (tt == 2) {
    for (let i = 0; i < +randChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
      const xr = normRand(grbd.xmin, grbd.xmax);
      const yr = (grbd.ymin + grbd.ymax) / 2;
      canv += tree04(xoff + xr, yoff + yr + 20, {});

      for (let j = 0; j < Math.random() * 2; j++) {
        canv += roca(
          xoff + Math.max(grbd.xmin, Math.min(grbd.xmax, xr + normRand(-50, 50))),
          yoff + yr + normRand(-5, 5) + 20,
          j * i * Math.random() * 100,
          {
            wid: 50 + Math.random() * 20,
            hei: 40 + Math.random() * 20,
            sha: 5,
          }
        );
      }
    }
  } else if (tt == 3) {
    for (let i = 0; i < +randChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
      canv += tree06(xoff + normRand(grbd.xmin, grbd.xmax), yoff + (grbd.ymin + grbd.ymax) / 2, {
        hei: 60 + Math.random() * 60,
      });
    }
  } else if (tt == 4) {
    const pmin = Math.random() * 0.5;
    const pmax = Math.random() * 0.5 + 0.5;
    const xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
    const xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
    for (let i = xmin; i < xmax; i += 20) {
      canv += tree07(xoff + i + 20 * normRand(-1, 1), yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-1, 1) + 0, {
        hei: normRand(40, 80),
      });
    }
  }

  for (let i = 0; i < 50 * Math.random(); i++) {
    canv += tree02(xoff + normRand(grbd.xmin, grbd.xmax), yoff + normRand(grbd.ymin, grbd.ymax));
  }

  const ts = randChoice([0, 0, 0, 0, 1]);
  if (ts == 1 && tt != 4) {
    canv += arch01(xoff + normRand(grbd.xmin, grbd.xmax), yoff + (grbd.ymin + grbd.ymax) / 2 + 20, Math.random(), {
      wid: normRand(160, 200),
      hei: normRand(80, 100),
      per: Math.random(),
    });
  }

  return canv;
}
