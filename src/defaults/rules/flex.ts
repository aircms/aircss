import { IRule } from "../../types/IRule";

export const flexDirection: IRule = {
  key: "flex",
  styles: {
    "flex-direction": "{value}",
  },
  values: {
    col: "column",
    row: "row",
    colRev: "column-reverse",
    rowRev: "row-reverse",
  },
};

export const flexJustify: IRule = {
  key: "justify",
  styles: {
    "justify-content": "{value}",
  },
  values: {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
  },
};

export const flexAlign: IRule = {
  key: "align",
  styles: {
    "align-items": "{value}",
  },
  values: {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    baseline: "baseline",
    stretch: "stretch",
  },
};

export const flexBasis: IRule = {
  key: "basis",
  styles: {
    "flex-basis": "{value}",
  },
  values: {
    a: "auto",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
  },
};

export const flexWrap: IRule = {
  key: "wrap",
  styles: {
    "flex-wrap": "{value}",
  },
  values: {
    yes: "wrap",
    no: "nowrap",
    rev: "wrap-reverse",
  },
};

export const flexOrder: IRule = {
  key: "order",
  styles: {
    "order": "{value}",
  },
  values: {
    first: "-9999",
    last: "9999",
  },
};

export const flexGap: IRule = {
  key: "gap",
  styles: {
    "gap": "{value}",
  },
};

export const flexGapHorizontal: IRule = {
  key: "gap:x",
  styles: {
    "column-gap": "{value}",
  },
};

export const flexGapVertical: IRule = {
  key: "gap:y",
  styles: {
    "row-gap": "{value}",
  },
};

export const flexGrow: IRule = {
  key: "grow",
  styles: {
    "flex-grow": "{value}",
  },
};

export const flexShrink: IRule = {
  key: "shrink",
  styles: {
    "flex-shrink": "{value}",
  },
};

export const flexCenter: IRule = {
  key: "center",
  styles: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
  },
};
