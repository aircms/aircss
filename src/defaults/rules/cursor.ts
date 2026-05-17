import { IRule } from "../../types/IRule";

export const cursor: IRule = {
  key: "cursor",
  styles: {
    "cursor": "{value}",
  },
  values: {
    pointer: "pointer",
    default: "default",
    a: "auto",
    text: "text",
    move: "move",
    grab: "grab",
    grabbing: "grabbing",
    notAllowed: "not-allowed",
    wait: "wait",
    progress: "progress",
    crosshair: "crosshair",
    help: "help",
    zoomIn: "zoom-in",
    zoomOut: "zoom-out",
  },
};
