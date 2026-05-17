import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";

export const gradientRadial: IRule = {
  key: "radial",
  styles: {
    "background": "{value}",
  },
  override: (el, extractedClass: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClass.arbitrary) {
      const colors = extractedClass.value.split(":").map(color => airCss.getCssColorValue(color));

      const gradientColors = colors.map((color, index) => {
        if (colors.length === 1) {
          return `${color} 100%`;
        }
        const percent = (index / (colors.length - 1)) * 100;
        return `${color} ${percent}%`;
      });

      extractedClass.normalizedValue = `radial-gradient(circle, ${gradientColors.join(", ")})`;
    }
    return extractedClass;
  },
};

export const gradientLinear: IRule = {
  key: "line",
  styles: {
    "background": "{value}",
  },
  override: (el, extractedClass: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClass.arbitrary) {
      const value = extractedClass.value.split(":");
      const deg = value[0];
      const colors = value.slice(1).map(color => airCss.getCssColorValue(color));

      const gradientColors = colors.map((color, index) => {
        if (colors.length === 1) {
          return `${color} 100%`;
        }
        const percent = (index / (colors.length - 1)) * 100;
        return `${color} ${percent}%`;
      });

      extractedClass.normalizedValue = `linear-gradient(${deg}deg, ${gradientColors.join(", ")})`;
    }
    return extractedClass;
  },
};
