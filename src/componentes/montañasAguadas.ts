import type { Punto } from '@/tipos';
import { PI } from '@/utilidades/constantes';
import { noise } from '@/utilidades/Perlin';
import { buscarCentro, triangulate } from '@/utilidades/Polytools';
import { poly } from '@/utilidades/Util';

export default function montañasAguadas(
  x: number,
  y: number,
  seed = 0,
  args?: { alto?: number; len?: number; seg?: number }
) {
  const predeterminados = { alto: 300, len: 2000, seg: 5 };
  const { alto, len, seg } = { ...predeterminados, ...args };
  let canv = '';
  const span = 10;
  const ptlist: Punto[][] = [];

  for (let i = 0; i < len / span / seg; i++) {
    ptlist.push([]);

    for (let j = 0; j < seg + 1; j++) {
      const tran = (k: number): Punto => [
        x + k * span,
        y - alto * noise(k * 0.05, seed) * Math.pow(Math.sin((PI * k) / (len / span)), 0.5),
      ];

      ptlist[ptlist.length - 1].push(tran(i * seg + j));
    }

    for (let j = 0; j < seg / 2 + 1; j++) {
      const tran = (k: number): Punto => [
        x + k * span,
        y + 24 * noise(k * 0.05, 2, seed) * Math.pow(Math.sin((PI * k) / (len / span)), 1),
      ];

      ptlist[ptlist.length - 1].unshift(tran(i * seg + j * 2));
    }
  }
  for (let i = 0; i < ptlist.length; i++) {
    const getCol = (x: number, y: number) => {
      const c = (noise(x * 0.02, y * 0.02, y) * 55 + 200) | 0;
      return `rgb(${c},${c},${c})`;
    };

    canv += poly(ptlist[i], {
      fil: getCol(...ptlist[i][ptlist[i].length - 1]),
      str: 'none',
      ancho: 1,
    });

    const T = triangulate(ptlist[i], {
      area: 100,
      convex: true,
      optimize: false,
    });

    for (let k = 0; k < T.length; k++) {
      const m = buscarCentro(T[k]);
      const co = getCol(m[0], m[1]);
      canv += poly(T[k], { fil: co, str: co, ancho: 1 });
    }
  }
  return canv;
}
