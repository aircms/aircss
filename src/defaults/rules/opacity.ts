import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";

export const opacity: IRule = {
  key: "op",
  units: "",
  styles: {
    opacity: "{value}",
  },
  override: (el, extractedClassName: IExtractedClass): IExtractedClass => {
    if (!extractedClassName.arbitrary) {
      extractedClassName.normalizedValue = (parseInt(extractedClassName.value) / 100).toString();
    }
    return extractedClassName;
  },
};
