import { IRule } from "../../types/IRule";
import { IExtractedClass } from "../../types/IExtractedClass";
import { AirCss } from "../../index";
import { extractClass } from "../../helper/extract-class";
import { computeStyle } from "../../helper/compute-style";

export const group: IRule = {
  key: "group",
  override: (e, extractedClassName: IExtractedClass, airCss: AirCss): null => {
    if (extractedClassName.value) {

      const extractedSubClass = extractClass(extractedClassName.value, airCss);
      const subRule = airCss.getRuleWithKey(extractedSubClass.key);

      if (subRule) {
        let subValue = extractedSubClass;
        if (subRule.override) {
          const _subValue = subRule.override(e, subValue, airCss);
          if (_subValue) {
            subValue = _subValue;
          }
        }

        subValue.className = extractedClassName.className;
        const computedStyles = computeStyle(subValue, airCss);
        const subStyles = `.${group.key}:hover {${computedStyles}}`;
        airCss.addStyle(extractedClassName.media, subStyles);
      }
    }
  },
};
