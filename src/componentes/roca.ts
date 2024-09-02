import type { Punto } from '@/tipos';
import { DOS_PI, MEDIO_PI, PI } from '@/utilidades/constantes';
import { stroke, texture } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { loopNoise, poly } from '@/utilidades/Util';

export default function roca(
  xoff: number,
  yoff: number,
  seed = 0,
  args?: { alto?: number; ancho?: number; tex?: number; sha?: number }
) {
  const predeterminados = {
    alto: 80,
    ancho: 100,
    tex: 40,
    sha: 10,
  };

  const { alto, ancho, tex, sha } = { ...predeterminados, ...args };
  let canv = '';
  const reso = [10, 50];
  const ptlist: Punto[][] = [];

  for (let i = 0; i < reso[0]; i++) {
    ptlist.push([]);

    const nslist = [];
    for (let j = 0; j < reso[1]; j++) {
      nslist.push(noise(i, j * 0.2, seed));
    }
    loopNoise(nslist);

    for (let j = 0; j < reso[1]; j++) {
      const a = (j / reso[1]) * DOS_PI - MEDIO_PI;
      let l = (ancho * alto) / Math.sqrt(Math.pow(alto * Math.cos(a), 2) + Math.pow(ancho * Math.sin(a), 2));
      l *= 0.7 + 0.3 * nslist[j];

      const p = 1 - i / reso[0];
      const nx = Math.cos(a) * l * p;
      let ny = -Math.sin(a) * l * p;

      if (PI < a || a < 0) ny *= 0.2;
      ny += alto * (i / reso[0]) * 0.2;
      ptlist[ptlist.length - 1].push([nx, ny]);
    }
  }

  //WHITE BG
  canv += poly(ptlist[0].concat([[0, 0]]), {
    x: xoff,
    y: yoff,
    fil: 'white',
    str: 'none',
  });
  //OUTLINE
  canv += stroke(
    ptlist[0].map((p) => [p[0] + xoff, p[1] + yoff]),
    { color: 'rgba(100,100,100,0.3)', noi: 1, ancho: 3 }
  );
  canv += texture(ptlist, {
    xof: xoff,
    yof: yoff,
    tex: tex,
    ancho: 3,
    sha: sha,
    color: () => 'rgba(180,180,180,' + (0.3 + Math.random() * 0.3).toFixed(3) + ')',
    dis: () => {
      if (Math.random() > 0.5) {
        return 0.15 + 0.15 * Math.random();
      } else {
        return 0.85 - 0.15 * Math.random();
      }
    },
  });

  // for (let i = 0; i < reso[0]; i++) {
  //   canv += poly(ptlist[i], { x: xoff, y: yoff, fil: 'none', str: 'red', ancho: 2 });
  // }
  return canv;
}
