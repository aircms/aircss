import { IExtractedClass } from "../types/IExtractedClass";
import { escape } from "./escape";

export const buildSelector = (extractedClassName: IExtractedClass) => {
  const selector = `.${escape(extractedClassName.className)}`;
  if (extractedClassName.hover) {
    return `${selector}:hover`;
  }
  return selector;
};
