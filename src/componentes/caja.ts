import type { ArgsCaja, Punto } from '@/tipos';
import { div, stroke } from '@/utilidades/cosas';
import { poly } from '@/utilidades/Util';

export default (xoff: number, yoff: number, args?: ArgsCaja) => {
  const predeterminados = {
    alto: 20,
    ancho: 120,
    rot: 0.7,
    per: 4,
    tra: true,
    bot: true,
    wei: 3,
    dec: () => [],
  };
  const { alto, ancho, rot, per, tra, bot, wei, dec } = { ...predeterminados, ...args };

  const mid = -ancho * 0.5 + ancho * rot;
  const bmid = -ancho * 0.5 + ancho * (1 - rot);
  let cajas: Punto[][] = [];

  cajas.push(
    div(
      [
        [-ancho * 0.5, -alto],
        [-ancho * 0.5, 0],
      ],
      5
    )
  );

  cajas.push(
    div(
      [
        [ancho * 0.5, -alto],
        [ancho * 0.5, 0],
      ],
      5
    )
  );
  if (bot) {
    cajas.push(
      div(
        [
          [-ancho * 0.5, 0],
          [mid, per],
        ],
        5
      )
    );
    cajas.push(
      div(
        [
          [ancho * 0.5, 0],
          [mid, per],
        ],
        5
      )
    );
  }

  cajas.push(
    div(
      [
        [mid, -alto],
        [mid, per],
      ],
      5
    )
  );

  if (tra) {
    if (bot) {
      cajas.push(
        div(
          [
            [-ancho * 0.5, 0],
            [bmid, -per],
          ],
          5
        )
      );
      cajas.push(
        div(
          [
            [ancho * 0.5, 0],
            [bmid, -per],
          ],
          5
        )
      );
    }
    cajas.push(
      div(
        [
          [bmid, -alto],
          [bmid, -per],
        ],
        5
      )
    );
  }

  const surf = +(rot < 0.5) * 2 - 1;

  cajas = cajas.concat(
    dec({
      pul: [surf * ancho * 0.5, -alto],
      pur: [mid, -alto + per],
      pdl: [surf * ancho * 0.5, 0],
      pdr: [mid, per],
    })
  );

  const polist = [
    [-ancho * 0.5, -alto],
    [ancho * 0.5, -alto],
    [ancho * 0.5, 0],
    [mid, per],
    [-ancho * 0.5, 0],
  ];

  let canv = '';

  if (!tra) {
    canv += poly(polist, {
      xof: xoff,
      yof: yoff,
      str: 'none',
      fil: 'white',
    });
  }

  for (let i = 0; i < cajas.length; i++) {
    canv += stroke(
      cajas[i].map((x) => [x[0] + xoff, x[1] + yoff]),
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
