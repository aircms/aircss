import { IRule } from "../../types/IRule";
import { AirCss } from "../../index";

export const container: IRule = {
  key: "container",
  styles: {
    "margin-left": "auto",
    "margin-right": "auto",
  },
  init: (airCss: AirCss) => {
    console.log("container::init");

    const breakpoints = airCss.getOptions().defaults.breakpoints ?? {};
    const containers = airCss.getOptions().defaults.containers;

    Object.keys(breakpoints).forEach((media) => {
      if (containers) {
        
        console.log(media, containers[media]);

        airCss.addStyles({
          breakpoint: typeof containers[media] !== "undefined" ? media : null,
          selector: ".container",
          styles: {
            "max-width": containers[media].toString(),
          },
        });
      }
    });
  },
};
