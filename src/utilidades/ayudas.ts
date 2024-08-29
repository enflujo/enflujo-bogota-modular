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
