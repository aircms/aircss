import { IRule } from "../../types/IRule";

export const position: IRule = {
  key: "pos",
  styles: {
    "position": "{value}",
  },
  values: {
    rel: "relative",
    abs: "absolute",
    fix: "fixed",
    sti: "sticky",
    sta: "static",
    init: "initial",
  },
};

export const positionZIndex: IRule = {
  key: "z",
  units: "",
  styles: {
    "z-index": "{value}",
  },
};

export const positionTop: IRule = {
  key: "t",
  styles: {
    top: "{value}",
  },
};

export const positionEnd: IRule = {
  key: "e",
  styles: {
    right: "{value}",
  },
};

export const positionBottom: IRule = {
  key: "b",
  styles: {
    bottom: "{value}",
  },
};

export const positionStart: IRule = {
  key: "s",
  styles: {
    left: "{value}",
  },
};
