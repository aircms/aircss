import { IRule } from "../../types/IRule";

export const cluster: IRule = {
  key: "cluster",
  styles: {
    "display": "flex",
    "flex-wrap": "wrap",
    "gap": "{value}",
    "align-items": "center",
  },
};
