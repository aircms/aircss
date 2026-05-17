import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";

export const animation: IRule = {
  key: "an",
  styles: {
    animation: "{value}",
  },
  override: (e, extractedClassName: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClassName.arbitrary) {
      const value = extractedClassName.value.split(":");
      const animationTimingFunction = value.length === 3
        ? value[2]
        : airCss.getOptions().defaults.animationTimingFunction;

      extractedClassName.normalizedValue = `${value[1]} ${value[0]}ms ${animationTimingFunction}`;
    }
    return extractedClassName;
  },
};

export const animationDuration: IRule = {
  key: "an:dur",
  units: "ms",
  styles: {
    "animation-duration": "{value}",
  },
};

export const animationTimingFunction: IRule = {
  key: "an:func",
  styles: {
    "animation-timing-function": "{value}",
  },
  values: {
    ease: "ease",
    line: "linear",
    in: "ease-in",
    out: "ease-out",
    inOut: "ease-in-out",
    start: "step-start",
    end: "step-end",
  },
};

export const animationDelay: IRule = {
  key: "an:delay",
  units: "ms",
  styles: {
    "animation-delay": "{value}",
  },
};

export const animationIterationCount: IRule = {
  key: "an:count",
  styles: {
    "animation-iteration-count": "{value}",
  },
  values: {
    inf: "infinite",
  },
};

export const animationDirection: IRule = {
  key: "an:dir",
  styles: {
    "animation-direction": "{value}",
  },
  values: {
    norm: "normal",
    rev: "reverse",
    alt: "alternate",
    altRev: "alternate-reverse",
  },
};

export const animationFillMode: IRule = {
  key: "an:fill",
  styles: {
    "animation-fill-mode": "{value}",
  },
  values: {
    none: "none",
    forward: "forwards",
    back: "backwards",
    both: "both",
  },
};

export const animationPlayState: IRule = {
  key: "an:state",
  styles: {
    "animation-play-state": "{value}",
  },
  values: {
    pause: "paused",
    play: "running",
  },
};

export const animationTimeline: IRule = {
  key: "an:time",
  styles: {
    "animation-timeline": "{value}",
  },
  values: {
    a: "auto",
    scroll: "scroll()",
    view: "view()",
  },
};

export const animationRange: IRule = {
  key: "an:range",
  styles: {
    "animation-range": "{value}",
  },
  values: {
    norm: "normal",
    cover: "cover",
    contain: "contain",
    entry: "entry",
    exit: "exit",
    entryCross: "entry-crossing",
    exitCross: "exit-crossing",
  },
};

export const animationComposite: IRule = {
  key: "an:comp",
  styles: {
    "animation-composite": "{value}",
  },
  values: {
    add: "additive",
    rep: "replace",
    acc: "accumulate",
  },
};
