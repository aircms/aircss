import { IRule } from "../../types/IRule";

export const transition: IRule = {
  key: "ts",
  units: "ms",
  styles: {
    "transition-property": "all",
    "transition-duration": "{value}",
  },
};

export const transitionProperty: IRule = {
  key: "ts:prop",
  styles: {
    "transition-property": "{value}",
  },
  values: {
    none: "none",
    all: "all",
  },
};

export const transitionDuration: IRule = {
  key: "ts:dur",
  units: "ms",
  styles: {
    "transition-duration": "{value}",
  },
};

export const transitionBehavior: IRule = {
  key: "ts:beh",
  styles: {
    "transition-behavior": "{value}",
  },
  values: {
    allow: "allow-discrete",
    normal: "normal",
  },
};

export const transitionTimingFunction: IRule = {
  key: "ts:func",
  styles: {
    "transition-timing-function": "{value}",
  },
  values: {
    ease: "ease",
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};

export const transitionDelay: IRule = {
  key: "ts:delay",
  styles: {
    "transition-delay": "{value}",
  },
};
