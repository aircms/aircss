import { IDefaults } from "./IDefaults";
import { IRule, TDefaultRule } from "./IRule";

export interface IOptions {
  defaults: IDefaults;
  rules: Record<string | TDefaultRule, IRule>;
}

export interface IUserOptions {
  defaults?: IDefaults;
  rules?: Record<string | TDefaultRule, IRule>;
}
