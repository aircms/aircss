import { IRule } from "../../types/IRule";
import { AirCss } from "../../index";

export const common: IRule = {
  init: (airCss: AirCss) => {
    airCss.addStyles({
      selector: "*",
      styles: {
        "box-sizing": "border-box",
      },
    });
    airCss.addStyles({
      selector: "html, body",
      styles: {
        margin: 0,
        padding: 0,
      },
    });
  },
};
