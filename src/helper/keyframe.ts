import { IKeyframe } from "../types/IKeyframe";

const toKebabCase = (value: string): string => {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export function keyframe(keyframes: IKeyframe): string {
  let css: string = "";
  for (const [ step, styles ] of Object.entries(keyframes)) {
    css += `${step}{`;
    for (const [ property, value ] of Object.entries(styles)) {
      const parsedValue = Array.isArray(value) ? value.join(" ") : value;
      css += `${toKebabCase(property)}:${parsedValue};`;
    }
    css += `}`;
  }

  return css;
}
