import { IRule } from "../../types/IRule";
import { AirCss } from "../../index";
import { IExtractedClass } from "../../types/IExtractedClass";
import { buildSelector } from "../../helper/build-selector";

export const borderStyle: IRule = {
  key: "bst",
  styles: {
    "border-style": "{value}",
  },
  values: {
    none: "none",
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
  },
};

export const borderWidth: IRule = {
  key: "bw",
  styles: {
    "border-width": "{value}",
  },
};

export const borderWidthTop: IRule = {
  key: "bw:t",
  styles: {
    "border-top-width": "{value}",
  },
};

export const borderWidthBottom: IRule = {
  key: "bw:b",
  styles: {
    "border-bottom-width": "{value}",
  },
};

export const borderWidthStart: IRule = {
  key: "bw:s",
  styles: {
    "border-left-width": "{value}",
  },
};

export const borderWidthEnd: IRule = {
  key: "bw:e",
  styles: {
    "border-right-width": "{value}",
  },
};

export const borderColor: IRule = {
  key: "bc",
  styles: {
    "border-color": "{value}",
  },
  values: {
    none: "transparent",
    inherit: "inherit",
    initial: "initial",
  },
  init: (airCss: AirCss) => {
    airCss.addStyles({
      selector: "[class*=\"bc:\"]",
      onlyOne: true,
      styles: {
        "border-width": "1px",
        "border-style": "solid",
        [`--${airCss.getOptions().defaults.cssPrefix}-border-color-opacity`]: "1",
      },
    });
  },
  override: (e, extractedClass: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClass.arbitrary) {
      extractedClass.normalizedValue = `rgba(${extractedClass.normalizedValue}, var(--${airCss.getOptions().defaults.cssPrefix}-border-color-opacity))`;
    }
    return extractedClass;
  },
};

export const borderOpacity: IRule = {
  key: "bc:op",
  override: (e, extractedClass: IExtractedClass, airCss: AirCss): null => {
    airCss.addStyles({
      breakpoint: extractedClass.media,
      selector: buildSelector(extractedClass),
      onlyOne: true,
      styles: {
        [`--${airCss.getOptions().defaults.cssPrefix}-border-color-opacity`]: (extractedClass.value / 100).toString(),
      },
    });
  },
};

const values = {
  circle: "50%",
  pill: "999px",
};

export const borderRadius: IRule = {
  key: "br",
  styles: {
    "border-radius": "{value}",
  },
  values,
};

export const borderRadiusTopEnd: IRule = {
  key: "br:te",
  styles: {
    "border-top-right-radius": "{value}",
  },
  values,
};

export const borderRadiusBottomEnd: IRule = {
  key: "br:be",
  styles: {
    "border-bottom-right-radius": "{value}",
  },
  values,
};

export const borderRadiusBottomStart: IRule = {
  key: "br:bs",
  styles: {
    "border-bottom-left-radius": "{value}",
  },
  values,
};

export const borderRadiusTopStart: IRule = {
  key: "br:ts",
  styles: {
    "border-top-left-radius": "{value}",
  },
  values,
};
