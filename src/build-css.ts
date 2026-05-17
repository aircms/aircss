import fs from "node:fs";
import { AirCss } from "./index";
import { escape } from "./helper/escape";

const airCss = new AirCss();
const options = airCss.getOptions();
const css = [];

const addToCss = (className: string) => {
  css.push(escape(className));
};

const withVariations = (selector: string) => {
  addToCss(selector);
  addToCss(`hov:${selector}`);

  Object.keys(options.defaults.breakpoints).forEach((breakpoint) => {
    addToCss(`${breakpoint}:${selector}`);
    addToCss(`hov:${breakpoint}:${selector}`);
  });
};

Object.values(options.rules).forEach((rule) => {
  if (rule.key) {
    withVariations((rule.key as string) + ":");
    withVariations((rule.key as string) + ":[_]");

    if (rule.values) {
      Object.keys(rule.values).forEach((value) => {
        withVariations(`${rule.key}:${value}`);
      });
    }
  }
});

Object.keys(options.defaults.colors).forEach((color) => {
  withVariations(`bg:${color}`);
  withVariations(`bc:${color}`);
  withVariations(`radial:${color}:`);
  withVariations(`line:90:${color}:`);
  withVariations(`text:${color}:`);

  for (let i = 1; i <= 9; i++) {
    withVariations(`bg:${color}:${i}00`);
    withVariations(`bc:${color}:${i}00`);
  }
});

withVariations("an:100");
withVariations("an:200");

withVariations("an:100:all");
withVariations("an:200:all");

withVariations("an:100:all:ease");
withVariations("an:200:all:ease");

withVariations("an:dur:100");
withVariations("an:dur:200");

withVariations("an:delay:100");
withVariations("an:delay:200");

withVariations("an:count:1");
withVariations("an:count:2");

addToCss(`cluster:[_]`);
addToCss(`container`);

withVariations("filter:brightness:");
withVariations("filter:contrast:");
withVariations("filter:grayscale:");
withVariations("filter:invert:");
withVariations("filter:saturate:");
withVariations("filter:sepia:");
withVariations("filter:blur:");
withVariations("filter:hue:");
withVariations("filter:drop-shadow:");

withVariations("backdrop:brightness:");
withVariations("backdrop:contrast:");
withVariations("backdrop:grayscale:");
withVariations("backdrop:invert:");
withVariations("backdrop:saturate:");
withVariations("backdrop:sepia:");
withVariations("backdrop:blur:");
withVariations("backdrop:hue:");
withVariations("backdrop:drop-shadow:");

withVariations("grow:0");
withVariations("grow:1");

withVariations("shrink:0");
withVariations("shrink:1");

for (let i = 0; i <= 12; i++) {
  withVariations(`row:${i}`);
  withVariations(`col:${i}`);
}

Object.keys(options.defaults.spaces).forEach((space) => {
  withVariations(`gap:${space}`);
  withVariations(`gap:x:${space}`);
  withVariations(`gap:y:${space}`);

  withVariations(`p:${space}`);
  withVariations(`px:${space}`);
  withVariations(`py:${space}`);
  withVariations(`pt:${space}`);
  withVariations(`pb:${space}`);
  withVariations(`pe:${space}`);
  withVariations(`ps:${space}`);

  withVariations(`m:${space}`);
  withVariations(`mx:${space}`);
  withVariations(`my:${space}`);
  withVariations(`mt:${space}`);
  withVariations(`mb:${space}`);
  withVariations(`ms:${space}`);
  withVariations(`me:${space}`);

  withVariations(`w:${space}`);
  withVariations(`h:${space}`);
});

const variables = fs.readFileSync("./src/variables.css", "utf8");
fs.writeFileSync("./dist/styles.css", variables + "\n." + css.join(", \n.") + "{}");
