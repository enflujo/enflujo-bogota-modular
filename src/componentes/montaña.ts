import type { OpcionesMontaña, Punto } from '@/tipos';
import { stroke, texture } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { normRand, poly, randChoice } from '@/utilidades/Util';
import { arch02, arch03, arch04 } from '@/componentes/Arch';
import roca from '@/componentes/roca';
import torreLuz from '@/componentes/torreLuz';
import { tree01, tree02, tree03 } from '@/componentes/Tree';
import { PI } from '@/utilidades/constantes';

export default function montaña(xoff: number, yoff: number, seed = 0, args?: OpcionesMontaña) {
  const predeterminados = {
    alto: 100 + Math.random() * 400,
    ancho: 400 + Math.random() * 200,
    tex: 200,
    veg: true,
    col: '',
  };
  const { alto, ancho, tex, veg } = { ...predeterminados, ...args };

  let svg = '';
  const puntos: Punto[][] = [];
  const h = alto;
  const w = ancho;
  const reso = [10, 50];
  let hoff = 0;

  for (let j = 0; j < reso[0]; j++) {
    hoff += (Math.random() * yoff) / 100;
    puntos.push([]);

    for (let i = 0; i < reso[1]; i++) {
      const x = (i / reso[1] - 0.5) * PI;
      const y = Math.cos(x) * noise(x + 10, j * 0.15, seed);
      const p = 1 - j / reso[0];
      puntos[puntos.length - 1].push([(x / PI) * w * p, -y * h * p + hoff]);
    }
  }

  function vegetate(
    treeFunc: (x: number, y: number) => string,
    growthRule: (i: number, j: number) => boolean,
    proofRule: (veglist: Punto[], i: number) => boolean
  ) {
    const veglist: Punto[] = [];

    for (let i = 0; i < puntos.length; i++) {
      for (let j = 0; j < puntos[i].length; j++) {
        if (growthRule(i, j)) {
          const p = puntos[i][j];
          veglist.push(p);
        }
      }
    }

    for (let i = 0; i < veglist.length; i++) {
      if (proofRule(veglist, i)) {
        const [_x, _y] = veglist[i];
        svg += treeFunc(_x, _y);
      }
    }
  }

  /** Arboles por contorno superior */
  vegetate(
    (x: number, y: number) => {
      return tree02(x + xoff, y + yoff - 5, {
        col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) + ')',
        clu: 2,
      });
    },
    (i: number, j: number) => {
      const ns = noise(j * 0.1, seed);
      return i == 0 && ns * ns * ns < 0.1 && Math.abs(puntos[i][j][1]) / h > 0.2;
    },
    () => true
  );

  /** Fondo */
  svg += poly(puntos[0].concat([[0, reso[0] * 4]]), {
    x: xoff,
    y: yoff,
    fil: 'white',
    str: 'none',
  });

  /** Contorno pero sin piso o parte baja */
  svg += stroke(
    puntos[0].map((p) => [p[0] + xoff, p[1] + yoff]),
    { col: 'rgba(100,100,100,0.3)', noi: 1, ancho: 3 }
  );

  /** Contornos parte baja de la montaña, como deditos de pies */
  svg += foot(puntos, { x: xoff, y: yoff });

  /** Textura interior */
  svg += texture(puntos, {
    xof: xoff,
    yof: yoff,
    tex: tex,
    sha: randChoice([0, 0, 0, 0, 5]),
  });

  /** Arboles punta */
  vegetate(
    (x: number, y: number) => {
      return tree02(x + xoff, y + yoff, {
        col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) + ')',
      });
    },
    (i: number, j: number) => {
      const ns = noise(i * 0.1, j * 0.1, seed + 2);
      return ns * ns * ns < 0.1 && Math.abs(puntos[i][j][1]) / h > 0.5;
    },
    () => true
  );

  if (veg) {
    // /** Arboles parte media */
    vegetate(
      (x: number, y: number) => {
        let ht = ((h + y) / h) * 70;
        ht = ht * 0.3 + Math.random() * ht * 0.7;
        return tree01(x + xoff, y + yoff, {
          alto: ht,
          ancho: Math.random() * 3 + 1,
          col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) + ')',
        });
      },
      (i: number, j: number) => {
        const ns = noise(i * 0.2, j * 0.05, seed);
        return !!(j % 2 && ns * ns * ns * ns < 0.012 && Math.abs(puntos[i][j][1]) / h < 0.3);
      },
      (veglist: number[][], i: number) => {
        let counter = 0;
        for (let j = 0; j < veglist.length; j++) {
          if (
            i != j &&
            Math.pow(veglist[i][0] - veglist[j][0], 2) + Math.pow(veglist[i][1] - veglist[j][1], 2) < 30 * 30
          ) {
            counter++;
          }
          if (counter > 2) {
            return true;
          }
        }
        return false;
      }
    );

    /** Arboles parte baja */
    vegetate(
      (x: number, y: number) => {
        let ht = ((h + y) / h) * 120;
        ht = ht * 0.5 + Math.random() * ht * 0.5;
        const bc = Math.random() * 0.1;
        const bp = 1;
        return tree03(x + xoff, y + yoff, {
          alto: ht,
          ben: (x) => Math.pow(x * bc, bp),
          col: 'rgba(100,100,100,' + (noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) + ')',
        });
      },
      (i: number, j: number) => {
        const ns = noise(i * 0.2, j * 0.05, seed);
        return (j == 0 || j == puntos[i].length - 1) && ns * ns * ns * ns < 0.012;
      },
      () => true
    );
  }

  /** Casitas parte baja */
  vegetate(
    (x: number, y: number) => {
      const tt = randChoice([0, 0, 1, 1, 1, 2]);

      if (tt == 1) {
        return arch02(x + xoff, y + yoff, seed, {
          ancho: normRand(40, 70),
          sto: randChoice([1, 2, 2, 3]),
          rot: Math.random(),
          sty: randChoice([1, 2, 3]),
        });
      } else if (tt == 2) {
        return arch04(x + xoff, y + yoff, seed, {
          sto: randChoice([1, 1, 1, 2, 2]),
        });
      } else {
        return '';
      }
    },
    (i: number, j: number) => {
      const ns = noise(i * 0.2, j * 0.05, seed + 10);
      return i != 0 && (j == 1 || j == puntos[i].length - 2) && ns * ns * ns * ns < 0.008;
    },
    () => true
  );

  /** Torres punta de la montaña */
  vegetate(
    (x: number, y: number) => {
      return arch03(x + xoff, y + yoff, seed, {
        sto: randChoice([5, 7]),
        ancho: 40 + Math.random() * 20,
      });
    },
    (i: number, j: number) => i == 1 && Math.abs(j - puntos[i].length / 2) < 1 && Math.random() < 0.02,
    () => true
  );

  /** Torres de luz */
  vegetate(
    (x: number, y: number) => torreLuz(x + xoff, y + yoff),
    (i: number, j: number) => {
      const ns = noise(i * 0.2, j * 0.05, seed + 20 * PI);
      return i % 2 == 0 && (j == 1 || j == puntos[i].length - 2) && ns * ns * ns * ns < 0.002;
    },
    () => true
  );

  /** Rocas parte inferior */
  vegetate(
    (x: number, y: number) => {
      return roca(x + xoff, y + yoff, seed, {
        ancho: 20 + Math.random() * 20,
        alto: 20 + Math.random() * 20,
        sha: 2,
      });
    },
    (i: number, j: number) => (j == 0 || j == puntos[i].length - 1) && Math.random() < 0.1,
    () => true
  );

  return svg;
}

function foot(areaMontaña: Punto[][], args: { x?: number; y?: number }) {
  const predeterminados = { x: 0, y: 0 };
  const { x, y } = { ...predeterminados, ...args };
  const lineas: Punto[][] = [];
  const cantidadLineas = 6;
  let ni = 0;

  for (let i = 0; i < areaMontaña.length - 2; i++) {
    if (i === ni) {
      const puntos = areaMontaña[i];
      const totalPuntos = puntos.length;
      const altura = noise(x * 0.05, i) * 5;

      ni = Math.min(ni + randChoice<number>([1, 2]), areaMontaña.length - 1);
      lineas.push([], []);
      const posLineaA = lineas.length - 2;
      const posLineaB = posLineaA + 1;

      for (let j = 0; j < Math.min(totalPuntos / 8, 10); j++) {
        const punto = puntos[j];
        const ruido = noise(j * 0.1, i) * 10;
        const ii = totalPuntos - 1 - j;
        lineas[posLineaA].push([punto[0] + ruido, punto[1]]);
        lineas[posLineaB].push([puntos[ii][0] - ruido, puntos[ii][1]]);
      }

      lineas[posLineaA] = lineas[posLineaA].reverse();
      lineas[posLineaB] = lineas[posLineaB].reverse();

      for (let j = 0; j < cantidadLineas; j++) {
        const p = j / cantidadLineas;
        const x1 = puntos[0][0] * (1 - p) + areaMontaña[ni][0][0] * p;
        const x2 = puntos[totalPuntos - 1][0] * (1 - p) + areaMontaña[ni][totalPuntos - 1][0] * p;
        let y1 = puntos[0][1] * (1 - p) + areaMontaña[ni][0][1] * p;
        let y2 = puntos[totalPuntos - 1][1] * (1 - p) + areaMontaña[ni][totalPuntos - 1][1] * p;
        const vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
        y1 += vib * 5 + altura;
        y2 += vib * 5 + altura;

        lineas[posLineaA].push([x1, y1]);
        lineas[posLineaB].push([x2, y2]);
      }
    }
  }

  let svg = '';

  for (let i = 0; i < lineas.length; i++) {
    svg += poly(lineas[i], {
      x,
      y,
      fil: 'white',
      str: 'none',
    });
  }

  for (let j = 0; j < lineas.length; j++) {
    svg += stroke(
      lineas[j].map((punto) => [punto[0] + x, punto[1] + y]),
      {
        col: 'rgba(100,100,100,' + (0.1 + Math.random() * 0.1).toFixed(3) + ')',
        ancho: 1,
      }
    );
  }

  return svg;
}
