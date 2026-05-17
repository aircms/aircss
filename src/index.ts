import { IOptions, IUserOptions } from "./types/IOptions";
import { defaultOptions } from "./defaults/default-options";
import { listen } from "./helper/listener";
import { IRule } from "./types/IRule";
import { computeStyle } from "./helper/compute-style";
import { style } from "./helper/style";
import { IExtractedClass } from "./types/IExtractedClass";
import { doc } from "./helper/document";
import { IKeyframe } from "./types/IKeyframe";
import { keyframe } from "./helper/keyframe";
import { extractClass } from "./helper/extract-class";
import { hexToRgb } from "./helper/hexToRgb";

export class AirCss {
  private options: IOptions = defaultOptions;
  private classCache: Record<string, boolean> = {};
  private keyframes: Record<string, string | IKeyframe> = {};
  private classPrefixes: Array<string> = [];
  private rules: Record<string, IRule> = {};

  private static instance: AirCss | null = null;

  static setup(options?: IUserOptions): void {
    if (!this.instance) {
      this.instance = new this(options);
    } else {
      this.instance.setOptions(options);
    }
  }

  constructor(options?: IUserOptions) {
    doc(() => {
      this.setOptions(options);

      this.listen("*", (el: HTMLElement, className: string) => {
        if (this.classCache[className]) {
          return;
        }
        this.classCache[className] = true;

        const extractedClass = extractClass(className, this);

        if (!extractedClass.rule) {
          return;
        }

        let value: IExtractedClass | null = extractedClass;

        if (extractedClass.rule.override) {
          value = extractedClass.rule.override(el, extractedClass, this);
        }

        if (value) {
          this.addStyle(value.media, computeStyle(value, this));
        }

        if (extractedClass.rule.callback) {
          extractedClass.rule.callback(el, value || extractedClass, this);
        }
      });
    });
  }

  getRuleWithKey(key: string): IRule | undefined {
    return this.rules[key];
  }

  getClassPrefixes(): Array<string> {
    return this.classPrefixes;
  }

  getRules(): Record<string, IRule> {
    return this.rules;
  }

  getStyleElement(media: string | null | undefined, callback: (style: HTMLStyleElement) => void): void {
    const styleElementId = `${this.options.defaults.cssPrefix}-styles-${media ?? "base"}`;
    style(styleElementId, (style: HTMLStyleElement) => callback(style));
  }

  addStyle(media: string | null | undefined, node: string) {
    this.getStyleElement(media, (style: HTMLStyleElement) => {
      style.appendChild(document.createTextNode(node));
    });
  }

  addStyles(styles: { breakpoint?: string | null, selector: string, styles: Record<string, string | number> }): void {
    this.addStyle(styles.breakpoint, `${styles.selector} { ${Object.entries(styles.styles).map(([ key, value ]) => `${key}: ${value};`).join(" ")} }`);
  }

  addKeyframe(name: string, value: string | IKeyframe): void {
    this.keyframes[name] = value;
    style(`${this.options.defaults.cssPrefix}-keyframes`, (style: HTMLStyleElement) => {
      let css: string = "";
      Object.entries(this.keyframes).forEach(([ key, value ]) => {
        value = typeof value === "string" ? value : keyframe(value);
        css += `@keyframes ${key} { ${value} } `;
      });
      style.innerHTML = css;
    });
  }

  listen(pattern: string, callback: (el: HTMLElement, className: string) => void): MutationObserver | undefined {
    return listen(pattern, (el: HTMLElement, className: string) => callback(el, className));
  }

  getOptions(): IOptions {
    return this.options;
  }

  setOptions(options?: IUserOptions) {
    this.initConfig(options);
    this.initClassPrefixes();
    this.initRules();
    this.initColorVariables();
    this.initStyleElements();
    this.initSpaceVariables();
  }

  getCssColorName(value: string | Array<string>, rgb: boolean = false): string | null {
    if (typeof value === "string") {
      value = value.split(":");
    }
    value = value.filter((v) => v);
    if (this.getOptions().defaults.colors[value[0]] === undefined) {
      return null;
    }

    const name = value.length > 1
      ? `--${this.options.defaults.cssPrefix}-${value[0]}-${value[1]}`
      : `--${this.options.defaults.cssPrefix}-${value[0]}`;

    if (!rgb) {
      return name;
    }
    return `${name}-rgb`;
  }

  getCssColorValue(value: string | Array<string>, rgb: boolean = false): string | null {
    const colorVarName = this.getCssColorName(value, rgb);
    if (!colorVarName) {
      return null;
    }
    return `var(${colorVarName})`;
  }

  getCssSpaceName(value: string): string | null {
    if (this.getOptions().defaults.spaces[value] === undefined) {
      return null;
    }
    return `--${this.options.defaults.cssPrefix}-spacing-${value}`;
  }

  getCssSpaceValue(value: string): string | null {
    const spaceVarName = this.getCssSpaceName(value);
    if (!spaceVarName) {
      return null;
    }
    return `var(${spaceVarName})`;
  }

  private initConfig(config: IUserOptions = {}): void {
    this.options = {
      ...defaultOptions,
      ...config,

      rules: {
        ...(defaultOptions.rules ?? {}),
        ...(config.rules ?? {}),
      },

      defaults: {
        ...defaultOptions.defaults,
        ...config.defaults,

        breakpoints: config.defaults?.breakpoints
          ? config.defaults.breakpoints
          : defaultOptions.defaults?.breakpoints,

        colors: {
          ...(defaultOptions.defaults?.colors ?? {}),
          ...(config.defaults?.colors ?? {}),
        },
      },
    } as IOptions;
  }

  private initClassPrefixes(): void {
    this.classPrefixes = [
      "hov:",
      ...Object.keys(this.options.defaults.breakpoints).map((key: string) => key + ":"),
      ...Object.keys(this.options.defaults.breakpoints).map((key: string) => "hov:" + key + ":"),
    ];
  }

  private initRules(): void {
    this.rules = {};
    Object.entries(this.options.rules).forEach(([ name, rule ]) => {
      rule.init?.(this);
      const key = rule.key ?? Math.random();
      this.rules[key] = rule;
    });
  }

  private initColorVariables() {

    const colors = this.options.defaults.colors;
    const defaultColor = this.options.defaults.color;
    const cssPrefix = this.options.defaults.cssPrefix;

    style(`${cssPrefix}-colors`, (style: HTMLStyleElement) => {
      const css = [ ":root {" ];

      Object.entries(colors).forEach(([ name, value ]) => {
        value = typeof value === "string" ? colors[value] : value;
        if (!value) {
          return;
        }

        css.push(`  ${this.getCssColorName(name)}: ${this.getCssColorValue([ name, defaultColor.toString() ])};`);
        css.push(`  ${this.getCssColorName(name, true)}: ${this.getCssColorValue([ name, defaultColor.toString() ], true)};`);

        Object.entries(value).forEach(([ shade, value ]) => {
          css.push(`  ${this.getCssColorName([ name, shade.toString() ])}: ${value};`);
          css.push(`  ${this.getCssColorName([ name, shade.toString() ], true)}: ${hexToRgb(value as string)};`);
        });
      });

      css.push("}");

      style.innerHTML = css.join("\n");
    });
  }

  private initStyleElements(): void {
    const cssPrefix = this.options.defaults.cssPrefix;
    style(`${cssPrefix}-styles-base`);
    Object.keys(this.options.defaults.breakpoints).forEach((breakpoint) => {
      style(`${cssPrefix}-styles-${breakpoint}`, (style: HTMLStyleElement) => {
        style.media = `(min-width: ${this.options.defaults.breakpoints[breakpoint]}px)`;
      });
    });
  }

  private initSpaceVariables(): void {

    const cssPrefix = this.options.defaults.cssPrefix;

    style(`${cssPrefix}-spaces`, (style: HTMLStyleElement) => {
      const css: string[] = [];
      const breakpoints = this.options.defaults.breakpoints as Record<string, number>;
      const spaces = this.options.defaults.spaces as Record<string, Record<string, string>>;

      Object.entries(breakpoints).forEach(([ breakpointName, breakpointValue ]) => {
        const variables = Object
          .entries(spaces)
          .map(([ spaceName, screens ]) => {
            const value = screens[breakpointName];
            return value ? `--${cssPrefix}-spacing-${spaceName}: ${value}` : "";
          })
          .filter(Boolean)
          .join("; ");

        if (!variables) {
          return;
        }

        if (breakpointValue === 0) {
          css.push(`:root { ${variables}; }`);
        } else {
          css.push(`@media (min-width: ${breakpointValue}px) { :root { ${variables}; } }`);
        }
      });

      style.innerHTML = css.join("\n");
    });
  }
}

export type { IOptions } from "./types/IOptions";


