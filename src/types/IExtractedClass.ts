import { IRule } from "./IRule";

export interface IExtractedClass {
  rule?: IRule;
  className: string;
  key: string;
  value: string;
  normalizedValue: string;
  hover: boolean;
  media: string | null;
  arbitrary: boolean;
}
