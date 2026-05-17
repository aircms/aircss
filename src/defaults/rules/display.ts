import { IRule } from "../../types/IRule";

export const display: IRule = {
  key: "d",
  styles: {
    display: "{value}",
  },
  values: {
    none: "none",
    grid: "grid",
    flex: "flex",
    block: "block",
    contents: "contents",
    table: "table",
    inlineBlock: "inline-block",
    inlineGrid: "inline-grid",
    inlineFlex: "inline-flex",
    tableCell: "table-cell",
    tableRow: "table-row",
    tableRowGroup: "table-row-group",
    tableColumn: "table-column",
    tableColumnGroup: "table-column-group",
  },
};
