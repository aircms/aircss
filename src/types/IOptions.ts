import { IDefaults } from "./IDefaults";
import { IRule, TDefaultRule } from "./IRule";

export interface IOptions {
  defaults: Partial<IDefaults>;
  rules: Record<string | TDefaultRule, IRule>;
}
