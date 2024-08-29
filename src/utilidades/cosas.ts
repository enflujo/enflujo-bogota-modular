import type { ArgsBolb, ArgsStroke, ArgsTexture, Punto } from '../tipos';
import { noise } from './Perlin';
import { loopNoise, poly } from './Util';

console.log('************************************************');

export function stroke(ptlist: Punto[], args?: ArgsStroke) {
  const predeterminados = {
    xof: 0,
    yof: 0,
    wid: 2,
    col: 'rgba(200,200,200,0.9)',
    noi: 0.5,
    out: 1,
    fun: (x: number) => Math.sin(x * Math.PI),
  };

  const { xof, yof, wid, col, noi, out, fun } = { ...predeterminados, ...args };

  if (ptlist.length == 0) return '';

  const vtxlist0: Punto[] = [];
  const vtxlist1: Punto[] = [];
  let vtxlist = [];

  const n0 = Math.random() * 10;

  for (let i = 1; i < ptlist.length - 1; i++) {
    let w = wid * fun(i / ptlist.length);
    w = w * (1 - noi) + w * noi * noise(i * 0.5, n0);
    let a1 = Math.atan2(ptlist[i][1] - ptlist[i - 1][1], ptlist[i][0] - ptlist[i - 1][0]);
    let a2 = Math.atan2(ptlist[i][1] - ptlist[i + 1][1], ptlist[i][0] - ptlist[i + 1][0]);
    let a = (a1 + a2) / 2;
    if (a < a2) {
      a += Math.PI;
    }
    vtxlist0.push([ptlist[i][0] + w * Math.cos(a), ptlist[i][1] + w * Math.sin(a)]);
    vtxlist1.push([ptlist[i][0] - w * Math.cos(a), ptlist[i][1] - w * Math.sin(a)]);
  }

  vtxlist = [ptlist[0]]
    .concat(vtxlist0.concat(vtxlist1.concat([ptlist[ptlist.length - 1]]).reverse()))
    .concat([ptlist[0]]);

  const canv = poly(
    vtxlist.map((x) => [x[0] + xof, x[1] + yof]),
    { fil: col, str: col, wid: out }
  );

  return canv;
}

export function blob(x: number, y: number, args: ArgsBolb) {
  const predeterminados = {
    len: 20,
    wid: 5,
    ang: 0,
    col: 'rgba(200,200,200,0.9)',
    noi: 0.5,
    ret: 0,
    fun: (x: number) => {
      return x <= 1 ? Math.pow(Math.sin(x * Math.PI), 0.5) : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
    },
  };
  const { len, wid, ang, col, noi, ret, fun } = { ...predeterminados, ...args };

  const reso = 20.0;
  const lalist = [];

  for (let i = 0; i < reso + 1; i++) {
    const p = (i / reso) * 2;
    const xo = len / 2 - Math.abs(p - 1) * len;
    const yo = (fun(p) * wid) / 2;
    const a = Math.atan2(yo, xo);
    const l = Math.sqrt(xo * xo + yo * yo);
    lalist.push([l, a]);
  }
  const nslist = [];
  const n0 = Math.random() * 10;
  for (let i = 0; i < reso + 1; i++) {
    nslist.push(noise(i * 0.05, n0));
  }

  loopNoise(nslist);
  const plist = [];

  for (let i = 0; i < lalist.length; i++) {
    const ns = nslist[i] * noi + (1 - noi);
    const nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
    const ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
    plist.push([nx, ny]);
  }

  if (ret == 0) {
    return poly(plist, { fil: col, str: col, wid: 0 });
  } else {
    return plist;
  }
}

export function div(plist: Punto[], reso: number) {
  const tl = (plist.length - 1) * reso;
  let lx = 0;
  let ly = 0;
  const rlist: Punto[] = [];

  for (let i = 0; i < tl; i += 1) {
    const lastp = plist[Math.floor(i / reso)];
    const nextp = plist[Math.ceil(i / reso)];
    const p = (i % reso) / reso;
    const nx = lastp[0] * (1 - p) + nextp[0] * p;
    const ny = lastp[1] * (1 - p) + nextp[1] * p;

    rlist.push([nx, ny]);
    lx = nx;
    ly = ny;
  }

  if (plist.length > 0) {
    rlist.push(plist[plist.length - 1]);
  }

  return rlist;
}

export function texture(ptlist: Punto[], args: ArgsTexture) {
  const predeterminados = {
    xof: 0,
    yof: 0,
    tex: 400,
    wid: 1.5,
    len: 0.2,
    sha: 0,
    ret: 0,
    noi: (x: number) => 30 / x,
    col: () => 'rgba(100,100,100,' + (Math.random() * 0.3).toFixed(3) + ')',
    dis: () => {
      if (Math.random() > 0.5) {
        return (1 / 3) * Math.random();
      } else {
        return (1 * 2) / 3 + (1 / 3) * Math.random();
      }
    },
  };
  const { xof, yof, tex, wid, len, sha, ret, noi, col, dis } = { ...predeterminados, ...args };
  const reso = [ptlist.length, ptlist[0].length];
  const texlist: Punto[][] = [];

  for (let i = 0; i < tex; i++) {
    const mid = (dis() * reso[1]) | 0;
    //mid = (reso[1]/3+reso[1]/3*Math.random())|0
    const hlen = Math.floor(Math.random() * (reso[1] * len));
    let start = mid - hlen;
    let end = mid + hlen;
    start = Math.min(Math.max(start, 0), reso[1]);
    end = Math.min(Math.max(end, 0), reso[1]);

    const layer = (i / tex) * (reso[0] - 1);

    texlist.push([]);
    for (let j = start; j < end; j++) {
      const p = layer - Math.floor(layer);
      const x = ptlist[Math.floor(layer)][j][0] * p + ptlist[Math.ceil(layer)][j][0] * (1 - p);
      const y = ptlist[Math.floor(layer)][j][1] * p + ptlist[Math.ceil(layer)][j][1] * (1 - p);
      const ns = [noi(layer + 1) * (noise(x, j * 0.5) - 0.5), noi(layer + 1) * (noise(y, j * 0.5) - 0.5)];
      texlist[texlist.length - 1].push([x + ns[0], y + ns[1]]);
    }
  }
  let canv = '';
  //SHADE
  if (sha) {
    for (let j = 0; j < texlist.length; j += 1 + +(sha != 0)) {
      canv += stroke(
        texlist[j].map((x: number[]) => [x[0] + xof, x[1] + yof]),
        { col: 'rgba(100,100,100,0.1)', wid: +sha }
      );
    }
  }
  //TEXTURE
  for (let j = 0 + +sha; j < texlist.length; j += 1 + +sha) {
    canv += stroke(
      texlist[j].map((x: number[]) => [x[0] + xof, x[1] + yof]),
      { col: col(j / texlist.length), wid: wid }
    );
  }
  return ret ? texlist : canv;
}
