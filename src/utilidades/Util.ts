import type { ArgsPoly, Punto } from '../tipos';
import { midPt } from './Polytools';

export function unNan(plist: Punto[]) {
  if (typeof plist != 'object' || plist == null) {
    return plist || 0;
  } else {
    return plist.map(unNan);
  }
}

export function distance(p0: number[], p1: number[]) {
  return Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2));
}

export function mapval(value: number, istart: number, istop: number, ostart: number, ostop: number) {
  return ostart + (ostop - ostart) * (((value - istart) * 1.0) / (istop - istart));
}

export function loopNoise(nslist: number[]) {
  const dif = nslist[nslist.length - 1] - nslist[0];
  const bds = [100, -100];

  for (let i = 0; i < nslist.length; i++) {
    nslist[i] += (dif * (nslist.length - 1 - i)) / (nslist.length - 1);
    if (nslist[i] < bds[0]) bds[0] = nslist[i];
    if (nslist[i] > bds[1]) bds[1] = nslist[i];
  }

  for (let i = 0; i < nslist.length; i++) {
    nslist[i] = mapval(nslist[i], bds[0], bds[1], 0, 1);
  }
}

export function randChoice(arr: (number | boolean | ((x: number) => number))[]) {
  return arr[Math.floor(arr.length * Math.random())];
}

export function normRand(m: number, M: number) {
  return mapval(Math.random(), 0, 1, m, M);
}

export function wtrand(func: (valor: number) => number) {
  const x = Math.random();
  const y = Math.random();

  if (y < func(x)) {
    return x;
  } else {
    return wtrand(func);
  }
}

export function randGaussian() {
  return wtrand((x) => Math.pow(Math.E, -24 * Math.pow(x - 0.5, 2))) * 2 - 1;
}

export function bezmh(puntos: Punto[], w: number = 1) {
  if (puntos.length == 2) {
    puntos = [puntos[0], midPt(puntos[0], puntos[1]), puntos[1]];
  }

  const plist: Punto[] = [];

  for (let j = 0; j < puntos.length - 2; j++) {
    let p0;
    let p1;
    let p2;

    if (j == 0) {
      p0 = puntos[j];
    } else {
      p0 = midPt(puntos[j], puntos[j + 1]);
    }
    p1 = puntos[j + 1];
    if (j == puntos.length - 3) {
      p2 = puntos[j + 2];
    } else {
      p2 = midPt(puntos[j + 1], puntos[j + 2]);
    }

    const pl = 20;

    for (let i = 0; i < pl + +(j == puntos.length - 3); i += 1) {
      const t = i / pl;
      const u = Math.pow(1 - t, 2) + 2 * t * (1 - t) * w + t * t;
      plist.push([
        (Math.pow(1 - t, 2) * p0[0] + 2 * t * (1 - t) * p1[0] * w + t * t * p2[0]) / u,
        (Math.pow(1 - t, 2) * p0[1] + 2 * t * (1 - t) * p1[1] * w + t * t * p2[1]) / u,
      ]);
    }
  }
  return plist;
}

export function poly(plist: number[][], args: ArgsPoly) {
  const predeterminados = {
    xof: 0,
    yof: 0,
    fil: 'rgba(0,0,0,0)',
    str: 'rgba(0,0,0,0)',
    wid: 0,
  };

  const { xof, yof, fil, str, wid } = { ...predeterminados, ...args };

  let canv = "<polyline points='";
  for (let i = 0; i < plist.length; i++) {
    canv += ' ' + (plist[i][0] + xof).toFixed(1) + ',' + (plist[i][1] + yof).toFixed(1);
  }
  canv += "' style='fill:" + fil + ';stroke:' + str + ';stroke-width:' + wid + "'/>";
  return canv;
}
