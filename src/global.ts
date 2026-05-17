import { AirCss } from "./index";

declare global {
  interface Window {
    AirCss: typeof AirCss;
  }
}

window.AirCss = AirCss;
