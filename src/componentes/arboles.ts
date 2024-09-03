import type { Arbol, Arbol2, Arbol3, ArgsArbol, ArgsFrac, Punto } from '@/tipos';
import { MEDIO_PI, PI } from '@/utilidades/constantes';
import { blob, stroke } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { poly, randChoice, randGaussian } from '@/utilidades/Util';
import { branch, crearCorteza, twig } from './partesArboles';

export function arbol1(x: number, y: number, args: ArgsArbol) {
  const predeterminados: Arbol = { alto: 50, ancho: 3, color: 'rgba(100,100,100,0.5)' };
  const { alto, ancho, color } = { ...predeterminados, ...args };
  let reso = 10;
  const nslist = [];

  for (let i = 0; i < reso; i++) {
    nslist.push([noise(i * 0.5), noise(i * 0.5, 0.5)]);
  }

  let colorHoja;

  if (color.includes('rgba(')) {
    colorHoja = color.replace('rgba(', '').replace(')', '').split(',');
  } else {
    colorHoja = ['100', '100', '100', '0.5'];
  }

  let svg = '';
  const line1: Punto[] = [];
  const line2: Punto[] = [];

  for (let i = 0; i < reso; i++) {
    const nx = x;
    const ny = y - (i * alto) / reso;

    if (i >= reso / 4) {
      for (let j = 0; j < (reso - i) / 5; j++) {
        const [r, g, b, a] = colorHoja;
        svg += blob(nx + (Math.random() - 0.5) * ancho * 1.2 * (reso - i), ny + (Math.random() - 0.5) * ancho, {
          len: Math.random() * 20 * (reso - i) * 0.2 + 10,
          ancho: Math.random() * 6 + 3,
          ang: ((Math.random() - 0.5) * PI) / 6,
          color: `rgba(${r},${g},${b},${(Math.random() * 0.2 + parseFloat(a)).toFixed(1)})`,
        });
      }
    }
    line1.push([nx + (nslist[i][0] - 0.5) * ancho - ancho / 2, ny]);
    line2.push([nx + (nslist[i][1] - 0.5) * ancho + ancho / 2, ny]);
  }

  svg += poly(line1, { fil: 'none', str: color, ancho: 1.5 }) + poly(line2, { fil: 'none', str: color, ancho: 1.5 });
  return svg;
}

export function arbol2(x: number, y: number, args?: ArgsArbol) {
  const predeterminados: Arbol2 = { alto: 16, ancho: 8, clu: 5, color: 'rgba(100,100,100,0.5)' };
  const { alto, ancho, clu, color } = { ...predeterminados, ...args };
  let svg = '';

  for (let i = 0; i < clu; i++) {
    svg += blob(x + randGaussian() * clu * 4, y + randGaussian() * clu * 4, {
      ang: MEDIO_PI,
      fun: (x: number) =>
        x <= 1 ? Math.pow(Math.sin(x * PI) * x, 0.5) : -Math.pow(Math.sin((x - 2) * PI * (x - 2)), 0.5),
      ancho: Math.random() * ancho * 0.75 + ancho * 0.5,
      len: Math.random() * alto * 0.75 + alto * 0.5,
      color,
    });
  }

  return svg;
}

export function arbol3(x: number, y: number, args: ArgsArbol) {
  const predeterminados: Arbol3 = { alto: 50, ancho: 5, color: 'rgba(100,100,100,0.5)', ben: () => 0 };

  const { alto, ancho, color, ben } = { ...predeterminados, ...args };
  const reso = 10;
  const nslist = [];

  for (let i = 0; i < reso; i++) {
    nslist.push([noise(i * 0.5), noise(i * 0.5, 0.5)]);
  }

  let leafcol;

  if (color.includes('rgba(')) {
    leafcol = color.replace('rgba(', '').replace(')', '').split(',');
  } else {
    leafcol = ['100', '100', '100', '0.5'];
  }

  let blobs = '';
  const line1: Punto[] = [];
  const line2: Punto[] = [];

  for (let i = 0; i < reso; i++) {
    const nx = x + ben(i / reso) * 100;
    const ny = y - (i * alto) / reso;

    if (i >= reso / 5) {
      for (let j = 0; j < (reso - i) * 2; j++) {
        const shape = (x: number) => Math.log(50 * x + 1) / 3.95;
        const ox = Math.random() * ancho * 2 * shape((reso - i) / reso);
        const [r, g, b] = leafcol;

        blobs += blob(nx + ox * randChoice<number>([-1, 1]), ny + (Math.random() - 0.5) * ancho * 2, {
          len: ox * 2,
          ancho: Math.random() * 6 + 3,
          ang: ((Math.random() - 0.5) * PI) / 6,
          color: `rgba(${r},${g},${b},${(Math.random() * 0.2 + parseFloat(leafcol[3])).toFixed(3)})`,
        });
      }
    }

    line1.push([nx + (((nslist[i][0] - 0.5) * ancho - ancho / 2) * (reso - i)) / reso, ny]);
    line2.push([nx + (((nslist[i][1] - 0.5) * ancho + ancho / 2) * (reso - i)) / reso, ny]);
  }
  const lc = line1.concat(line2.reverse());
  let svg = poly(lc, { fil: 'white', str: color, ancho: 1.5 });
  svg += blobs;
  return svg;
}

export function arbol4(x: number, y: number, args: ArgsArbol) {
  const predeterminados: Arbol = { alto: 300, ancho: 6, color: 'rgba(100,100,100,0.5)' };
  const { alto, ancho, color } = { ...predeterminados, ...args };
  const trlist = branch({ alto: alto, ancho: ancho, ang: -MEDIO_PI });
  let corteza = crearCorteza(x, y, trlist);
  let ramita = '';
  let trmlist: Punto[] = [];
  const rama1 = trlist[0].concat(trlist[1].reverse());

  for (let i = 0; i < rama1.length; i++) {
    if ((i >= rama1.length * 0.3 && i <= rama1.length * 0.7 && Math.random() < 0.1) || i == rama1.length / 2 - 1) {
      const ba = PI * 0.2 - PI * 1.4 * +(i > rama1.length / 2);
      const ramas = branch({ alto: alto * (Math.random() + 1) * 0.3, ancho: ancho * 0.5, ang: ba });

      ramas[0].splice(0, 1);
      ramas[1].splice(0, 1);

      const foff = (v: Punto): Punto => [v[0] + rama1[i][0], v[1] + rama1[i][1]];

      corteza += crearCorteza(x, y, [ramas[0].map(foff), ramas[1].map(foff)]);

      for (let j = 0; j < ramas[0].length; j++) {
        if (Math.random() < 0.2 || j == ramas[0].length - 1) {
          const [x1, y1] = ramas[0][j];
          const [x2, y2] = rama1[i];
          ramita += twig(x1 + x2 + x, y1 + y2 + y, 1, {
            ancho: alto / 300,
            ang: ba > -MEDIO_PI ? ba : ba + PI,
            sca: (0.5 * alto) / 300,
            dir: ba > -MEDIO_PI ? 1 : -1,
          });
        }
      }

      const rama2 = ramas[0].concat(ramas[1].reverse());
      trmlist = trmlist.concat(rama2.map((v) => [v[0] + rama1[i][0], v[1] + rama1[i][1]]));
    } else {
      trmlist.push(rama1[i]);
    }
  }

  let svg = poly(trmlist, { x, y, fil: 'white', str: color, ancho: 0 });

  trmlist.splice(0, 1);
  trmlist.splice(trmlist.length - 1, 1);

  svg += stroke(
    trmlist.map((v) => [v[0] + x, v[1] + y]),
    {
      color: 'rgba(100,100,100,' + (0.4 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: () => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  svg += corteza;
  svg += ramita;

  return svg;
}

export function arbol5(x: number, y: number, args: ArgsArbol) {
  const predeterminados: Arbol = { alto: 300, ancho: 5, color: 'rgba(100,100,100,0.5)' };
  const { alto, ancho, color } = { ...predeterminados, ...args };
  const trlist = branch({ alto: alto, ancho: ancho, ang: -MEDIO_PI, ben: 0 });
  const corteza = crearCorteza(x, y, trlist);
  const rama1 = trlist[0].concat(trlist[1].reverse());
  let trmlist: Punto[] = [];
  let twcanv = '';

  for (let i = 0; i < rama1.length; i++) {
    const p = Math.abs(i - rama1.length * 0.5) / (rama1.length * 0.5);

    if (
      (i >= rama1.length * 0.2 && i <= rama1.length * 0.8 && i % 3 == 0 && Math.random() > p) ||
      i == rama1.length / 2 - 1
    ) {
      const bar = Math.random() * 0.2;
      const ba = -bar * PI - (1 - bar * 2) * PI * +(i > rama1.length / 2);
      const ramas = branch({
        alto: alto * (0.3 * p - Math.random() * 0.05),
        ancho: ancho * 0.5,
        ang: ba,
        ben: 0.5,
      });

      ramas[0].splice(0, 1);
      ramas[1].splice(0, 1);

      for (let j = 0; j < ramas[0].length; j++) {
        if (j % 20 == 0 || j == ramas[0].length - 1) {
          twcanv += twig(ramas[0][j][0] + rama1[i][0] + x, ramas[0][j][1] + rama1[i][1] + y, 0, {
            ancho: alto / 300,
            ang: ba > -MEDIO_PI ? ba : ba + PI,
            sca: (0.2 * alto) / 300,
            dir: ba > -MEDIO_PI ? 1 : -1,
            lea: [true, 5],
          });
        }
      }

      const rama2 = ramas[0].concat(ramas[1].reverse());

      trmlist = trmlist.concat(
        rama2.map(function (v) {
          return [v[0] + rama1[i][0], v[1] + rama1[i][1]];
        })
      );
    } else {
      trmlist.push(rama1[i]);
    }
  }

  let svg = poly(trmlist, { x, y, fil: 'white', str: color, ancho: 0 });

  trmlist.splice(0, 1);
  trmlist.splice(trmlist.length - 1, 1);

  svg += stroke(
    trmlist.map((v) => [v[0] + x, v[1] + y]),
    {
      color: 'rgba(100,100,100,' + (0.4 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: () => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  svg += corteza;
  svg += twcanv;

  return svg;
}

export function arbol6(x: number, y: number, args: ArgsArbol) {
  const predeterminados: Arbol = { alto: 100, ancho: 6, color: 'rgba(100,100,100,0.5)' };
  const { alto, ancho, color } = { ...predeterminados, ...args };

  let corteza = '';
  let ramita = '';
  var trmlist = fracTree(x, y, 3, {
    alto: alto,
    ancho: ancho,
    ang: -MEDIO_PI,
    ben: 0,
  });

  let svg = poly(trmlist, { x, y, fil: 'white', str: color, ancho: 0 });

  trmlist.splice(0, 1);
  trmlist.splice(trmlist.length - 1, 1);
  svg += stroke(
    trmlist.map((v) => [v[0] + x, v[1] + y]),
    {
      color: 'rgba(100,100,100,' + (0.4 + Math.random() * 0.1).toFixed(3) + ')',
      ancho: 2.5,
      fun: () => Math.sin(1),
      noi: 0.9,
      out: 0,
    }
  );

  svg += corteza;
  svg += ramita;

  function fracTree(_x: number, _y: number, dep: number, args?: ArgsFrac) {
    const predeterminados = { alto: 300, ancho: 5, ang: 0, ben: PI * 0.2 };
    const { alto, ancho, ang, ben } = { ...predeterminados, ...args };
    const ramas = branch({ alto, ancho, ang, ben, det: alto / 20 });

    corteza += crearCorteza(_x, _y, ramas);

    const rama = ramas[0].concat(ramas[1].reverse());
    let arbol: Punto[] = [];
    const totalPuntos = rama.length;
    const centro = totalPuntos / 2;

    for (let i = 0; i < totalPuntos; i++) {
      if (
        ((Math.random() < 0.025 && i >= totalPuntos * 0.2 && i <= totalPuntos * 0.8) ||
          i == (centro | 0) - 1 ||
          i == (centro | 0) + 1) &&
        dep > 0
      ) {
        const bar = 0.02 + Math.random() * 0.08;
        const ba = bar * PI - bar * 2 * PI * +(i > centro);
        const brlist = fracTree(rama[i][0] + _x, rama[i][1] + _y, dep - 1, {
          alto: alto * (0.7 + Math.random() * 0.2),
          ancho: ancho * 0.6,
          ang: ang + ba,
          ben: 0.55,
        });

        for (let j = 0; j < brlist.length; j++) {
          if (Math.random() < 0.03) {
            ramita += twig(brlist[j][0] + rama[i][0] + _x, brlist[j][1] + rama[i][1] + _y, 2, {
              ang: ba * (Math.random() * 0.5 + 0.75),
              sca: 0.3,
              dir: ba > 0 ? 1 : -1,
              lea: [false, 0],
            });
          }
        }

        arbol = arbol.concat(brlist.map((v) => [v[0] + rama[i][0], v[1] + rama[i][1]]));
      } else {
        arbol.push(rama[i]);
      }
    }

    return arbol;
  }

  return svg;
}
