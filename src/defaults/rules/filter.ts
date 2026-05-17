import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";
import { buildSelector } from "../../helper/build-selector";

const getFilterNameValueUnit = (className: string): { name: string, value: string, unit: string } => {
  let value = className.split(":");
  let valueUnit: string | null;

  if (!className.includes("[")) {

    // filter:brightness:100
    if (
      value[0] === "brightness" ||
      value[0] === "contrast" ||
      value[0] === "grayscale" ||
      value[0] === "invert" ||
      value[0] === "saturate" ||
      value[0] === "sepia"
    ) {
      valueUnit = "%";

    } else if (value[0] === "blur") {
      valueUnit = "px";
      value[1] = (value[1] / 10).toString();

    } else if (value[0] === "hue") {
      value[0] = "hue-rotate";
      valueUnit = "deg";
    }

  } else {
    value[1] = value[1].replace("[", "").replace("]", "");
  }

  return { name: value[0], value: value[1], unit: valueUnit ?? "" };
};

export const filter: IRule = {
  key: "filter",
  init: (airCss: AirCss) => {
    const cssPrefix = airCss.getOptions().defaults.cssPrefix;

    const filters: Array<string> = [
      "blur",
      "brightness",
      "contrast",
      "grayscale",
      "hue-rotate",
      "invert",
      "opacity",
      "saturate",
      "sepia",
      "drop-shadow",
    ];

    const vars = filters.map((filter) => `var(--${cssPrefix}-${filter}, )`);

    airCss.addStyles({
      selector: "[class*=\"filter:\"]",
      styles: {
        filter: vars.join(" "),
      },
    });
  },
  override: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss): null => {

    const cssPrefix = airCss.getOptions().defaults.cssPrefix;
    const filter = getFilterNameValueUnit(extractedClassName.value);

    airCss.addStyles({
      breakpoint: extractedClassName.media,
      selector: buildSelector(extractedClassName),
      styles: {
        [`--${cssPrefix}-${filter.name}`]: `${filter.name}(${filter.value}${filter.unit})`,
      },
    });
  },
};

export const backdrop: IRule = {
  key: "backdrop",

  init: (airCss: AirCss) => {
    const cssPrefix = airCss.getOptions().defaults.cssPrefix;

    const backdropFilters: Array<string> = [
      "blur",
      "brightness",
      "contrast",
      "grayscale",
      "hue-rotate",
      "invert",
      "opacity",
      "saturate",
      "sepia",
    ];

    const backdropsVars = backdropFilters.map((filter) => `var(--${cssPrefix}-backdrop-${filter}, )`);

    airCss.addStyles({
      selector: "[class*=\"backdrop:\"]",
      styles: {
        "backdrop-filter": backdropsVars.join(" "),
      },
    });
  },

  override: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss): null => {

    const cssPrefix = airCss.getOptions().defaults.cssPrefix;
    const filter = getFilterNameValueUnit(extractedClassName.value);

    airCss.addStyles({
      breakpoint: extractedClassName.media,
      selector: buildSelector(extractedClassName),
      styles: {
        [`--${cssPrefix}-backdrop-${filter.name}`]: `${filter.name}(${filter.value}${filter.unit ?? ""})`,
      },
    });
  },
};
