import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";

export const boxShadow: IRule = {
  key: "sh:b",
  styles: {
    "box-shadow": "{value}",
  },
  values: {
    none: "none",
  },
  override: (e, extractedClassName: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClassName.arbitrary) {
      const value = extractedClassName.value.split(":");

      if (value.length > 1) {
        const color = airCss.getCssColorValue([ value[1], value[2] ?? null ]);
        extractedClassName.normalizedValue = `0px 0px ${value[0]}px 0px ${color}`;
      }
    }
    return extractedClassName;
  },
};

export const textShadow: IRule = {
  key: "sh:t",
  styles: {
    "text-shadow": "{value}",
  },
  override: (e, className: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!className.arbitrary) {
      const value = className.value.split(":");

      if (value.length === 2 || value.length === 3) {

        const defaultUnits = airCss.getOptions().defaults.units;
        const blur = value[0] + defaultUnits;
        const color = airCss.getCssColorValue([ value[1], value[2] ?? null ]);

        className.normalizedValue = `0px 0px ${blur} ${color}`;
      }
    }
    return className;
  },
};
