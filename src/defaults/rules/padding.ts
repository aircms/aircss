import { IRule } from "../../types/IRule";

export const padding: IRule = {
  key: "p",
  styles: {
    "padding": "{value}",
  },
  values: {
    i: "initial",
  },
};

export const paddingHorizontal: IRule = {
  key: "px",
  styles: {
    "padding-left": "{value}",
    "padding-right": "{value}",
  },
  values: {
    i: "initial",
  },
};

export const paddingVertical: IRule = {
  key: "py",
  styles: {
    "padding-top": "{value}",
    "padding-bottom": "{value}",
  },
  values: {
    i: "initial",
  },
};

export const paddingTop: IRule = {
  key: "pt",
  styles: {
    "padding-top": "{value}",
  },
  values: {
    i: "initial",
  },
};

export const paddingBottom: IRule = {
  key: "pb",
  styles: {
    "padding-bottom": "{value}",
  },
  values: {
    i: "initial",
  },
};

export const paddingStart: IRule = {
  key: "ps",
  styles: {
    "padding-left": "{value}",
  },
  values: {
    i: "initial",
  },
};

export const paddingEnd: IRule = {
  key: "pe",
  styles: {
    "padding-right": "{value}",
  },
  values: {
    i: "initial",
  },
};
