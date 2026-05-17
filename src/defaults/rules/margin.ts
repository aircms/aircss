import { IRule } from "../../types/IRule";

export const margin: IRule = {
  key: "m",
  styles: {
    "margin": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};

export const marginHorizontal: IRule = {
  key: "mx",
  styles: {
    "margin-left": "{value}",
    "margin-right": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};

export const marginVertical: IRule = {
  key: "my",
  styles: {
    "margin-top": "{value}",
    "margin-bottom": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};
export const marginTop: IRule = {
  key: "mt",
  styles: {
    "margin-top": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};

export const marginBottom: IRule = {
  key: "mb",
  styles: {
    "margin-bottom": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};

export const marginStart: IRule = {
  key: "ms",
  styles: {
    "margin-left": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};

export const marginEnd: IRule = {
  key: "me",
  styles: {
    "margin-right": "{value}",
  },
  values: {
    i: "initial",
    a: "auto",
  },
};
