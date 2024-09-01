import type { Punto } from '@/tipos';
import { stroke } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';

export default (x: number, y: number, args?: { alto?: number; len?: number; clu?: number }) => {
  const predeterminados = { alto: 2, len: 800, clu: 10 };
  const { alto, len, clu } = { ...predeterminados, ...args };
  const puntos: Punto[][] = [];
  let svg = '';
  let yk = 0;

  for (let i = 0; i < clu; i++) {
    puntos.push([]);
    const xk = (Math.random() - 0.5) * (len / 8);
    const lk = len / 4 + Math.random() * (len / 4);
    const reso = 5;

    yk += Math.random() * 5;

    for (let j = -lk; j < lk; j += reso) {
      puntos[puntos.length - 1].push([j + xk, Math.sin(j * 0.2) * alto * noise(j * 0.1) - 20 + yk]);
    }
  }

  for (let j = 1; j < puntos.length; j++) {
    svg += stroke(
      puntos[j].map((p) => [p[0] + x, p[1] + y]),
      {
        col: `rgba(100,100,100,${(0.3 + Math.random() * 0.3).toFixed(3)})`,
        ancho: 1,
      }
    );
  }

  return svg;
};
