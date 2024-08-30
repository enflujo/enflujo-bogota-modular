import type { ArgsChoza, Punto } from '@/tipos';
import { texture } from '@/utilidades/cosas';
import { poly, wtrand } from '@/utilidades/Util';

export default (x: number, y: number, args: ArgsChoza) => {
  const predeterminados = { alto: 40, ancho: 180, tex: 300 };
  const { alto, ancho, tex } = { ...predeterminados, ...args };
  const reso = [10, 10];
  const puntos: Punto[][] = [];

  for (let i = 0; i < reso[0]; i++) {
    puntos.push([]);

    const alto2 = alto + alto * 0.2 * Math.random();

    for (let j = 0; j < reso[1]; j++) {
      const nx = ancho * (i / (reso[0] - 1) - 0.5) * Math.pow(j / (reso[1] - 1), 0.7);
      const ny = alto2 * (j / (reso[1] - 1));
      puntos[puntos.length - 1].push([nx, ny]);
    }
  }

  let svg = '';

  /** Fondo para que el techo no sea transparente */
  svg += poly(puntos[0].slice(0, -1).concat(puntos[puntos.length - 1].slice(0, -1).reverse()), {
    xof: x,
    yof: y,
    fil: 'white',
    str: 'none',
  });

  /** Contorno del techo, lado izquierdo */
  svg += poly(puntos[0], {
    xof: x,
    yof: y,
    fil: 'none',
    str: 'rgba(100,100,100,0.3)',
    ancho: 2,
  });

  /** Contorno del techo, lado derecho */
  svg += poly(puntos[puntos.length - 1], {
    xof: x,
    yof: y,
    fil: 'none',
    str: 'rgba(100,100,100,0.3)',
    ancho: 2,
  });

  /**
   * La textura del techo
   */
  svg += texture(puntos, {
    xof: x,
    yof: y,
    tex: tex,
    ancho: 1,
    len: 0.25,
    col: () => 'rgba(120,120,120,' + (0.3 + Math.random() * 0.3).toFixed(3) + ')',
    dis: () => wtrand((a) => a * a),
    noi: () => 5,
  });

  /** Marcar techo con líneas rojas */
  // for (let i = 0; i < reso[0]; i++) {
  //   svg += poly(ptlist[i], { xof: xoff, yof: yoff, fil: 'none', str: 'red', ancho: 2 });
  // }

  return svg;
};
