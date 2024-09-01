import type { Punto } from '@/tipos';

export function parseArgs(key2f: { [llave: string]: (x: string) => void }) {
  let par = window.location.href.split('?')[1];

  if (par == undefined) {
    return;
  }

  const partes = par.split('&');

  for (let i = 0; i < partes.length; i++) {
    const [llave, valor] = partes[i].split('=');

    try {
      key2f[llave](valor);
    } catch (e) {
      console.log(e);
    }
  }
}

export function calcViewBox(x: number, ancho: number, alto: number) {
  const zoom = 1.142;
  return `${x} 0 ${ancho / zoom} ${alto / zoom}`;
}

export function invertir<Esquema>(puntos: Punto[] | Punto[][], axis = 0) {
  for (let i = 0; i < puntos.length; i++) {
    if (puntos[i].length > 0) {
      if (typeof puntos[i][0] == 'object') {
        for (let j = 0; j < puntos[i].length; j++) {
          (puntos as Punto[][])[i][j][0] = axis - ((puntos as Punto[][])[i][j][0] - axis);
        }
      } else {
        puntos[i][0] = axis - ((puntos as Punto[])[i][0] - axis);
      }
    }
  }
  return puntos as Esquema;
}
