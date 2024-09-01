import { invertir } from '@/utilidades/ayudas';
import type { ArgsArco, ArgsDeco, ArgsPagRoof, ArgsRail, ArgsTecho, OpcionesDeco, Punto } from '@/tipos';
import { div, stroke } from '@/utilidades/cosas';
import { noise } from '@/utilidades/Perlin';
import { buscarCentro } from '@/utilidades/Polytools';
import { normRand, poly, randChoice } from '@/utilidades/Util';
import caja from '@/componentes/caja';
import chozaTecho from '@/componentes/chozaTecho';
import { man } from '@/componentes/Man';
import { PI } from '@/utilidades/constantes';

const deco = (estilo: number, args?: ArgsDeco) => {
  const predeterminados: OpcionesDeco = {
    pul: [0, 0],
    pur: [0, 100],
    pdl: [100, 0],
    pdr: [100, 100],
    hsp: [1, 3],
    vsp: [1, 2],
  };
  const { pul, pur, pdl, pdr, hsp, vsp } = { ...predeterminados, ...args };

  const puntos = [];
  const dl = div([pul, pdl], vsp[1]);
  const dr = div([pur, pdr], vsp[1]);
  const du = div([pul, pur], hsp[1]);
  const dd = div([pdl, pdr], hsp[1]);

  if (estilo == 1) {
    //-| |-
    const mlu = du[hsp[0]];
    const mru = du[du.length - 1 - hsp[0]];
    const mld = dd[hsp[0]];
    const mrd = dd[du.length - 1 - hsp[0]];

    for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
      const mml = div([mlu, mld], vsp[1])[i];
      const mmr = div([mru, mrd], vsp[1])[i];
      const ml = dl[i];
      const mr = dr[i];
      puntos.push(div([mml, ml], 5));
      puntos.push(div([mmr, mr], 5));
    }
    puntos.push(div([mlu, mld], 5));
    puntos.push(div([mru, mrd], 5));
  } else if (estilo == 2) {
    //||||

    for (let i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
      const mu = du[i];
      const md = dd[i];
      puntos.push(div([mu, md], 5));
    }
  } else if (estilo == 3) {
    //|##|
    const mlu = du[hsp[0]];
    const mru = du[du.length - 1 - hsp[0]];
    const mld = dd[hsp[0]];
    const mrd = dd[du.length - 1 - hsp[0]];

    for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
      const mml = div([mlu, mld], vsp[1])[i];
      const mmr = div([mru, mrd], vsp[1])[i];
      const mmu = div([mlu, mru], vsp[1])[i];
      const mmd = div([mld, mrd], vsp[1])[i];

      puntos.push(div([mml, mmr], 5));
      puntos.push(div([mmu, mmd], 5));
    }
    puntos.push(div([mlu, mld], 5));
    puntos.push(div([mru, mrd], 5));
  }
  return puntos;
};

const rail = (x: number, y: number, seed = 0, args?: ArgsRail) => {
  const predeterminados = {
    alto: 20,
    ancho: 180,
    rot: 0.7,
    per: 4,
    seg: 4,
    wei: 1,
    tra: true,
    fro: true,
  };

  const { alto, ancho, rot, per, seg, wei, tra, fro } = { ...predeterminados, ...args };
  const centro = ancho * 0.5;
  const mid = -centro + ancho * rot;
  const bmid = -centro + ancho * (1 - rot);
  const ptlist = [];

  if (fro) {
    const a: Punto = [mid, per];
    ptlist.push(div([[-centro, 0], a], seg));
    ptlist.push(div([a, [centro, 0]], seg));
  }

  if (tra) {
    const a: Punto = [bmid, -per];
    ptlist.push(div([[-centro, 0], a], seg));
    ptlist.push(div([a, [centro, 0]], seg));
  }

  if (fro) {
    const a: Punto = [mid, -alto + per];
    ptlist.push(div([[-centro, -alto], a], seg));
    ptlist.push(div([a, [centro, -alto]], seg));
  }

  if (tra) {
    const a: Punto = [bmid, -alto - per];
    ptlist.push(div([[-centro, -alto], a], seg));
    ptlist.push(div([a, [centro, -alto]], seg));
  }

  if (tra) {
    const open = Math.floor(Math.random() * ptlist.length);
    ptlist[open] = ptlist[open].slice(0, -1);
    ptlist[(open + ptlist.length) % ptlist.length] = ptlist[(open + ptlist.length) % ptlist.length].slice(0, -1);
  }

  let svg = '';

  for (let i = 0; i < ptlist.length / 2; i++) {
    for (let j = 0; j < ptlist[i].length; j++) {
      ptlist[i][j][1] += (noise(i, j * 0.5, seed) - 0.5) * alto;
      ptlist[(ptlist.length / 2 + i) % ptlist.length][j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length][1] +=
        (noise(i + 0.5, j * 0.5, seed) - 0.5) * alto;
      const ln = div(
        [
          ptlist[i][j],
          ptlist[(ptlist.length / 2 + i) % ptlist.length][j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length],
        ],
        2
      );
      ln[0][0] += (Math.random() - 0.5) * alto * 0.5;
      svg += poly(ln, {
        x,
        y,
        fil: 'none',
        str: 'rgba(100,100,100,0.5)',
        ancho: 2,
      });
    }
  }

  for (let i = 0; i < ptlist.length; i++) {
    svg += stroke(
      ptlist[i].map((p) => [p[0] + x, p[1] + y]),
      {
        col: 'rgba(100,100,100,0.5)',
        noi: 0.5,
        ancho: wei,
        fun: () => 1,
      }
    );
  }

  return svg;
};

const techo = (x: number, y: number, args: ArgsTecho) => {
  const predeterminados = {
    alto: 20,
    ancho: 120,
    rot: 0.7,
    per: 4,
    cor: 5,
    wei: 3,
    pla: [0, ''],
  };

  const { alto, ancho, rot, per, cor, wei, pla } = { ...predeterminados, ...args };
  const opf = (puntos: Punto[]) => (rot < 0.5 ? invertir<Punto[]>(puntos) : puntos);
  const centro = ancho * 0.5;
  const rrot = rot < 0.5 ? 1 - rot : rot;
  const mid = -centro + ancho * rrot;
  const quat = (mid + centro) * 0.5 - mid;
  const puntos = [];

  puntos.push(
    div(
      opf([
        [-centro + quat, -alto - per / 2],
        [-centro + quat * 0.5, -alto / 2 - per / 4],
        [-centro - cor, 0],
      ]),
      5
    )
  );

  puntos.push(
    div(
      opf([
        [mid + quat, -alto],
        [(mid + quat + centro) / 2, -alto / 2],
        [centro + cor, 0],
      ]),
      5
    )
  );

  puntos.push(
    div(
      opf([
        [mid + quat, -alto],
        [mid + quat / 2, -alto / 2 + per / 2],
        [mid + cor, per],
      ]),
      5
    )
  );

  puntos.push(
    div(
      opf([
        [-centro - cor, 0],
        [mid + cor, per],
      ]),
      5
    )
  );

  puntos.push(
    div(
      opf([
        [centro + cor, 0],
        [mid + cor, per],
      ]),
      5
    )
  );

  puntos.push(
    div(
      opf([
        [-centro + quat, -alto - per / 2],
        [mid + quat, -alto],
      ]),
      5
    )
  );

  const polist = opf([
    [-centro, 0],
    [-centro + quat, -alto - per / 2],
    [mid + quat, -alto],
    [centro, 0],
    [mid, per],
  ]);

  let svg = poly(polist, { x, y, str: 'none', fil: 'white' });

  for (let i = 0; i < puntos.length; i++) {
    svg += stroke(
      puntos[i].map((p) => [p[0] + x, p[1] + y]),
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
      [-centro + quat * 0.5, -alto / 2 - per / 4],
    ]);

    if (pp[0][0] > pp[1][0]) {
      pp = [pp[1], pp[0]];
    }

    const mp = buscarCentro(pp);
    const a = Math.atan2(pp[1][1] - pp[0][1], pp[1][0] - pp[0][0]);
    const grados = (a * 180) / PI;
    svg += `<text font-size='${alto * 0.6}' font-family='Verdana' style='fill:rgba(100,100,100,0.9)' text-anchor='middle' `;
    svg += `transform='translate(${mp[0] + x},${mp[1] + y}) rotate(${grados})'>${pla[1]}</text>`;
  }

  return svg;
};

const pagroof = (x: number, y: number, args?: ArgsPagRoof) => {
  const predeterminados = {
    alto: 20,
    ancho: 120,
    per: 4,
    cor: 10,
    sid: 4,
    wei: 3,
  };

  const { alto, ancho, per, cor, sid, wei } = { ...predeterminados, ...args };

  const puntos: Punto[][] = [];
  const polist: Punto[] = [[0, -alto]];

  for (let i = 0; i < sid; i++) {
    const fx = ancho * ((i * 1.0) / (sid - 1) - 0.5);
    const fy = per * (1 - Math.abs((i * 1.0) / (sid - 1) - 0.5) * 2);
    const fxx = (ancho + cor) * ((i * 1.0) / (sid - 1) - 0.5);

    if (i > 0) {
      puntos.push([puntos[puntos.length - 1][2], [fxx, fy]]);
    }

    puntos.push([
      [0, -alto],
      [fx * 0.5, (-alto + fy) * 0.5],
      [fxx, fy],
    ]);

    polist.push([fxx, fy]);
  }

  let svg = poly(polist, { x, y, str: 'none', fil: 'white' });

  for (let i = 0; i < puntos.length; i++) {
    svg += stroke(
      div(puntos[i], 5).map((p) => [p[0] + x, p[1] + y]),
      {
        col: 'rgba(100,100,100,0.4)',
        noi: 1,
        ancho: wei,
        fun: () => 1,
      }
    );
  }

  return svg;
};

export function arch01(x: number, y: number, seed = 0, args?: ArgsArco) {
  const predeterminados = { alto: 70, ancho: 180, per: 5 };
  const { alto, ancho, per } = { ...predeterminados, ...args };
  const p = 0.4 + Math.random() * 0.2;
  const h0 = alto * p;
  const h1 = alto * (1 - p);
  let svg = chozaTecho(x, y - alto, { alto: h0, ancho: ancho });

  svg += caja(x, y, {
    alto: h1,
    ancho: (ancho * 2) / 3,
    per: per,
    bot: false,
  });

  svg += rail(x, y, seed, {
    tra: true,
    fro: false,
    alto: 10,
    ancho,
    per: per * 2,
    seg: (3 + Math.random() * 3) | 0,
  });

  const mcnt = randChoice<number>([0, 1, 1, 2]);

  if (mcnt == 1) {
    svg += man(x + normRand(-ancho / 3, ancho / 3), y, {
      fli: randChoice([true, false]),
      sca: 0.42,
    });
  } else if (mcnt == 2) {
    svg += man(x + normRand(-ancho / 4, -ancho / 5), y, {
      fli: false,
      sca: 0.42,
    });
    svg += man(x + normRand(ancho / 5, ancho / 4), y, {
      fli: true,
      sca: 0.42,
    });
  }

  svg += rail(x, y, seed, {
    tra: false,
    fro: true,
    alto: 10,
    ancho: ancho,
    per: per * 2,
    seg: (3 + Math.random() * 3) | 0,
  });

  return svg;
}

export function arch02(x: number, y: number, seed = 0, args?: ArgsArco) {
  const predeterminados = {
    alto: 10,
    ancho: 50,
    rot: 0.3,
    per: 5,
    sto: 3,
    sty: 1,
    rai: false,
  };

  const { alto, ancho, rot, per, sto, sty, rai } = { ...predeterminados, ...args };
  let svg = '';
  let hoff = 0;

  for (let i = 0; i < sto; i++) {
    svg += caja(x, y - hoff, {
      tra: false,
      alto: alto,
      ancho: ancho * Math.pow(0.85, i),
      rot: rot,
      wei: 1.5,
      per: per,
      dec: (opciones) => {
        const argumentos: ArgsDeco = Object.assign({}, opciones, {
          hsp: [[], [1, 5], [1, 5], [1, 4]][sty],
          vsp: [[], [1, 2], [1, 2], [1, 3]][sty],
        });

        return deco(sty, argumentos);
      },
    });

    svg += rai
      ? rail(x, y - hoff, i * 0.2, {
          ancho: ancho * Math.pow(0.85, i) * 1.1,
          alto: alto / 2,
          per: per,
          rot: rot,
          wei: 0.5,
          tra: false,
        })
      : [];

    svg += techo(x, y - hoff - alto, {
      alto: alto,
      ancho: ancho * Math.pow(0.9, i),
      rot: rot,
      wei: 1.5,
      per: per,
    });

    hoff += alto * 1.5;
  }

  return svg;
}

export function arch03(x: number, y: number, seed = 0, args?: ArgsArco) {
  const predeterminados = { alto: 10, ancho: 50, rot: 0.7, per: 5, sto: 7 };
  const { alto, ancho, rot, per, sto } = { ...predeterminados, ...args };
  let svg = '';
  let hoff = 0;

  for (let i = 0; i < sto; i++) {
    svg += caja(x, y - hoff, {
      tra: false,
      alto,
      ancho: ancho * Math.pow(0.85, i),
      rot: rot,
      wei: 1.5,
      per: per / 2,
      dec: (a) => deco(1, Object.assign({}, a, { hsp: [1, 4], vsp: [1, 2] })),
    });

    svg += rail(x, y - hoff, i * 0.2, {
      seg: 5,
      ancho: ancho * Math.pow(0.85, i) * 1.1,
      alto: alto / 2,
      per: per / 2,
      rot: rot,
      wei: 0.5,
      tra: false,
    });

    svg += pagroof(x, y - hoff - alto, {
      alto: alto * 1.5,
      ancho: ancho * Math.pow(0.9, i),
      wei: 1.5,
      per: per,
    });
    hoff += alto * 1.5;
  }

  return svg;
}

export function arch04(x: number, y: number, seed = 0, args?: ArgsArco) {
  const predeterminados = { alto: 15, ancho: 30, rot: 0.7, per: 5, sto: 2 };
  const { alto, ancho, rot, per, sto } = { ...predeterminados, ...args };
  let svg = '';
  let hoff = 0;

  for (let i = 0; i < sto; i++) {
    svg += caja(x, y - hoff, {
      tra: true,
      alto,
      ancho: ancho * Math.pow(0.85, i),
      rot: rot,
      wei: 1.5,
      per: per / 2,
      dec: () => [],
    });

    svg += rail(x, y - hoff, i * 0.2, {
      seg: 3,
      ancho: ancho * Math.pow(0.85, i) * 1.2,
      alto: alto / 3,
      per: per / 2,
      rot: rot,
      wei: 0.5,
      tra: true,
    });

    svg += pagroof(x, y - hoff - alto, {
      alto: alto * 1,
      ancho: ancho * Math.pow(0.9, i),
      wei: 1.5,
      per: per,
    });
    hoff += alto * 1.2;
  }

  return svg;
}
