export interface BaseArbol {
  hei?: number;
  wid?: number;
  col?: string;
  noi?: number;
}

export interface ArgsArbol1 extends BaseArbol {}

export interface ArgsArbol2 extends BaseArbol {
  clu?: number;
}

export interface ArgsArbol3 extends BaseArbol {
  ben?: (x: number) => number;
}

export interface ArgsBranch extends BaseArbol {
  ang?: number;
  det?: number;
  ben?: number;
}

export interface ArgsTwig {
  dir?: number;
  sca?: number;
  wid?: number;
  ang?: number;
  lea?: [boolean, number];
}

export interface ArgsStroke {
  xof?: number;
  yof?: number;
  wid?: number;
  col?: string;
  noi?: number;
  out?: number;
  fun?: (x: number) => number;
}

export interface ArgsPoly {
  xof?: number;
  yof?: number;
  fil?: string;
  str?: string;
  wid?: number;
}

export interface ArgsBolb {
  len?: number;
  wid?: number;
  ang?: number;
  col?: string;
  noi?: number;
  ret?: number;
  fun?: (x: number) => number;
}

export interface ArgsTexture {
  xof?: number;
  yof?: number;
  tex?: number;
  wid?: number;
  len?: number;
  sha?: number;
  ret?: number;
  noi?: (x: number) => number;
  col?: (x: number) => string;
  dis?: () => number;
}

export interface ArgsMountain {
  hei: number;
  wid: number;
  tex: number;
  veg: boolean;
  ret: number;
  col: number;
}

export interface Chunk {
  x: number;
  y: number;
  canv: string;
  tag: string;
}
