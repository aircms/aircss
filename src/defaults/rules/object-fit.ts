import { IRule } from "../../types/IRule";

export const objectFit: IRule = {
  key: "of",
  styles: {
    "object-fit": "{value}",
  },
  values: {
    cover: "cover",
    contain: "contain",
    fill: "fill",
    none: "none",
    scaleDown: "scale-down",
  },
};
