export interface BaseElemento {
  alto: number;
  ancho: number;
}

export interface ArgsArbol {
  alto?: number;
  ancho?: number;
  color?: string;
  noi?: number;
  clu?: number;
  ben?: (x: number) => number;
}

export interface Arbol extends BaseElemento {
  color: string;
}

export interface Arbol2 extends Arbol {
  clu: number;
}

export interface Arbol3 extends Arbol {
  ben: (x: number) => number;
}

export interface ArgsFrac extends BaseElemento {
  ang: number;
  ben: number;
}

export interface ArgsBranch {
  alto?: number;
  ancho?: number;
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
  color?: string;
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
  color?: string;
  ang?: number;
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
  color?: (x: number) => string;
  dis?: () => number;
}

export interface OpcionesMontaña {
  alto: number;
  ancho: number;
  tex: number;
  veg: boolean;
  ret: number;
}

export interface Chunk {
  x: number;
  y: number;
  canv?: string;
  tag: string;
}

export type Punto = [x: number, y: number];
export type Cubo = [Punto, Punto][];

export type OpcionesDec = {
  pul?: Punto;
  pur?: Punto;
  pdl?: Punto;
  pdr?: Punto;
  hsp?: Punto;
  vsp?: Punto;
};

export interface ArgsCaja {
  alto?: number;
  ancho?: number;
  rot?: number;
  per?: number;
  tra?: boolean;
  bot?: boolean;
  wei?: number;
  dec?: (opciones: OpcionesDec) => Punto[][];
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

export interface ArgsMan {
  sca?: number;
  hat?: (p0: Punto, p1: Punto, args?: { fli?: boolean }) => string;
  ite?: () => string;
  fli?: boolean;
  ang?: number[];
  len?: number[];
}

export interface ArgsDeco {
  pul?: Punto;
  pur?: Punto;
  pdl?: Punto;
  pdr?: Punto;
  hsp?: Punto;
  vsp?: Punto;
}

export interface OpcionesDeco {
  pul: Punto;
  pur: Punto;
  pdl: Punto;
  pdr: Punto;
  hsp: Punto;
  vsp: Punto;
}

export interface ArgsRail {
  alto?: number;
  ancho?: number;
  rot?: number;
  per?: number;
  seg?: number;
  wei?: number;
  tra?: boolean;
  fro?: boolean;
}

export interface ArgsTecho {
  alto?: number;
  ancho?: number;
  rot?: number;
  per?: number;
  cor?: number;
  wei?: number;
  pla?: [number, string];
}

export interface ArgsPagRoof {
  alto?: number;
  ancho?: number;
  per?: number;
  cor?: number;
  sid?: number;
  wei?: number;
}

export interface ArgsArco {
  alto?: number;
  ancho?: number;
  per?: number;
  rot?: number;
  sto?: number;
  sty?: number;
  rai?: boolean;
}
