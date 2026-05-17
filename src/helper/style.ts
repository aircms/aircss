import { doc } from "./document";

export const style = (id: string, callback?: (HTMLStyleElement) => void): void => {
  doc(() => {
    let styleElement = document.getElementById(id) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = id;
      document.head.appendChild(styleElement);
    }
    if (callback) {
      callback(styleElement);
    }
  });
};
