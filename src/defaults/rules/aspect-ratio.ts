import { IRule } from "../../types/IRule";

export const aspectRatio: IRule = {
  key: "ar",
  styles: {
    "aspect-ratio": "{value}",
  },
  values: {
    "1:1": "1 / 1",
    "4:3": "4 / 3",
    "16:9": "16 / 9",
    "21:9": "21 / 9",
    "2:1": "2 / 1",
    "9:16": "9 / 16",
    "9:21": "9 / 21",
    "3:4": "3 / 4",
    "3:2": "3 / 2",
    "2:3": "2 / 3",
    "1:2": "1 / 2",
  },
};
