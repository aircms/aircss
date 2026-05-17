import { IRule } from "../../types/IRule";
import { AirCss } from "../../index";
import { IExtractedClass } from "../../types/IExtractedClass";
import { buildSelector } from "../../helper/build-selector";

const transforms: Record<string, { func: string, unit?: string | undefined }> = {
  t: { func: "translate", unit: "px" }, // tf:t:X:Y
  tx: { func: "translateX", unit: "px" }, // tf:tx:X
  ty: { func: "translateY", unit: "px" }, // tf:ty:Y
  tz: { func: "translateZ", unit: "px" }, // tf:tz:Z
  t3d: { func: "translate3d", unit: "px" }, // tf:tz:X:Y:Z
  sc: { func: "scale", unit: "" }, // tf:sc:N
  scx: { func: "scaleX", unit: "" },  // tf:scx:N
  scy: { func: "scaleY", unit: "" },// tf:scy:N
  scz: { func: "scaleZ", unit: "" }, // tf:scz:N
  sc3: { func: "scale3d", unit: "" }, // tf:scx:Z:Y:Z
  rt: { func: "rotate", unit: "deg" }, // tf:rt:N
  rtx: { func: "rotateX", unit: "deg" }, // tf:rtx:N
  rty: { func: "rotateY", unit: "deg" }, // tf:rty:N
  rtz: { func: "rotateZ", unit: "deg" }, // tf:rtz:N
  rt3d: { func: "rotate3d" }, // tf:rt3d:X:Y:Z
  skew: { func: "skew", unit: "deg" }, // tf:skew:X:Y
  skewx: { func: "skewX", unit: "deg" }, // tf:skewx:X
  skewy: { func: "skewy", unit: "deg" }, // tf:skewx:Y
  perspective: { func: "perspective", unit: "px" }, // tf:perspective:VALUE
  mat: { func: "matrix", unit: "" }, // tf:mat:A:B:C:D:TX:TY
  mat3d: { func: "matrix3d", unit: "" }, // tf:mat3d:A1:B1:C1:D1:A2:B2:C2:D2:A3:B3:C3:D3:A4:B4:C4:D4
};

const computeValue = (className: string, extractedClassName: IExtractedClass, airCss: AirCss): void => {
  const func = transforms[className].func;
  const unit = transforms[className].unit;

  let value: string;

  if (extractedClassName.arbitrary) {
    value = extractedClassName.value.replace("[", "").replace("]", "");

  } else {
    let value1: Array<string> = [];
    extractedClassName.value.split(":").filter(v1 => v1).forEach((v: string, i: number) => {
      if (className === "rt3d") {
        value1.push(i === 3 ? " " + v + "deg" : " " + v);
      } else {
        value1.push(v + (unit ?? ""));
      }
    });

    value = value1.join(", ");
  }

  const cssPrefix = airCss.getOptions().defaults.cssPrefix;

  airCss.addStyles({
    breakpoint: extractedClassName.media,
    selector: buildSelector(extractedClassName),
    styles: {
      [`--${cssPrefix}-transform-${func}`]: `${func}(${value})`,
    },
  });
};

export const transformArbitrary: IRule = {
  key: "tf",
  styles: {
    "transform": "{value}",
  },
};

export const transformCommon: IRule = {
  init: (airCss: AirCss) => {
    const transforms: Record<string, string> = {
      "perspective": "perspective(100000px)",

      "rotate": "rotate(0deg)",
      "rotateX": "rotateX(0deg)",
      "rotateY": "rotateY(0deg)",
      "rotateZ": "rotateZ(0deg)",
      "rotate3d": "rotate3d(0, 0, 1, 0deg)",

      "skew": "skew(0deg, 0deg)",
      "skewX": "skewX(0deg)",
      "skewY": "skewY(0deg)",

      "scale": "scale(1)",
      "scaleX": "scaleX(1)",
      "scaleY": "scaleY(1)",
      "scaleZ": "scaleZ(1)",
      "scale3d": "scale3d(1, 1, 1)",

      "translate": "translate(0, 0)",
      "translateX": "translateX(0)",
      "translateY": "translateY(0)",
      "translateZ": "translateZ(0)",
      "translate3d": "translate3d(0, 0, 0)",

      "matrix": "matrix(1, 0, 0, 1, 0, 0)",
      "matrix3d": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    };

    const cssTransforms: Array<string> = [];

    Object.entries(transforms).forEach(([ key, value ]) => {
      cssTransforms.push(`var(--${airCss.getOptions().defaults.cssPrefix}-transform-${key}, ${value})`);
    });

    airCss.addStyles({
      selector: "[class*=\"tf:\"]",
      styles: {
        transform: cssTransforms.join(" "),
      },
    });
  },
};

export const transformFunctions: Array<IRule> = Object.entries(transforms).map(([ key, value ]) => ({
  key: "tf:" + key,
  override: (): null => null,
  callback: (a, b, c): void => computeValue(key, b, c),
}));

export const transformPerspective: IRule = {
  key: "perspective",
  styles: {
    "perspective": "{value}",
  },
};

export const transformOrigin: IRule = {
  key: "origin",
  styles: {
    "transform-origin": "{value}",
  },
  values: {
    center: "center",

    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",

    topLeft: "top left",
    topCenter: "top center",
    topRight: "top right",

    centerLeft: "center left",
    centerRight: "center right",

    bottomLeft: "bottom left",
    bottomCenter: "bottom center",
    bottomRight: "bottom right",
  },
};

export const transformStyle: IRule = {
  key: "style",
  styles: {
    "transform-style": "{value}",
  },
  values: {
    "3d": "preserve-3d",
    flat: "flat",
  },
};

export const transformBackfaceVisibility: IRule = {
  key: "backface",
  styles: {
    "backface-visibility": "{value}",
  },
  values: {
    hid: "hidden",
    vis: "visible",
  },
};

