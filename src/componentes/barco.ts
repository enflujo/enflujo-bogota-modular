import { stroke } from '../utilidades/cosas';
import { poly } from '../utilidades/Util';
import { hat02, man, stick01 } from './Man';

export default (xoff: number, yoff: number, args?: { len?: number; sca?: number; fli?: boolean }) => {
  const predeterminados = { len: 120, sca: 1, fli: false };
  const { len, sca, fli } = { ...predeterminados, ...args };
  let canv = '';
  const dir = fli ? -1 : 1;

  canv += man(xoff + 20 * sca * dir, yoff, {
    ite: stick01,
    hat: hat02,
    sca: 0.5 * sca,
    fli: !fli,
    len: [0, 30, 20, 30, 10, 30, 30, 30, 30],
  });

  const plist1: number[][] = [];
  const plist2: number[][] = [];
  const fun1 = (x: number) => Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * sca;
  const fun2 = (x: number) => Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * sca;

  for (let i = 0; i < len * sca; i += 5 * sca) {
    plist1.push([i * dir, fun1(i / len)]);
    plist2.push([i * dir, fun2(i / len)]);
  }

  const plist = plist1.concat(plist2.reverse());
  canv += poly(plist, { xof: xoff, yof: yoff, fil: 'white' });
  canv += stroke(
    plist.map((v) => [xoff + v[0], yoff + v[1]]),
    {
      wid: 1,
      fun: (x) => Math.sin(x * Math.PI * 2),
      col: 'rgba(100,100,100,0.4)',
    }
  );

  return canv;
};
