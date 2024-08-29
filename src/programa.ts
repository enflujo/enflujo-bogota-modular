import { arch02, boat01 } from './componentes/Arch';
import { distMount, flatMount, mountain } from './componentes/Mount';
import { btnHoverCol, present, reloadWSeed, toggleText, toggleVisible } from './componentes/UI';
import './scss/estilos.scss';
import { water } from './utilidades/cosas';
import { download } from './utilidades/downloader';
import { noise } from './utilidades/Perlin';
import { randChoice } from './utilidades/Util';

const SET_BTN = document.getElementById('SET_BTN') as HTMLDivElement;
const SETTING = document.getElementById('SETTING') as HTMLDivElement;
const BG = document.getElementById('BG') as HTMLDivElement;
const GENERATE = document.getElementById('GENERATE') as HTMLButtonElement;
const INP_SEED = document.getElementById('INP_SEED') as HTMLInputElement;
const VIEW_LEFT = document.getElementById('VIEW_LEFT') as HTMLButtonElement;
const VIEW_RIGHT = document.getElementById('VIEW_RIGHT') as HTMLButtonElement;
const INC_STEP = document.getElementById('INC_STEP') as HTMLInputElement;
const AUTO_SCROLL = document.getElementById('AUTO_SCROLL') as HTMLInputElement;
const dwnbtn = document.getElementById('dwn-btn') as HTMLButtonElement;
const SOURCE_BTN = document.getElementById('SOURCE_BTN') as HTMLDivElement;
const L = document.getElementById('L') as HTMLDivElement;
const R = document.getElementById('R') as HTMLDivElement;
const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const MEM = {
  canv: '',
  chunks: [],
  xmin: 0,
  xmax: 0,
  cwid: 512,
  cursx: 0,
  lasttick: 0,
  windx: 3000,
  windy: 800,
  planmtx: [],
};

SVG.setAttribute('style', 'mix-blend-mode:multiply;');
const GRUPO = document.createElementNS('http://www.w3.org/2000/svg', 'g');
GRUPO.setAttribute('transform', `translate(0,0)`);
SVG.appendChild(GRUPO);

GENERATE.onclick = () => reloadWSeed(INP_SEED.value);
VIEW_LEFT.onclick = () => xcroll(-parseFloat(INC_STEP.value));
VIEW_RIGHT.onclick = () => xcroll(parseFloat(INC_STEP.value));
AUTO_SCROLL.onchange = () => autoxcroll(parseFloat(INC_STEP.value));
dwnbtn.onclick = () => download('' + Math.random() + '.svg', BG.innerHTML);
SOURCE_BTN.onmouseover = () => (SOURCE_BTN.style.backgroundColor = btnHoverCol);
SOURCE_BTN.onmouseout = () => (SOURCE_BTN.style.backgroundColor = 'rgba(0,0,0,0)');
SOURCE_BTN.onclick = () => (window.location = 'https://github.com/LingDong-/shan-shui-inf');
L.onmouseover = () => rstyle('L', true);
L.onmouseout = () => rstyle('L', false);
L.onclick = () => xcroll(-200);
R.onmouseout = () => rstyle('R', false);
R.onclick = () => xcroll(200);
R.onmouseover = () => rstyle('R', true);

rstyle('L', false);
rstyle('R', false);

SET_BTN.onmouseover = () => {
  SET_BTN.style.backgroundColor = btnHoverCol;
};

SET_BTN.onmouseout = () => {
  SET_BTN.style.backgroundColor = 'rgba(0,0,0,0)';
};

SET_BTN.onclick = () => {
  toggleVisible('MENU');
  toggleText('SET_BTN.t', '&#x2630;', '&#x2715;');
};

function parseArgs(key2f) {
  const par = window.location.href.split('?')[1];
  if (par == undefined) {
    return;
  }
  par = par.split('&');
  for (let i = 0; i < par.length; i++) {
    var e = par[i].split('=');
    try {
      key2f[e[0]](e[1]);
    } catch (e) {
      console.log(e);
    }
  }
}

let SEED = '' + new Date().getTime();
parseArgs({
  seed: (x: string) => {
    SEED = x == '' ? SEED : x;
  },
});

// Math.seed(SEED);
// console.log(Prng.seed);

MEM.lasttick = new Date().getTime();
INP_SEED.value = SEED;
BG.setAttribute('style', 'width:' + MEM.windx + 'px');
update();
document.body.scrollTo(0, 0);
console.log(['SCROLLX', window.scrollX]);
present();
//draw();

window.addEventListener('scroll', () => {
  SETTING.style.left = `${Math.max(4, 40 - window.scrollX)}`;
  SOURCE_BTN.style.left = `${Math.max(41, 77 - window.scrollX)}`;
});

const canvas = document.getElementById('bgcanv') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const reso = 512;

for (let i = 0; i < reso / 2 + 1; i++) {
  for (let j = 0; j < reso / 2 + 1; j++) {
    let c = 245 + noise(i * 0.1, j * 0.1) * 10;
    c -= Math.random() * 20;

    const r = c.toFixed(0);
    const g = (c * 0.95).toFixed(0);
    const b = (c * 0.85).toFixed(0);
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.fillRect(i, j, 1, 1);
    ctx.fillRect(reso - i, j, 1, 1);
    ctx.fillRect(i, reso - j, 1, 1);
    ctx.fillRect(reso - i, reso - j, 1, 1);
  }
}

const img = canvas.toDataURL('image/png');
BG.style.backgroundImage = 'url(' + img + ')';
document.getElementsByTagName('body')[0].style.backgroundImage = 'url(' + img + ')';

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
let mouseX = 0;
let mouseY = 0;

function onMouseUpdate(e: MouseEvent) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function calcViewBox() {
  const zoom = 1.142;
  return '' + MEM.cursx + ' 0 ' + MEM.windx / zoom + ' ' + MEM.windy / zoom;
}

function viewupdate() {
  try {
    SVG.setAttribute('viewBox', calcViewBox());
  } catch (e) {
    console.log('not possible');
  }
  //setTimeout(viewupdate,100)
}

function needupdate() {
  return true;
  if (MEM.xmin < MEM.cursx && MEM.cursx < MEM.xmax - MEM.windx) {
    return false;
  }
  return true;
}

function update() {
  chunkloader(MEM.cursx, MEM.cursx + MEM.windx);
  chunkrender(MEM.cursx, MEM.cursx + MEM.windx);
  SVG.setAttribute('width', `${MEM.windx}`);
  SVG.setAttribute('height', `${MEM.windy}`);
  SVG.setAttribute('viewBox', `${calcViewBox()}`);

  GRUPO.innerHTML = MEM.canv;
  console.log(GRUPO);
}

function chunkrender(xmin, xmax) {
  MEM.canv = '';

  for (var i = 0; i < MEM.chunks.length; i++) {
    if (xmin - MEM.cwid < MEM.chunks[i].x && MEM.chunks[i].x < xmax + MEM.cwid) {
      MEM.canv += MEM.chunks[i].canv;
    }
  }
}

function chunkloader(xmin: number, xmax: number) {
  const add = (nch) => {
    if (nch.canv.includes('NaN')) {
      console.log('gotcha:');
      console.log(nch.tag);
      nch.canv = nch.canv.replace(/NaN/g, -1000);
    }
    if (MEM.chunks.length == 0) {
      MEM.chunks.push(nch);
      return;
    } else {
      if (nch.y <= MEM.chunks[0].y) {
        MEM.chunks.unshift(nch);
        return;
      } else if (nch.y >= MEM.chunks[MEM.chunks.length - 1].y) {
        MEM.chunks.push(nch);
        return;
      } else {
        for (var j = 0; j < MEM.chunks.length - 1; j++) {
          if (MEM.chunks[j].y <= nch.y && nch.y <= MEM.chunks[j + 1].y) {
            MEM.chunks.splice(j + 1, 0, nch);
            return;
          }
        }
      }
    }
    console.log('EH?WTF!');
    console.log(MEM.chunks);
    console.log(nch);
  };

  while (xmax > MEM.xmax - MEM.cwid || xmin < MEM.xmin + MEM.cwid) {
    console.log('generating new chunk...');

    let plan;

    if (xmax > MEM.xmax - MEM.cwid) {
      plan = mountplanner(MEM.xmax, MEM.xmax + MEM.cwid);
      MEM.xmax = MEM.xmax + MEM.cwid;
    } else {
      plan = mountplanner(MEM.xmin - MEM.cwid, MEM.xmin);
      MEM.xmin = MEM.xmin - MEM.cwid;
    }

    for (var i = 0; i < plan.length; i++) {
      if (plan[i].tag == 'mount') {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: mountain(plan[i].x, plan[i].y, i * 2 * Math.random()),
          //{col:function(x){return "rgba(100,100,100,"+(0.5*Math.random()*plan[i].y/MEM.windy)+")"}}),
        });
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y - 10000,
          canv: water(plan[i].x, plan[i].y, i * 2),
        });
      } else if (plan[i].tag == 'flatmount') {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: flatMount(plan[i].x, plan[i].y, 2 * Math.random() * Math.PI, {
            wid: 600 + Math.random() * 400,
            hei: 100,
            cho: 0.5 + Math.random() * 0.2,
          }),
        });
      } else if (plan[i].tag == 'distmount') {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: distMount(plan[i].x, plan[i].y, Math.random() * 100, {
            hei: 150,
            len: randChoice([500, 1000, 1500]),
          }),
        });
      } else if (plan[i].tag == 'boat') {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: boat01(plan[i].x, plan[i].y, Math.random(), {
            sca: plan[i].y / 800,
            fli: randChoice([true, false]),
          }),
        });
      } else if (plan[i].tag == 'redcirc') {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: "<circle cx='" + plan[i].x + "' cy='" + plan[i].y + "' r='20' stroke='black' fill='red' />",
        });
      } else if (plan[i].tag == 'greencirc') {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: "<circle cx='" + plan[i].x + "' cy='" + plan[i].y + "' r='20' stroke='black' fill='green' />",
        });
      }
      // add ({
      //   x: plan[i].x,
      //   y: plan[i].y,
      //   canv:"<circle cx='"+plan[i].x+"' cy='"+plan[i].y+"' r='20' stroke='black' fill='red' />"
      // })
    }
  }
}

export function mountplanner(xmin: number, xmax: number) {
  function locmax(x: number, y: number, f: (x: number, y: number) => number, r: number) {
    const z0 = f(x, y);

    if (z0 <= 0.3) return false;

    for (let i = x - r; i < x + r; i++) {
      for (let j = y - r; j < y + r; j++) {
        if (f(i, j) > z0) return false;
      }
    }
    return true;
  }

  function chadd(r: { x: number; y: number }, mind = 10) {
    for (let k = 0; k < reg.length; k++) {
      if (Math.abs(reg[k].x - r.x) < mind) {
        return false;
      }
    }
    console.log('+');
    reg.push(r);
    return true;
  }

  const reg: { x: number; y: number; tag: string }[] = [];
  const samp = 0.03;
  const ns = (x: number) => Math.max(noise(x * samp) - 0.55, 0) * 2;
  const nns = (x: number) => 1 - noise(x * samp);
  const nnns = (x: number, y: number) => Math.max(noise(x * samp * 2, 2) - 0.55, 0) * 2;
  const yr = (x: number) => noise(x * 0.01, Math.PI);
  const xstep = 5;
  const mwid = 200;
  for (let i = xmin; i < xmax; i += xstep) {
    const i1 = Math.floor(i / xstep);
    MEM.planmtx[i1] = MEM.planmtx[i1] || 0;
  }

  for (let i = xmin; i < xmax; i += xstep) {
    for (let j = 0; j < yr(i) * 480; j += 30) {
      if (locmax(i, j, ns, 2)) {
        const xof = i + 2 * (Math.random() - 0.5) * 500;
        const yof = j + 300;
        const r = { tag: 'mount', x: xof, y: yof, h: ns(i, j) };
        const res = chadd(r);
        if (res) {
          for (let k = Math.floor((xof - mwid) / xstep); k < (xof + mwid) / xstep; k++) {
            MEM.planmtx[k] += 1;
          }
        }
      }
    }

    if (Math.abs(i) % 1000 < Math.max(1, xstep - 1)) {
      const r = {
        tag: 'distmount',
        x: i,
        y: 280 - Math.random() * 50,
        h: ns(i),
      };
      chadd(r);
    }
  }
  console.log([xmin, xmax]);
  for (let i = xmin; i < xmax; i += xstep) {
    if (MEM.planmtx[Math.floor(i / xstep)] == 0) {
      //var r = {tag:"redcirc",x:i,y:700}
      //console.log(i)
      if (Math.random() < 0.01) {
        for (let j = 0; j < 4 * Math.random(); j++) {
          const r = {
            tag: 'flatmount',
            x: i + 2 * (Math.random() - 0.5) * 700,
            y: 700 - j * 50,
            h: ns(i),
          };
          chadd(r);
        }
      }
    } else {
      // var r = {tag:"greencirc",x:i,y:700}
      // chadd(r)
    }
  }

  for (let i = xmin; i < xmax; i += xstep) {
    if (Math.random() < 0.2) {
      const r = { tag: 'boat', x: i, y: 300 + Math.random() * 390 };
      chadd(r, 400);
    }
  }

  return reg;
}

function dummyloader(xmin: number, xmax: number) {
  for (var i = xmin; i < xmax; i += 200) {
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Tree.tree08(i,500,i)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Man.man(i,500)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.arch01(i,500)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.boat01(i,500)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.transmissionTower01(i,500)})
    MEM.chunks.push({
      tag: '?',
      x: i,
      y: 100,
      canv: arch02(i, 500, 0, { sto: 1, rot: Math.random() }),
    });
  }
}

function xcroll(v: number) {
  MEM.cursx += v;
  if (needupdate()) {
    update();
  } else {
    viewupdate();
  }
}

function autoxcroll(v) {
  const caja = document.querySelector<HTMLInputElement>('#AUTO_SCROLL');

  if (caja?.checked) {
    xcroll(v);
    setTimeout(function () {
      autoxcroll(v);
    }, 2000);
  }
}

function rstyle(id: string, b: boolean) {
  const a = b ? 0.1 : 0.0;

  document.getElementById(id)?.setAttribute(
    'style',
    '\
  width: 32px; \
  text-align: center;\
  top: 0px;\
  color:rgba(0,0,0,0.4);\
  display:table;\
  cursor: pointer;\
  border: 1px solid rgba(0,0,0,0.4);\
  background-color:rgba(0,0,0,' +
      a +
      ');\
' +
      'height:' +
      MEM.windy +
      'px'
  );

  document.getElementById(id + '.t')?.setAttribute(
    'style',
    'vertical-align:middle; display:table-cell'
    //"position:absolute; top:"+(MEM.windy/2-20)+"px; left:"+(MEM.windx+20)+"px;"
  );
}
