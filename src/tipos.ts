export interface BaseArbol {
  alto?: number;
  ancho?: number;
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
  ancho?: number;
  ang?: number;
  lea?: [boolean, number];
}

export interface ArgsStroke {
  xof?: number;
  yof?: number;
  ancho?: number;
  col?: string;
  noi?: number;
  out?: number;
  fun?: (x: number) => number;
}

export interface ArgsPoly {
  x?: number;
  y?: number;
  fil?: string;
  str?: string;
  ancho?: number;
}

export interface ArgsBolb {
  len?: number;
  ancho?: number;
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
  ancho?: number;
  len?: number;
  sha?: number | boolean;
  ret?: number;
  noi?: (x: number) => number;
  col?: (x: number) => string;
  dis?: () => number;
}

export interface OpcionesMontaña {
  alto: number;
  ancho: number;
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

export type Punto = [x: number, y: number];
export type Cubo = [Punto, Punto][];

export interface ArgsCaja {
  alto?: number;
  ancho?: number;
  rot?: number;
  per?: number;
  tra?: boolean;
  bot?: boolean;
  wei?: number;
  dec?: () => Punto;
}

export interface ArgsChoza {
  alto?: number;
  ancho?: number;
  tex?: number;
}

export interface ArgsBarco {
  len?: number;
  sca?: number;
  fli?: boolean;
}
