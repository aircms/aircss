import { IRule } from "../../types/IRule";
import { AirCss } from "../../index";
import { IExtractedClass } from "../../types/IExtractedClass";
import { buildSelector } from "../../helper/build-selector";

export const backgroundColor: IRule = {
  key: "bg",
  styles: {
    "background-color": "{value}",
  },
  values: {
    none: "transparent",
  },
  init: (airCss: AirCss) => {
    console.log("backgroundColor::init");
    
    airCss.addStyles({
      selector: "[class*=\"bg:\"]",
      styles: { [`--${airCss.getOptions().defaults.cssPrefix}-background-color-opacity`]: "1" },
      onlyOne: true,
    });
  },
  override: (e, extractedClass: IExtractedClass, airCss: AirCss): IExtractedClass => {
    if (!extractedClass.arbitrary) {
      extractedClass.normalizedValue = `rgba(${extractedClass.normalizedValue}, var(--${airCss.getOptions().defaults.cssPrefix}-background-color-opacity))`;
    }
    return extractedClass;
  },
};

export const backgroundOpacity: IRule = {
  key: "bg:op",
  override: (e, extractedClass: IExtractedClass, airCss: AirCss): null => {
    if (!extractedClass.arbitrary) {
      airCss.addStyles({
        breakpoint: extractedClass.media,
        selector: buildSelector(extractedClass),
        styles: {
          [`--${airCss.getOptions().defaults.cssPrefix}-background-color-opacity`]: (extractedClass.value / 100).toString(),
        },
      });
    }
  },
};

export const backgroundImage: IRule = {
  key: "bg:img",
  styles: {
    "background-image": "url({value})",
  },
};

export const backgroundRepeat: IRule = {
  key: "bg:rep",
  styles: {
    "background-repeat": "{value}",
  },
  values: {
    yes: "repeat",
    no: "no-repeat",
    x: "repeat-x",
    y: "repeat-y",
    space: "space",
    round: "round",
  },
};

export const backgroundPosition: IRule = {
  key: "bg:pos",
  styles: {
    "background-position": "{value}",
  },
  values: {
    center: "center",
    top: "top",
    end: "right",
    bottom: "bottom",
    start: "left",
    ts: "top left",
    te: "top right",
    bs: "bottom left",
    be: "bottom right",
  },
};

export const backgroundSize: IRule = {
  key: "bg:size",
  styles: {
    "background-size": "{value}",
  },
  values: {
    cover: "cover",
    contain: "contain",
    a: "auto",
  },
};

export const backgroundAttachment: IRule = {
  key: "bg:attach",
  styles: {
    "background-attachment": "{value}",
  },
  values: {
    scroll: "scroll",
    fixed: "fixed",
  },
};

export const backgroundOrigin: IRule = {
  key: "bg:origin",
  styles: {
    "background-origin": "{value}",
  },
  values: {
    border: "border-box",
    padding: "padding-box",
    content: "content-box",
  },
};

export const backgroundClip: IRule = {
  key: "bg:clip",
  styles: {
    "background-clip": "{value}",
  },
  values: {
    border: "border-box",
    padding: "padding-box",
    content: "content-box",
    text: "text",
  },
};

export const backgroundBlendMode: IRule = {
  key: "bg:blend",
  styles: {
    "background-blend-mode": "{value}",
  },
  values: {
    norm: "normal",
    multiply: "multiply",
    screen: "screen",
    overlay: "overlay",
    darken: "darken",
    lighten: "lighten",
    colorDodge: "color-dodge",
    colorBurn: "color-burn",
    hardLight: "hard-light",
    softLight: "soft-light",
    difference: "difference",
    exclusion: "exclusion",
    hue: "hue",
    saturation: "saturation",
    color: "color",
    luminosity: "luminosity",
  },
};

