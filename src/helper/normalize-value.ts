import { IRule } from "../types/IRule";
import { AirCss } from "../index";

export const normalizeValue = (value: string, rule: IRule, airCss: AirCss): string => {
  let _value: string | null = null;

  try {
    if (rule.values && rule.values[value]) {
      return rule.values[value];
    }
  } catch {}

  if (value.startsWith("[")) {
    _value = value.replace("[", "").replace("]", "").split("_").join(" ");

  } else if (!isNaN(Number(value))) {
    _value = value + (rule.units !== undefined ? rule.units : airCss.getOptions().defaults.units);
  }

  if (!_value) {
    _value = airCss.getCssColorValue(value, true);
  }

  if (!_value) {
    _value = airCss.getCssSpaceValue(value);
  }

  return _value || value;
};
