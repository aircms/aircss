export type TDefaultColorName =
  | "emerald"
  | "green"
  | "lime"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";

export type TColorName =
  | TDefaultColorName
  | (string & {});

export type TColorShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

export type TColorPalette = Partial<
  Record<TColorShade, string>
>;

export type TColorValue =
  | TColorName
  | TColorPalette;

export type TColors = Partial<
  Record<TColorName, TColorValue>
>;
