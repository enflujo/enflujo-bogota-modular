export const btnHoverCol = 'rgba(0,0,0,0.1)';

export function toggleVisible(id: string) {
  const elemento = document.getElementById(id);

  if (elemento) {
    const v = elemento?.style.display == 'none';
    elemento.style.display = v ? 'block' : 'none';
  }
}

export function toggleText(id: string, a: string, b: string) {
  const elemento = document.getElementById(id);

  if (elemento) {
    const v = elemento.innerHTML;
    elemento.innerHTML = v == '' || v == b ? a : b;
  }
}

let lastScrollX = 0;
let pFrame = 0;

export function present() {
  const currScrollX = window.scrollX;
  const step = 1;
  document.body.scrollTo(Math.max(0, pFrame - 10), window.scrollY);

  pFrame += step;

  //console.log([lastScrollX,currScrollX]);

  if (pFrame < 20 || Math.abs(lastScrollX - currScrollX) < step * 2) {
    lastScrollX = currScrollX;
    setTimeout(present, 1);
  }
}

export function reloadWSeed(s: number) {
  const u = window.location.href.split('?')[0];
  window.location.href = `${u}?seed=${s}`;
  //window.location.reload(true)
}
