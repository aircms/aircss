import { IExtractedClass } from "./IExtractedClass";
import { IDefaults } from "./IDefaults";
import { AirCss } from "../index";

export type TDefaultRule =
  "width" |
  "height" |
  "margin" |
  "padding" |
  "border-style" |
  "border-width" |
  "border-color" |
  "border-radius" |
  "box-shadow" |
  "opacity" |
  "transition" |
  "display" |
  "aspect-ratio" |
  "position" |
  "top" |
  "end" |
  "bottom" |
  "start" |
  "z-index" |
  "background-color" |
  "blur" |
  "background-image" |
  "background-gradient" |
  "background-position" |
  "color" |
  "cursor" |
  "overflow" |
  "object-fit" |
  "rotate" |
  "scale" |
  "visibility" |
  "font-size" |
  "font-weight" |
  "line-height" |
  "letter-spacing" |
  "text-align" |
  "font-style" |
  "text-decoration" |
  "text-transform" |
  "text-shadow";

export interface IRule {
  examples?: Array<string>;
  key?: string,
  styles?: {
    [key: string]: unknown;
  },
  units?: IDefaults["units"];
  values?: {
    [key: string]: any;
  };
  init?: (airCss: AirCss) => void;
  callback?: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss) => void;
  override?: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss) => IExtractedClass | null;
}
