import { TColors, TColorValue } from "./Color";

export interface IDefaults {
  cssPrefix: string;
  units: "px" | "%" | "em" | "rem" | "vw" | "vh" | "dvw" | "dvh" | string;
  color: number;
  animationTimingFunction: string;
  important: boolean;
  grids: number;
  containers: Record<string, number>;
  breakpoints: Record<string, number>;
  spaces: Record<string, Record<string, string>>;
  colors: TColors & {
    primary?: TColorValue;
    secondary?: TColorValue;
  };
}
