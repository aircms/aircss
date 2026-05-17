import { IExtractedClass } from "../types/IExtractedClass";
import { buildSelector } from "./build-selector";
import { buildStyle } from "./build-style";
import { AirCss } from "../index";

export const computeStyle = (extractedClassName: IExtractedClass, airCss: AirCss): string => {

  const selector = buildSelector(extractedClassName);
  const styles = buildStyle(extractedClassName, airCss);

  return `${selector} { ${styles} }`;
};
