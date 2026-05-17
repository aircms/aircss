import { IRule } from "../../types/IRule";

export const height: IRule = {
  key: "h",
  styles: {
    height: "{value}",
  },
  values: {
    f: "100%",
    a: "auto",
  },
};

export const maxHeight: IRule = {
  key: "h:max",
  styles: {
    "max-height": "{value}",
  },
  values: {
    f: "100%",
    a: "auto",
  },
};

export const minHeight: IRule = {
  key: "h:min",
  styles: {
    "min-height": "{value}",
  },
  values: {
    a: "{value}",
    f: "100%",
  },
};
