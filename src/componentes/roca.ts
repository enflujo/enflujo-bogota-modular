import { stroke, texture } from '../utilidades/cosas';
import { noise } from '../utilidades/Perlin';
import { loopNoise, poly } from '../utilidades/Util';

export default (
  xoff: number,
  yoff: number,
  seed = 0,
  args?: { hei?: number; wid?: number; tex?: number; sha?: number }
) => {
  const predeterminados = {
    hei: 80,
    wid: 100,
    tex: 40,
    sha: 10,
  };

  const { hei, wid, tex, sha } = { ...predeterminados, ...args };
  let canv = '';
  const reso = [10, 50];
  const ptlist: number[][][] = [];

  for (let i = 0; i < reso[0]; i++) {
    ptlist.push([]);

    const nslist = [];
    for (let j = 0; j < reso[1]; j++) {
      nslist.push(noise(i, j * 0.2, seed));
    }
    loopNoise(nslist);

    for (let j = 0; j < reso[1]; j++) {
      const a = (j / reso[1]) * Math.PI * 2 - Math.PI / 2;
      let l = (wid * hei) / Math.sqrt(Math.pow(hei * Math.cos(a), 2) + Math.pow(wid * Math.sin(a), 2));

      /*           var l = Math.sin(a)>0? Math.pow(Math.sin(a),0.1)*wid
                             : - Math.pow(Math.sin(a+Math.PI),0.1)*wid */
      l *= 0.7 + 0.3 * nslist[j];

      const p = 1 - i / reso[0];
      const nx = Math.cos(a) * l * p;
      let ny = -Math.sin(a) * l * p;

      if (Math.PI < a || a < 0) ny *= 0.2;
      ny += hei * (i / reso[0]) * 0.2;
      ptlist[ptlist.length - 1].push([nx, ny]);
    }
  }

  //WHITE BG
  canv += poly(ptlist[0].concat([[0, 0]]), {
    xof: xoff,
    yof: yoff,
    fil: 'white',
    str: 'none',
  });
  //OUTLINE
  canv += stroke(
    ptlist[0].map((x) => [x[0] + xoff, x[1] + yoff]),
    { col: 'rgba(100,100,100,0.3)', noi: 1, wid: 3 }
  );
  canv += texture(ptlist, {
    xof: xoff,
    yof: yoff,
    tex: tex,
    wid: 3,
    sha: sha,
    col: () => 'rgba(180,180,180,' + (0.3 + Math.random() * 0.3).toFixed(3) + ')',
    dis: () => {
      if (Math.random() > 0.5) {
        return 0.15 + 0.15 * Math.random();
      } else {
        return 0.85 - 0.15 * Math.random();
      }
    },
  });

  // for (let i = 0; i < reso[0]; i++) {
  //   canv += poly(ptlist[i], { xof: xoff, yof: yoff, fil: 'none', str: 'red', wid: 2 });
  // }
  return canv;
};
