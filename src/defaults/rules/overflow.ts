import { IRule } from "../../types/IRule";

export const overflow: IRule = {
  key: "ov",
  styles: {
    "overflow": "{value}",
  },
  values: {
    vis: "visible",
    hid: "hidden",
    scroll: "scroll",
    a: "auto",
  },
};

export const overflowX: IRule = {
  key: "ov:x",
  styles: {
    "overflow-x": "{value}",
  },
  values: {
    vis: "visible",
    hid: "hidden",
    scroll: "scroll",
    a: "auto",
  },
};

export const overflowY: IRule = {
  key: "ov:y",
  styles: {
    "overflow-y": "{value}",
  },
  values: {
    vis: "visible",
    hid: "hidden",
    scroll: "scroll",
    a: "auto",
  },
};
