export const escape = (className: string): string => {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(className);
  }

  return className
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:")
    .replace(/\./g, "\\.")
    .replace(/#/g, "\\#")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\s/g, "\\ ");
};
