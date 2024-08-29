import { noise } from '../utilidades/Perlin';
import { midPt, triangulate } from '../utilidades/Polytools';
import { poly } from '../utilidades/Util';

export default (xoff: number, yoff: number, seed = 0, args?: { hei?: number; len?: number; seg?: number }) => {
  const predeterminados = { hei: 300, len: 2000, seg: 5 };
  const { hei, len, seg } = { ...predeterminados, ...args };
  let canv = '';
  const span = 10;
  const ptlist: number[][][] = [];

  for (let i = 0; i < len / span / seg; i++) {
    ptlist.push([]);

    for (let j = 0; j < seg + 1; j++) {
      const tran = (k: number) => [
        xoff + k * span,
        yoff - hei * noise(k * 0.05, seed) * Math.pow(Math.sin((Math.PI * k) / (len / span)), 0.5),
      ];

      ptlist[ptlist.length - 1].push(tran(i * seg + j));
    }

    for (let j = 0; j < seg / 2 + 1; j++) {
      const tran = (k: number) => [
        xoff + k * span,
        yoff + 24 * noise(k * 0.05, 2, seed) * Math.pow(Math.sin((Math.PI * k) / (len / span)), 1),
      ];

      ptlist[ptlist.length - 1].unshift(tran(i * seg + j * 2));
    }
  }
  for (let i = 0; i < ptlist.length; i++) {
    const getCol = (x: number, y: number) => {
      const c = (noise(x * 0.02, y * 0.02, yoff) * 55 + 200) | 0;
      return `rgb(${c},${c},${c})`;
    };

    canv += poly(ptlist[i], {
      fil: getCol(...ptlist[i][ptlist[i].length - 1]),
      str: 'none',
      wid: 1,
    });

    const T = triangulate(ptlist[i], {
      area: 100,
      convex: true,
      optimize: false,
    });

    for (let k = 0; k < T.length; k++) {
      const m = midPt(T[k]);
      const co = getCol(m[0], m[1]);
      canv += poly(T[k], { fil: co, str: co, wid: 1 });
    }
  }
  return canv;
};
