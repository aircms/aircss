export const hasSelector = (selector: string): boolean => {
  try {
    for (const sheet of Array.from(document.styleSheets)) {

      let rules: CSSRuleList;

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
