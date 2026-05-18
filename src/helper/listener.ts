import { doc } from "./document";

export const listen = (pattern: string, callback: (el: HTMLElement, className: string) => void): MutationObserver | undefined => {
  return doc(() => {
    const check = (el: HTMLElement): void => {
      for (const className of Array.from(el.classList)) {
        let matched = false;

        if (pattern === "*") {
          matched = true;

        } else if (pattern.startsWith("*") && pattern.endsWith("*")) {
          const search = pattern.slice(1, -1);
          matched = className.includes(search);

        } else if (pattern.startsWith("*")) {
          const search = pattern.slice(1);
          matched = className.endsWith(search);

        } else if (pattern.endsWith("*")) {
          const search = pattern.slice(0, -1);
          matched = className.startsWith(search);

        } else {
          matched = className === pattern;
        }

        if (matched) {
          callback(el, className);
        }
      }
    };

    for (const el of Array.from(document.querySelectorAll("*"))) {
      check(el as HTMLElement);
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {

        // class changed
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          check(mutation.target as HTMLElement);
        }

        // new nodes added
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) {
              return;
            }

            check(node);

            // если нужны вложенные элементы
            node.querySelectorAll("*").forEach((child) => {
              check(child as HTMLElement);
            });
          });
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [ "class" ],
    });

    return observer;
  });
};
