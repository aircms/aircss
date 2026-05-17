import { IRule } from "../../types/IRule";

export const width: IRule = {
  key: "w",
  styles: {
    width: "{value}",
  },
  values: {
    a: "auto",
    f: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
  },
};

export const maxWidth: IRule = {
  key: "w:max",
  styles: {
    "max-width": "{value}",
  },
  values: {
    a: "auto",
    f: "100%",
  },
};

export const minWidth: IRule = {
  key: "w:min",
  styles: {
    "min-width": "{value}",
  },
  values: {
    a: "auto",
    f: "100%",
  },
};
