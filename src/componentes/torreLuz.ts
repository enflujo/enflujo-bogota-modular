import { div, stroke } from '../utilidades/cosas';

export default (xoff: number, yoff: number, args?: { hei?: number; wid?: number }) => {
  const predeterminados = { hei: 100, wid: 20 };
  const { hei, wid } = { ...predeterminados, ...args };

  let canv = '';
  const toGlobal = (v: number[]) => [v[0] + xoff, v[1] + yoff];

  const quickstroke = (pl: number[][]) => {
    return stroke(div(pl, 5).map(toGlobal), {
      wid: 1,
      fun: () => 0.5,
      col: 'rgba(100,100,100,0.4)',
    });
  };

  const p00 = [-wid * 0.05, -hei];
  const p01 = [wid * 0.05, -hei];
  const p10 = [-wid * 0.1, -hei * 0.9];
  const p11 = [wid * 0.1, -hei * 0.9];
  const p20 = [-wid * 0.2, -hei * 0.5];
  const p21 = [wid * 0.2, -hei * 0.5];
  const p30 = [-wid * 0.5, 0];
  const p31 = [wid * 0.5, 0];
  const bch = [
    [0.7, -0.85],
    [1, -0.675],
    [0.7, -0.5],
  ];

  for (let i = 0; i < bch.length; i++) {
    canv += quickstroke([
      [-bch[i][0] * wid, bch[i][1] * hei],
      [bch[i][0] * wid, bch[i][1] * hei],
    ]);
    canv += quickstroke([
      [-bch[i][0] * wid, bch[i][1] * hei],
      [0, (bch[i][1] - 0.05) * hei],
    ]);
    canv += quickstroke([
      [bch[i][0] * wid, bch[i][1] * hei],
      [0, (bch[i][1] - 0.05) * hei],
    ]);

    canv += quickstroke([
      [-bch[i][0] * wid, bch[i][1] * hei],
      [-bch[i][0] * wid, (bch[i][1] + 0.1) * hei],
    ]);
    canv += quickstroke([
      [bch[i][0] * wid, bch[i][1] * hei],
      [bch[i][0] * wid, (bch[i][1] + 0.1) * hei],
    ]);
  }

  const l10 = div([p00, p10, p20, p30], 5);
  const l11 = div([p01, p11, p21, p31], 5);

  for (let i = 0; i < l10.length - 1; i++) {
    canv += quickstroke([l10[i], l11[i + 1]]);
    canv += quickstroke([l11[i], l10[i + 1]]);
  }

  canv += quickstroke([p00, p01]);
  canv += quickstroke([p10, p11]);
  canv += quickstroke([p20, p21]);
  canv += quickstroke([p00, p10, p20, p30]);
  canv += quickstroke([p01, p11, p21, p31]);

  return canv;
};
