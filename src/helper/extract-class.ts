import { IExtractedClass } from "../types/IExtractedClass";
import { normalizeValue } from "./normalize-value";
import { AirCss } from "../index";

let ruleKeys: Array<string> = [];

export const extractClass = (className: string, airCss: AirCss): IExtractedClass => {

  const prefixesSet = new Set(airCss.getClassPrefixes());

  let value = className;
  let index = -1;

  let hover = false;
  let media: string | null = null;

  while ((index = className.indexOf(":", index + 1)) !== -1) {
    const prefix = className.slice(0, index + 1);

    if (prefixesSet.has(prefix)) {

      const parts = prefix.split(":").filter(Boolean);

      for (const part of parts) {
        if (part === "hov") {
          hover = true;
          continue;
        }

        media = part;
      }

      value = className.slice(index + 1);
      break;
    }
  }

  let key: string | undefined;

  if (!ruleKeys.length) {
    ruleKeys = Object.keys(airCss.getRules()).sort((a, b) => b.length - a.length);
  }

  for (const ruleKey of ruleKeys) {
    if (value.startsWith(ruleKey + ":") || value === ruleKey) {
      key = ruleKey;
      break;
    }
  }

  if (key) {
    value = value.slice(key.length + 1);
  } else {
    key = value;
  }

  const arbitrary = value.includes("[");
  if (arbitrary) {
    value = value.split("_").join(" ");
  }

  const rule = airCss.getRuleWithKey(key);
  let normalizedValue: string;
  if (rule) {
    normalizedValue = normalizeValue(value, rule, airCss);
  } else {
    normalizedValue = value;
  }

  return { rule, key, value, normalizedValue, hover, media, className, arbitrary };
};
