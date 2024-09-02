import type { ArgsPoly, Punto } from '../tipos';
import { buscarCentro } from './Polytools';

export function unNan(puntos: Punto[]) {
  if (typeof puntos != 'object' || puntos == null) {
    return puntos || 0;
  } else {
    return puntos.map(unNan);
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

export function randChoice<Tipo>(arr: (number | number[] | boolean | ((x: number) => number))[]) {
  return arr[Math.floor(arr.length * Math.random())] as Tipo;
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
    puntos = [puntos[0], buscarCentro(puntos[0], puntos[1]), puntos[1]];
  }

  const plist: Punto[] = [];

  for (let j = 0; j < puntos.length - 2; j++) {
    let p0;
    let p1;
    let p2;

    if (j == 0) {
      p0 = puntos[j];
    } else {
      p0 = buscarCentro(puntos[j], puntos[j + 1]);
    }
    p1 = puntos[j + 1];
    if (j == puntos.length - 3) {
      p2 = puntos[j + 2];
    } else {
      p2 = buscarCentro(puntos[j + 1], puntos[j + 2]);
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

export function poly(puntos: Punto[], args: ArgsPoly) {
  const predeterminados = {
    x: 0,
    y: 0,
    fil: 'rgba(0,0,0,0)',
    str: 'rgba(0,0,0,0)',
    ancho: 0,
  };

  const { x, y, fil, str, ancho } = { ...predeterminados, ...args };

  let canv = "<polyline points='";

  puntos.forEach((punto) => {
    canv += ` ${(punto[0] + x).toFixed(1)},${(punto[1] + y).toFixed(1)}`;
  });

  canv += `' style='fill:${fil};stroke:${str};stroke-width:${ancho}'/>`;
  return canv;
}
