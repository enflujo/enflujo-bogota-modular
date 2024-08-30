import { Punto } from '@/tipos';

type ArgsTriangulacion = {
  area: number;
  convex: boolean;
  optimize: boolean;
};

export function midPt() {
  const plist = arguments.length == 1 ? arguments[0] : Array.apply(null, arguments);
  return plist.reduce(
    function (acc: number[], v: number[]) {
      /*       if (v == undefined || acc == undefined){
      console.log("ERRR");
      console.log(plist)
      return [0,0]
    } */
      return [v[0] / plist.length + acc[0], v[1] / plist.length + acc[1]];
    },
    [0, 0]
  );
}

export function triangulate(
  plist: Punto[],
  args: ArgsTriangulacion = { area: 100, convex: false, optimize: true }
): number[][][] {
  const { area, convex, optimize } = args;

  function lineExpr(pt0: Punto, pt1: Punto) {
    const den = pt1[0] - pt0[0];
    const m = den == 0 ? Infinity : (pt1[1] - pt0[1]) / den;
    const k = pt0[1] - m * pt0[0];
    return [m, k];
  }

  function intersect(ln0: Punto[], ln1: Punto[]) {
    const le0 = lineExpr(...ln0);
    const le1 = lineExpr(...ln1);
    const den = le0[0] - le1[0];
    if (den == 0) {
      return false;
    }
    var x = (le1[1] - le0[1]) / den;
    var y = le0[0] * x + le0[1];

    function onSeg(p: Punto, ln: Punto[]) {
      //non-inclusive
      return (
        Math.min(ln[0][0], ln[1][0]) <= p[0] &&
        p[0] <= Math.max(ln[0][0], ln[1][0]) &&
        Math.min(ln[0][1], ln[1][1]) <= p[1] &&
        p[1] <= Math.max(ln[0][1], ln[1][1])
      );
    }

    if (onSeg([x, y], ln0) && onSeg([x, y], ln1)) {
      return [x, y];
    }
    return false;
  }

  function ptInPoly(pt: Punto, plist: Punto[]) {
    let scount = 0;

    for (let i = 0; i < plist.length; i++) {
      const np = plist[i != plist.length - 1 ? i + 1 : 0];
      const sect = intersect([plist[i], np], [pt, [pt[0] + 999, pt[1] + 999]]);

      if (sect != false) {
        scount++;
      }
    }
    return scount % 2 == 1;
  }
  function lnInPoly(ln: number[][], plist: number[][]) {
    const lnc = [
      [0, 0],
      [0, 0],
    ];
    const ep = 0.01;

    lnc[0][0] = ln[0][0] * (1 - ep) + ln[1][0] * ep;
    lnc[0][1] = ln[0][1] * (1 - ep) + ln[1][1] * ep;
    lnc[1][0] = ln[0][0] * ep + ln[1][0] * (1 - ep);
    lnc[1][1] = ln[0][1] * ep + ln[1][1] * (1 - ep);

    for (let i = 0; i < plist.length; i++) {
      const pt = plist[i];
      const np = plist[i != plist.length - 1 ? i + 1 : 0];
      if (intersect(lnc, [pt, np]) != false) {
        return false;
      }
    }

    const mid = midPt(ln);

    if (ptInPoly(mid, plist) == false) {
      return false;
    }
    return true;
  }

  function sidesOf(plist: Punto[]) {
    const slist = [];

    for (let i = 0; i < plist.length; i++) {
      const pt = plist[i];
      const np = plist[i != plist.length - 1 ? i + 1 : 0];
      const s = Math.sqrt(Math.pow(np[0] - pt[0], 2) + Math.pow(np[1] - pt[1], 2));
      slist.push(s);
    }
    return slist;
  }

  function areaOf(plist: Punto[]) {
    const slist = sidesOf(plist);
    const a = slist[0];
    const b = slist[1];
    const c = slist[2];
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  function sliverRatio(plist: Punto[]) {
    const A = areaOf(plist);
    const P = sidesOf(plist).reduce(function (m, n) {
      return m + n;
    }, 0);

    return A / P;
  }

  function bestEar(plist: Punto[]) {
    const cuts = [];

    for (var i = 0; i < plist.length; i++) {
      const pt = plist[i];
      const lp = plist[i != 0 ? i - 1 : plist.length - 1];
      const np = plist[i != plist.length - 1 ? i + 1 : 0];
      const qlist = plist.slice();
      qlist.splice(i, 1);

      if (convex || lnInPoly([lp, np], plist)) {
        const c = [[lp, pt, np], qlist];
        if (!optimize) return c;
        cuts.push(c);
      }
    }

    let best = [plist, []];
    let bestRatio = 0;

    for (let i = 0; i < cuts.length; i++) {
      const r = sliverRatio(cuts[i][0]);
      if (r >= bestRatio) {
        best = cuts[i];
        bestRatio = r;
      }
    }
    return best;
  }

  function shatter(plist: Punto[], a: number) {
    if (plist.length == 0) return [];

    if (areaOf(plist) < a) {
      return [plist];
    } else {
      const slist = sidesOf(plist);
      const ind = slist.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
      const nind = (ind + 1) % plist.length;
      const lind = (ind + 2) % plist.length;

      try {
        const mid = midPt([plist[ind], plist[nind]]);
        return shatter([plist[ind], mid, plist[lind]], a).concat(shatter([plist[lind], plist[nind], mid], a));
      } catch (err) {
        console.log(plist);
        console.log(err);
        return [];
      }
    }
  }

  if (plist.length <= 3) {
    return shatter(plist, area);
  }

  const cut = bestEar(plist);
  return shatter(cut[0], area).concat(triangulate(cut[1], args));
}
