export const extractClassesFromHtml = (html: string): string[] => {
  const classes = new Set<string>();

  html.replace(/class=["']([^"']+)["']/g, (_, value) => {
    value.split(/\s+/).forEach((cls: string) => {
      if (cls.trim()) {
        classes.add(cls.trim());
      }
    });
    return "";
  });

  return [ ...classes ];
};
