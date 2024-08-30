import { invertir } from '@/utilidades/ayudas';
import type { Punto } from '@/tipos';
import { div, stroke } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { centro } from '@/utilidades/Polytools';
import { normRand, poly, randChoice } from '@/utilidades/Util';
import caja from '@/componentes/caja';
import chozaTecho from '@/componentes/chozaTecho';
import { man } from '@/componentes/Man';

var deco = function (style, args) {
  var args = args != undefined ? args : {};
  var pul = args.pul != undefined ? args.pul : [0, 0];
  var pur = args.pur != undefined ? args.pur : [0, 100];
  var pdl = args.pdl != undefined ? args.pdl : [100, 0];
  var pdr = args.pdr != undefined ? args.pdr : [100, 100];
  var hsp = args.hsp != undefined ? args.hsp : [1, 3];
  var vsp = args.vsp != undefined ? args.vsp : [1, 2];

  var plist = [];
  var dl = div([pul, pdl], vsp[1]);
  var dr = div([pur, pdr], vsp[1]);
  var du = div([pul, pur], hsp[1]);
  var dd = div([pdl, pdr], hsp[1]);

  if (style == 1) {
    //-| |-
    var mlu = du[hsp[0]];
    var mru = du[du.length - 1 - hsp[0]];
    var mld = dd[hsp[0]];
    var mrd = dd[du.length - 1 - hsp[0]];

    for (var i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
      var mml = div([mlu, mld], vsp[1])[i];
      var mmr = div([mru, mrd], vsp[1])[i];
      var ml = dl[i];
      var mr = dr[i];
      plist.push(div([mml, ml], 5));
      plist.push(div([mmr, mr], 5));
    }
    plist.push(div([mlu, mld], 5));
    plist.push(div([mru, mrd], 5));
  } else if (style == 2) {
    //||||

    for (var i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
      var mu = du[i];
      var md = dd[i];
      plist.push(div([mu, md], 5));
    }
  } else if (style == 3) {
    //|##|
    var mlu = du[hsp[0]];
    var mru = du[du.length - 1 - hsp[0]];
    var mld = dd[hsp[0]];
    var mrd = dd[du.length - 1 - hsp[0]];

    for (var i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
      var mml = div([mlu, mld], vsp[1])[i];
      var mmr = div([mru, mrd], vsp[1])[i];
      var mmu = div([mlu, mru], vsp[1])[i];
      var mmd = div([mld, mrd], vsp[1])[i];

      var ml = dl[i];
      var mr = dr[i];
      plist.push(div([mml, mmr], 5));
      plist.push(div([mmu, mmd], 5));
    }
    plist.push(div([mlu, mld], 5));
    plist.push(div([mru, mrd], 5));
  }
  return plist;
};

var rail = function (xoff, yoff, seed, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 20;
  var ancho = args.ancho != undefined ? args.ancho : 180;
  var rot = args.rot != undefined ? args.rot : 0.7;
  var per = args.per != undefined ? args.per : 4;
  var seg = args.seg != undefined ? args.seg : 4;
  var wei = args.wei != undefined ? args.wei : 1;
  var tra = args.tra != undefined ? args.tra : true;
  var fro = args.fro != undefined ? args.fro : true;

  seed = seed != undefined ? seed : 0;

  var mid = -ancho * 0.5 + ancho * rot;
  var bmid = -ancho * 0.5 + ancho * (1 - rot);
  var ptlist = [];

  if (fro) {
    ptlist.push(
      div(
        [
          [-ancho * 0.5, 0],
          [mid, per],
        ],
        seg
      )
    );
    ptlist.push(
      div(
        [
          [mid, per],
          [ancho * 0.5, 0],
        ],
        seg
      )
    );
  }
  if (tra) {
    ptlist.push(
      div(
        [
          [-ancho * 0.5, 0],
          [bmid, -per],
        ],
        seg
      )
    );
    ptlist.push(
      div(
        [
          [bmid, -per],
          [ancho * 0.5, 0],
        ],
        seg
      )
    );
  }
  if (fro) {
    ptlist.push(
      div(
        [
          [-ancho * 0.5, -alto],
          [mid, -alto + per],
        ],
        seg
      )
    );
    ptlist.push(
      div(
        [
          [mid, -alto + per],
          [ancho * 0.5, -alto],
        ],
        seg
      )
    );
  }
  if (tra) {
    ptlist.push(
      div(
        [
          [-ancho * 0.5, -alto],
          [bmid, -alto - per],
        ],
        seg
      )
    );
    ptlist.push(
      div(
        [
          [bmid, -alto - per],
          [ancho * 0.5, -alto],
        ],
        seg
      )
    );
  }
  if (tra) {
    var open = Math.floor(Math.random() * ptlist.length);
    ptlist[open] = ptlist[open].slice(0, -1);
    ptlist[(open + ptlist.length) % ptlist.length] = ptlist[(open + ptlist.length) % ptlist.length].slice(0, -1);
  }
  var canv = '';

  for (var i = 0; i < ptlist.length / 2; i++) {
    for (var j = 0; j < ptlist[i].length; j++) {
      //ptlist.push(div([ptlist[i][j],ptlist[4+i][j]],2))
      ptlist[i][j][1] += (noise(i, j * 0.5, seed) - 0.5) * alto;
      ptlist[(ptlist.length / 2 + i) % ptlist.length][j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length][1] +=
        (noise(i + 0.5, j * 0.5, seed) - 0.5) * alto;
      var ln = div(
        [
          ptlist[i][j],
          ptlist[(ptlist.length / 2 + i) % ptlist.length][j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length],
        ],
        2
      );
      ln[0][0] += (Math.random() - 0.5) * alto * 0.5;
      canv += poly(ln, {
        x: xoff,
        y: yoff,
        fil: 'none',
        str: 'rgba(100,100,100,0.5)',
        ancho: 2,
      });
    }
  }

  for (let i = 0; i < ptlist.length; i++) {
    canv += stroke(
      ptlist[i].map((x) => [x[0] + xoff, x[1] + yoff]),
      {
        col: 'rgba(100,100,100,0.5)',
        noi: 0.5,
        ancho: wei,
        fun: (x: number) => 1,
      }
    );
  }
  return canv;
};

var roof = function (xoff, yoff, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 20;
  var ancho = args.ancho != undefined ? args.ancho : 120;
  var rot = args.rot != undefined ? args.rot : 0.7;
  var per = args.per != undefined ? args.per : 4;
  var cor = args.cor != undefined ? args.cor : 5;
  var wei = args.wei != undefined ? args.wei : 3;
  var pla = args.pla != undefined ? args.pla : [0, ''];

  const opf = (puntos: Punto[]) => (rot < 0.5 ? invertir(puntos) : puntos);

  var rrot = rot < 0.5 ? 1 - rot : rot;

  var mid = -ancho * 0.5 + ancho * rrot;
  var bmid = -ancho * 0.5 + ancho * (1 - rrot);
  var quat = (mid + ancho * 0.5) * 0.5 - mid;

  var ptlist = [];
  ptlist.push(
    div(
      opf([
        [-ancho * 0.5 + quat, -alto - per / 2],
        [-ancho * 0.5 + quat * 0.5, -alto / 2 - per / 4],
        [-ancho * 0.5 - cor, 0],
      ]),
      5
    )
  );
  ptlist.push(
    div(
      opf([
        [mid + quat, -alto],
        [(mid + quat + ancho * 0.5) / 2, -alto / 2],
        [ancho * 0.5 + cor, 0],
      ]),
      5
    )
  );
  ptlist.push(
    div(
      opf([
        [mid + quat, -alto],
        [mid + quat / 2, -alto / 2 + per / 2],
        [mid + cor, per],
      ]),
      5
    )
  );

  ptlist.push(
    div(
      opf([
        [-ancho * 0.5 - cor, 0],
        [mid + cor, per],
      ]),
      5
    )
  );
  ptlist.push(
    div(
      opf([
        [ancho * 0.5 + cor, 0],
        [mid + cor, per],
      ]),
      5
    )
  );

  ptlist.push(
    div(
      opf([
        [-ancho * 0.5 + quat, -alto - per / 2],
        [mid + quat, -alto],
      ]),
      5
    )
  );

  var canv = '';

  const polist = opf([
    [-ancho * 0.5, 0],
    [-ancho * 0.5 + quat, -alto - per / 2],
    [mid + quat, -alto],
    [ancho * 0.5, 0],
    [mid, per],
  ]);
  canv += poly(polist, { x: xoff, y: yoff, str: 'none', fil: 'white' });

  for (let i = 0; i < ptlist.length; i++) {
    canv += stroke(
      ptlist[i].map((x) => [x[0] + xoff, x[1] + yoff]),
      {
        col: 'rgba(100,100,100,0.4)',
        noi: 1,
        ancho: wei,
        fun: () => 1,
      }
    );
  }

  if (pla[0] == 1) {
    let pp: Punto[] = opf([
      [mid + quat / 2, -alto / 2 + per / 2],
      [-ancho * 0.5 + quat * 0.5, -alto / 2 - per / 4],
    ]);

    if (pp[0][0] > pp[1][0]) {
      pp = [pp[1], pp[0]];
    }

    const mp = centro(pp);
    const a = Math.atan2(pp[1][1] - pp[0][1], pp[1][0] - pp[0][0]);
    const adeg = (a * 180) / Math.PI;
    canv += `<text font-size='${alto * 0.6}' font-family='Verdana' style='fill:rgba(100,100,100,0.9)' text-anchor='middle' transform='translate(${mp[0] + xoff},${mp[1] + yoff}) rotate(${adeg})'>${pla[1]}</text>`;
  }

  return canv;
};

var pagroof = function (xoff, yoff, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 20;
  var ancho = args.ancho != undefined ? args.ancho : 120;
  var per = args.per != undefined ? args.per : 4;
  var cor = args.cor != undefined ? args.cor : 10;
  var sid = args.sid != undefined ? args.sid : 4;
  var wei = args.wei != undefined ? args.wei : 3;

  var ptlist: Punto[][] = [];
  var polist: Punto[] = [[0, -alto]];
  var canv = '';
  for (var i = 0; i < sid; i++) {
    var fx = ancho * ((i * 1.0) / (sid - 1) - 0.5);
    var fy = per * (1 - Math.abs((i * 1.0) / (sid - 1) - 0.5) * 2);
    var fxx = (ancho + cor) * ((i * 1.0) / (sid - 1) - 0.5);
    if (i > 0) {
      ptlist.push([ptlist[ptlist.length - 1][2], [fxx, fy]]);
    }
    ptlist.push([
      [0, -alto],
      [fx * 0.5, (-alto + fy) * 0.5],
      [fxx, fy],
    ]);
    polist.push([fxx, fy]);
  }

  canv += poly(polist, { x: xoff, y: yoff, str: 'none', fil: 'white' });
  for (let i = 0; i < ptlist.length; i++) {
    canv += stroke(
      div(ptlist[i], 5).map((x) => [x[0] + xoff, x[1] + yoff]),
      {
        col: 'rgba(100,100,100,0.4)',
        noi: 1,
        ancho: wei,
        fun: () => 1,
      }
    );
  }

  return canv;
};

export function arch01(xoff: number, yoff: number, seed = 0, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 70;
  var ancho = args.ancho != undefined ? args.ancho : 180;
  var per = args.per != undefined ? args.per : 5;

  seed = seed != undefined ? seed : 0;

  var p = 0.4 + Math.random() * 0.2;
  var h0 = alto * p;
  var h1 = alto * (1 - p);

  var canv = '';

  canv += chozaTecho(xoff, yoff - alto, { alto: h0, ancho: ancho });

  canv += caja(xoff, yoff, {
    alto: h1,
    ancho: (ancho * 2) / 3,
    per: per,
    bot: false,
  });

  canv += rail(xoff, yoff, seed, {
    tra: true,
    fro: false,
    alto: 10,
    ancho: ancho,
    per: per * 2,
    seg: (3 + Math.random() * 3) | 0,
  });

  var mcnt = randChoice([0, 1, 1, 2]);

  if (mcnt == 1) {
    canv += man(xoff + normRand(-ancho / 3, ancho / 3), yoff, {
      fli: randChoice([true, false]),
      sca: 0.42,
    });
  } else if (mcnt == 2) {
    canv += man(xoff + normRand(-ancho / 4, -ancho / 5), yoff, {
      fli: false,
      sca: 0.42,
    });
    canv += man(xoff + normRand(ancho / 5, ancho / 4), yoff, {
      fli: true,
      sca: 0.42,
    });
  }
  canv += rail(xoff, yoff, seed, {
    tra: false,
    fro: true,
    alto: 10,
    ancho: ancho,
    per: per * 2,
    seg: (3 + Math.random() * 3) | 0,
  });

  return canv;
}

export function arch02(xoff, yoff, seed, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 10;
  var ancho = args.ancho != undefined ? args.ancho : 50;
  var rot = args.rot != undefined ? args.rot : 0.3;
  var per = args.per != undefined ? args.per : 5;
  var sto = args.sto != undefined ? args.sto : 3;
  var sty = args.sty != undefined ? args.sty : 1;
  var rai = args.rai != undefined ? args.rai : false;

  seed = seed != undefined ? seed : 0;
  var canv = '';

  var hoff = 0;
  for (var i = 0; i < sto; i++) {
    canv += caja(xoff, yoff - hoff, {
      tra: false,
      alto: alto,
      ancho: ancho * Math.pow(0.85, i),
      rot: rot,
      wei: 1.5,
      per: per,
      dec: (a: number) => {
        return deco(
          sty,
          Object.assign({}, a, {
            hsp: [[], [1, 5], [1, 5], [1, 4]][sty],
            vsp: [[], [1, 2], [1, 2], [1, 3]][sty],
          })
        );
      },
    });
    canv += rai
      ? rail(xoff, yoff - hoff, i * 0.2, {
          ancho: ancho * Math.pow(0.85, i) * 1.1,
          alto: alto / 2,
          per: per,
          rot: rot,
          wei: 0.5,
          tra: false,
        })
      : [];
    var pla = undefined;
    if (sto == 1 && Math.random() < 1 / 3) {
      pla = [1, 'Pizza Hut'];
    }
    canv += roof(xoff, yoff - hoff - alto, {
      alto: alto,
      ancho: ancho * Math.pow(0.9, i),
      rot: rot,
      wei: 1.5,
      per: per,
      pla: pla,
    });

    hoff += alto * 1.5;
  }
  return canv;
}

export function arch03(xoff, yoff, seed, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 10;
  var ancho = args.ancho != undefined ? args.ancho : 50;
  var rot = args.rot != undefined ? args.rot : 0.7;
  var per = args.per != undefined ? args.per : 5;
  var sto = args.sto != undefined ? args.sto : 7;

  seed = seed != undefined ? seed : 0;
  var canv = '';

  var hoff = 0;
  for (var i = 0; i < sto; i++) {
    canv += caja(xoff, yoff - hoff, {
      tra: false,
      alto: alto,
      ancho: ancho * Math.pow(0.85, i),
      rot: rot,
      wei: 1.5,
      per: per / 2,
      dec: (a) => {
        return deco(1, Object.assign({}, a, { hsp: [1, 4], vsp: [1, 2] }));
      },
    });
    canv += rail(xoff, yoff - hoff, i * 0.2, {
      seg: 5,
      ancho: ancho * Math.pow(0.85, i) * 1.1,
      alto: alto / 2,
      per: per / 2,
      rot: rot,
      wei: 0.5,
      tra: false,
    });
    canv += pagroof(xoff, yoff - hoff - alto, {
      alto: alto * 1.5,
      ancho: ancho * Math.pow(0.9, i),
      rot: rot,
      wei: 1.5,
      per: per,
    });
    hoff += alto * 1.5;
  }
  return canv;
}

export function arch04(xoff: number, yoff: number, seed = 0, args) {
  var args = args != undefined ? args : {};
  var alto = args.alto != undefined ? args.alto : 15;
  var ancho = args.ancho != undefined ? args.ancho : 30;
  var rot = args.rot != undefined ? args.rot : 0.7;
  var per = args.per != undefined ? args.per : 5;
  var sto = args.sto != undefined ? args.sto : 2;

  var canv = '';

  var hoff = 0;
  for (var i = 0; i < sto; i++) {
    canv += caja(xoff, yoff - hoff, {
      tra: true,
      alto: alto,
      ancho: ancho * Math.pow(0.85, i),
      rot: rot,
      wei: 1.5,
      per: per / 2,
      dec: () => [],
    });
    canv += rail(xoff, yoff - hoff, i * 0.2, {
      seg: 3,
      ancho: ancho * Math.pow(0.85, i) * 1.2,
      alto: alto / 3,
      per: per / 2,
      rot: rot,
      wei: 0.5,
      tra: true,
    });
    canv += pagroof(xoff, yoff - hoff - alto, {
      alto: alto * 1,
      ancho: ancho * Math.pow(0.9, i),
      rot: rot,
      wei: 1.5,
      per: per,
    });
    hoff += alto * 1.2;
  }
  return canv;
}
