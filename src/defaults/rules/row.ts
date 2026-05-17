import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";

export const row: IRule = {
  key: "row",
  units: "",
  styles: {
    "display": "grid",
    "grid-template-columns": "repeat({value}, minmax(0,1fr))",
  },
  values: {
    a: "auto-fit",
  },
  override: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClassName.arbitrary) {
      if (!extractedClassName.value) {
        extractedClassName.normalizedValue = airCss.getOptions().defaults.grids.toString();
      }
    }
    return extractedClassName;
  },
};

export const col: IRule = {
  key: "col",
  units: "",
  styles: {
    "grid-column": "span {value}",
  },
  override: (el: HTMLElement, extractedClassName: IExtractedClass): IExtractedClass => {
    if (!extractedClassName.arbitrary) {
      if (extractedClassName.value === "a") {
        return { ...extractedClassName, normalizedValue: "span 1" };
      }
      if (extractedClassName.value === "f") {
        return { ...extractedClassName, normalizedValue: "1 / -1" };
      }
    }
    return extractedClassName;
  },
};
