import type { Punto } from '@/tipos';
import { div, stroke } from '@/utilidades/cosas';

export default (xoff: number, yoff: number, args?: { alto?: number; ancho?: number }) => {
  const predeterminados = { alto: 100, ancho: 20 };
  const { alto, ancho } = { ...predeterminados, ...args };

  let svg = '';
  const toGlobal = (v: Punto): Punto => [v[0] + xoff, v[1] + yoff];

  const quickstroke = (punto: Punto[]) => {
    return stroke(div(punto, 5).map(toGlobal), {
      ancho: 1,
      fun: () => 0.5,
      col: 'rgba(100,100,100,0.4)',
    });
  };

  const p00: Punto = [-ancho * 0.05, -alto];
  const p01: Punto = [ancho * 0.05, -alto];
  const p10: Punto = [-ancho * 0.1, -alto * 0.9];
  const p11: Punto = [ancho * 0.1, -alto * 0.9];
  const p20: Punto = [-ancho * 0.2, -alto * 0.5];
  const p21: Punto = [ancho * 0.2, -alto * 0.5];
  const p30: Punto = [-ancho * 0.5, 0];
  const p31: Punto = [ancho * 0.5, 0];
  const bch: Punto[] = [
    [0.7, -0.85],
    [1, -0.675],
    [0.7, -0.5],
  ];

  for (let i = 0; i < bch.length; i++) {
    svg += quickstroke([
      [-bch[i][0] * ancho, bch[i][1] * alto],
      [bch[i][0] * ancho, bch[i][1] * alto],
    ]);
    svg += quickstroke([
      [-bch[i][0] * ancho, bch[i][1] * alto],
      [0, (bch[i][1] - 0.05) * alto],
    ]);
    svg += quickstroke([
      [bch[i][0] * ancho, bch[i][1] * alto],
      [0, (bch[i][1] - 0.05) * alto],
    ]);

    svg += quickstroke([
      [-bch[i][0] * ancho, bch[i][1] * alto],
      [-bch[i][0] * ancho, (bch[i][1] + 0.1) * alto],
    ]);
    svg += quickstroke([
      [bch[i][0] * ancho, bch[i][1] * alto],
      [bch[i][0] * ancho, (bch[i][1] + 0.1) * alto],
    ]);
  }

  const l10 = div([p00, p10, p20, p30], 5);
  const l11 = div([p01, p11, p21, p31], 5);

  for (let i = 0; i < l10.length - 1; i++) {
    svg += quickstroke([l10[i], l11[i + 1]]);
    svg += quickstroke([l11[i], l10[i + 1]]);
  }

  svg += quickstroke([p00, p01]);
  svg += quickstroke([p10, p11]);
  svg += quickstroke([p20, p21]);
  svg += quickstroke([p00, p10, p20, p30]);
  svg += quickstroke([p01, p11, p21, p31]);

  return svg;
};
