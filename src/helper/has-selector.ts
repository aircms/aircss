export const hasSelector = (selector): boolean => {
  try {
    for (const sheet of Array.from(document.styleSheets)) {

      let rules;

      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }

      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) {
          if (rule.selectorText === selector) {
            return true;
          }
        }
      }
    }
  } catch {}

  return false;
};
