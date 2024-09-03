import type { ArgsMan, Punto } from '@/tipos';
import { CUARTO_PI, MEDIO_PI, PI, TRES_PI } from '@/utilidades/constantes';
import { div, stroke } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { bezmh, distance, normRand, poly } from '@/utilidades/Util';

const expand = (ptlist: Punto[], wfun: (x: number) => number): [Punto[], Punto[]] => {
  const vtxlist0: Punto[] = [];
  const vtxlist1: Punto[] = [];

  for (let i = 1; i < ptlist.length - 1; i++) {
    const w = wfun(i / ptlist.length);
    const [x1, y1] = ptlist[i];
    const [x2, y2] = ptlist[i - 1];
    const [x3, y3] = ptlist[i + 1];
    const a1 = Math.atan2(y1 - y2, x1 - x2);
    const a2 = Math.atan2(y1 - y3, x1 - x3);
    let a = (a1 + a2) / 2;
    if (a < a2) {
      a += PI;
    }
    vtxlist0.push([x1 + w * Math.cos(a), y1 + w * Math.sin(a)]);
    vtxlist1.push([x1 - w * Math.cos(a), y1 - w * Math.sin(a)]);
  }

  const ultimoI = ptlist.length - 1;
  const [x1, y1] = ptlist[0];
  const [x2, y2] = ptlist[1];
  const [x3, y3] = ptlist[ultimoI];
  const [x4, y4] = ptlist[ultimoI - 1];
  const a0 = Math.atan2(y2 - y1, x2 - x1) - MEDIO_PI;
  const a1 = Math.atan2(y3 - y4, x3 - x4) - MEDIO_PI;
  const w0 = wfun(0);
  const w1 = wfun(1);
  vtxlist0.unshift([x1 + w0 * Math.cos(a0), y1 + w0 * Math.sin(a0)]);
  vtxlist1.unshift([x1 - w0 * Math.cos(a0), y1 - w0 * Math.sin(a0)]);
  vtxlist0.push([x3 + w1 * Math.cos(a1), y3 + w1 * Math.sin(a1)]);
  vtxlist1.push([x3 - w1 * Math.cos(a1), y3 - w1 * Math.sin(a1)]);
  return [vtxlist0, vtxlist1];
};

const tranpoly = (p0: Punto, p1: Punto, ptlist: Punto[]): Punto[] => {
  const plist = ptlist.map((v): Punto => [-v[0], v[1]]);
  const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) - MEDIO_PI;
  const scl = distance(p0, p1);
  const qlist = plist.map((v): Punto => {
    const d = distance(v, [0, 0]);
    const a = Math.atan2(v[1], v[0]);
    return [p0[0] + d * scl * Math.cos(ang + a), p0[1] + d * scl * Math.sin(ang + a)];
  });
  return qlist;
};

const flipper = (plist: Punto[]) => plist.map((v): Punto => [-v[0], v[1]]);

function hat01(p0: Punto, p1: Punto, args?: { fli?: boolean }) {
  const predeterminados = { fli: false };
  const { fli } = { ...predeterminados, ...args };
  let svg = '';
  const seed = Math.random();
  const f = fli ? flipper : (x: Punto[]) => x;

  svg += poly(
    tranpoly(
      p0,
      p1,
      f([
        [-0.3, 0.5],
        [0.3, 0.8],
        [0.2, 1],
        [0, 1.1],
        [-0.3, 1.15],
        [-0.55, 1],
        [-0.65, 0.5],
      ])
    ),
    { fil: 'rgba(100,100,100,0.8)' }
  );

  const qlist1: Punto[] = [];

  for (let i = 0; i < 10; i++) {
    qlist1.push([-0.3 - noise(i * 0.2, seed) * i * 0.1, 0.5 - i * 0.3]);
  }

  svg += poly(tranpoly(p0, p1, f(qlist1)), {
    str: 'rgba(100,100,100,0.8)',
    ancho: 1,
  });

  return svg;
}

export function hat02(p0: Punto, p1: Punto, args) {
  var args = args != undefined ? args : {};
  var fli = args.fli != undefined ? args.fli : false;
  let svg = '';
  const f = fli ? flipper : (x: Punto[]) => x;

  svg += poly(
    tranpoly(
      p0,
      p1,
      f([
        [-0.3, 0.5],
        [-1.1, 0.5],
        [-1.2, 0.6],
        [-1.1, 0.7],
        [-0.3, 0.8],
        [0.3, 0.8],
        [1.0, 0.7],
        [1.3, 0.6],
        [1.2, 0.5],
        [0.3, 0.5],
      ])
    ),
    { fil: 'rgba(100,100,100,0.8)' }
  );
  return svg;
}

export function stick01(p0: Punto, p1: Punto, args?: { invertir: boolean }) {
  const predeterminados = { invertir: false };
  const { invertir } = { ...predeterminados, ...args };

  let svg = '';
  const semilla = Math.random();
  const f = invertir ? flipper : (x: Punto[]) => x;

  var qlist1: Punto[] = [];
  var l = 12;
  for (var i = 0; i < l; i++) {
    qlist1.push([-noise(i * 0.1, semilla) * 0.1 * Math.sin((i / l) * PI) * 5, 0 + i * 0.3]);
  }
  svg += poly(tranpoly(p0, p1, f(qlist1)), {
    str: 'rgba(100,100,100,0.5)',
    ancho: 1,
  });

  return svg;
}

//      2
//    1/
// 7/  | \_ 6
// 8| 0 \ 5
//      /3
//     4

export function man(x: number, y: number, args?: ArgsMan) {
  const predeterminados = {
    sca: 0.5,
    hat: hat01,
    ite: () => '',
    fli: true,
    ang: [
      0,
      -MEDIO_PI,
      normRand(0, 0),
      CUARTO_PI * Math.random(),
      (TRES_PI / 4) * Math.random(),
      TRES_PI / 4,
      -CUARTO_PI,
      -TRES_PI / 4 - CUARTO_PI * Math.random(),
      -CUARTO_PI,
    ],
    len: [0, 30, 20, 30, 30, 30, 30, 30, 30],
  };

  const { sca, hat, ite, fli, ang, len } = { ...predeterminados, ...args };

  const _len = len.map((v: number) => v * sca);
  let svg = '';
  const sct = {
    0: { 1: { 2: {}, 5: { 6: {} }, 7: { 8: {} } }, 3: { 4: {} } },
  };
  const toGlobal = (v: Punto): Punto => [(fli ? -1 : 1) * v[0] + x, v[1] + y];
  type Sct = {
    0: {
      1: {
        2: {};
        5: {
          6: {};
        };
        7: {
          8: {};
        };
      };
      3: {
        4: {};
      };
    };
  };

  function gpar(sct: Sct, ind: number) {
    const keys = Object.keys(sct).map((x) => +x);

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == ind) {
        return [ind];
      } else {
        const r = gpar(sct[keys[i]], ind);
        if (r != false) return [keys[i]].concat(r);
      }
    }
    return false;
  }

  function grot(sct: Sct, ind: number) {
    const par = gpar(sct, ind);
    let rot = 0;
    for (let i = 0; i < par.length; i++) {
      rot += ang[par[i]];
    }
    return rot;
  }

  function gpos(sct: Sct, ind: number) {
    const par = gpar(sct, ind);
    const pos: Punto = [0, 0];
    for (let i = 0; i < par.length; i++) {
      const a = grot(sct, par[i]);
      pos[0] += _len[par[i]] * Math.cos(a);
      pos[1] += _len[par[i]] * Math.sin(a);
    }
    return pos;
  }

  const pts: Punto[] = [];

  for (let i = 0; i < ang.length; i++) {
    pts.push(gpos(sct, i));
  }

  y -= pts[4][1];

  for (let i = 1; i < pts.length; i++) {
    const par = gpar(sct, i);
    const p0 = gpos(sct, par[par.length - 2]);
    const s = div([p0, pts[i]], 10);
    svg += stroke(s.map(toGlobal));
  }

  const cloth = (plist: Punto[], fun: (x: number) => number) => {
    let svg = '';
    const tlist = bezmh(plist, 2);
    const [tlist1, tlist2] = expand(tlist, fun);
    svg += poly(tlist1.concat(tlist2.reverse()).map(toGlobal), {
      fil: 'white',
    });
    svg += stroke(tlist1.map(toGlobal), {
      ancho: 1,
      color: 'rgba(100,100,100,0.5)',
    });
    svg += stroke(tlist2.map(toGlobal), {
      ancho: 1,
      color: 'rgba(100,100,100,0.6)',
    });

    return svg;
  };

  const fsleeve = (x: number) => sca * 8 * (Math.sin(0.5 * x * PI) * Math.pow(Math.sin(x * PI), 0.1) + (1 - x) * 0.4);
  const fbody = (x: number) => sca * 11 * (Math.sin(0.5 * x * PI) * Math.pow(Math.sin(x * PI), 0.1) + (1 - x) * 0.5);
  const fhead = (x: number) => sca * 7 * Math.pow(0.25 - Math.pow(x - 0.5, 2), 0.3);

  svg += ite(toGlobal(pts[8]), toGlobal(pts[6]), { invertir: fli });

  svg += cloth([pts[1], pts[7], pts[8]], fsleeve);

  svg += cloth([pts[1], pts[0], pts[3], pts[4]], fbody);

  svg += cloth([pts[1], pts[5], pts[6]], fsleeve);
  svg += cloth([pts[1], pts[2]], fhead);

  const hlist = bezmh([pts[1], pts[2]], 2);
  const [hlist1, hlist2] = expand(hlist, fhead);
  hlist1.splice(0, Math.floor(hlist1.length * 0.1));
  hlist2.splice(0, Math.floor(hlist2.length * 0.95));
  svg += poly(hlist1.concat(hlist2.reverse()).map(toGlobal), {
    fil: 'rgba(100,100,100,0.6)',
  });

  svg += hat(toGlobal(pts[1]), toGlobal(pts[2]), { fli: fli });

  return svg;
}
