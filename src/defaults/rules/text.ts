import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";

export const textColor: IRule = {
  key: "text",
  styles: {
    color: "{value}",
  },
  values: {
    initial: "initial",
    inherit: "inherit",
  },
  override: (el, extractedClass: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClass.arbitrary) {
      extractedClass.normalizedValue = airCss.getCssColorValue(extractedClass.value) ?? extractedClass.value;
    }
    return extractedClass;
  },
};

export const textFontWeight: IRule = {
  key: "fw",
  units: "",
  styles: {
    "font-weight": "{value}",
  },
  values: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
};

export const textAlign: IRule = {
  key: "ta",
  styles: {
    "text-align": "{value}",
  },
  values: {
    start: "left",
    center: "center",
    end: "right",
    justify: "justify",
  },
};

export const textFontStyle: IRule = {
  key: "fst",
  styles: {
    "font-style": "{value}",
  },
  values: {
    it: "italic",
    norm: "normal",
  },
};

export const textTransform: IRule = {
  key: "tt",
  styles: {
    "text-transform": "{value}",
  },
  values: {
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
  },
};

export const textDecoration: IRule = {
  key: "td",
  styles: {
    "text-decoration": "{value}",
  },
  values: {
    underline: "underline",
    lineThrough: "line-through",
    overline: "overline",
    none: "none",
  },
};

export const textLineHeight: IRule = {
  key: "lh",
  styles: {
    "line-height": "{value}",
  },
};

export const textFontSize: IRule = {
  key: "fs",
  styles: {
    "font-size": "{value}",
  },
};

export const textLetterSpacing: IRule = {
  key: "ls",
  styles: {
    "letter-spacing": "{value}",
  },
};
