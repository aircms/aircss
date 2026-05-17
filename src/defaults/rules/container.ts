import { IRule } from "../../types/IRule";
import { AirCss } from "../../index";

export const container: IRule = {
  key: "container",
  styles: {
    "margin-left": "auto",
    "margin-right": "auto",
  },
  init: (airCss: AirCss) => {
    const breakpoints = airCss.getOptions().defaults.breakpoints;
    const containers = airCss.getOptions().defaults.containers;

    Object.keys(breakpoints).forEach((media) => {
      if (typeof containers[media] !== "undefined") {
        airCss.addStyles({
          breakpoint: media,
          selector: ".container",
          styles: {
            "max-width": containers[media].toString(),
          },
        });
      }
    });
  },
};
