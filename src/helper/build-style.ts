import { AirCss } from "../index";
import { IExtractedClass } from "../types/IExtractedClass";

export const buildStyle = (extractedClass: IExtractedClass, airCss: AirCss): string | null => {
  if (!extractedClass?.rule?.styles) {
    return;
  }

  return Object.entries(extractedClass.rule.styles)
    .map(([ property, template ]) => {
      const cssValue = String(template).replace("{value}", extractedClass.normalizedValue);
      const important = airCss.getOptions().defaults.important ? " !important" : "";

      return `${property}: ${cssValue}${important};`;
    })
    .join(" ");
};
