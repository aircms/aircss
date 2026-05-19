import { IOptions } from "./types/IOptions";
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
import { hexToRgb } from "./helper/hex-to-rgb";
import { extractClassesFromHtml } from "./helper/extract-classes-from-html";
import { hasSelector } from "./helper/has-selector";
import { escape } from "./helper/escape";

export class AirCss {
  private options: IOptions = defaultOptions;
  private classCache: Record<string, boolean> = {};
  private keyframes: Record<string, string | IKeyframe> = {};
  private classPrefixes: Array<string> = [];
  private rules: Record<string, IRule> = {};
  private staticCss: Record<string, Array<string>> = {};

  private static instance: AirCss | null = null;

  static getInstance(options?: Partial<IOptions>): AirCss {
    console.log("AirCss.getInstance");

    if (!this.instance) {
      this.instance = new this(options);
    }
    if (options) {
      this.instance.setOptions(options);
    }
    return this.instance;
  }

  constructor(options?: Partial<IOptions>) {
    console.log("AirCss.constructor");

    this.setOptions(options);

    this.listen("*", (el: HTMLElement, className: string) => {
      if (this.classCache[className]) {
        return;
      }
      this.classCache[className] = true;

      if (!hasSelector("." + escape(className))) {
        // this.proceedClassName(className, el);
      }
    });
  }

  getStaticCss(html: string): string {

    extractClassesFromHtml(html).forEach((className) => this.proceedClassName(className, null));

    const css: Array<string> = [
      `<style id="${this.options.defaults.cssPrefix}-colors">${this.staticCss["colors"]?.join("\n")}</style>`,
      `<style id="${this.options.defaults.cssPrefix}-spaces">${this.staticCss["spaces"]?.join("\n")}</style>`,
      `<style id="${this.options.defaults.cssPrefix}-base">${this.staticCss["base"]?.join("\n")}</style>`,
    ];

    Object.entries(this.options.defaults.breakpoints as {}).forEach(([ name, breakpoint ]) => {
      if (breakpoint) {
        css.push(`<style id="${this.options.defaults.cssPrefix}-${name}" media="(min-width: ${breakpoint}px)">${(this.staticCss[name] ?? []).join("\n")}</style>`);
      }
    });

    return css.join("");
  }

  proceedClassName(className: string, el: HTMLElement | null): void {
    const extractedClass = extractClass(className, this);

    if (!extractedClass.rule) {
      return;
    }

    let value: IExtractedClass | null = extractedClass;

    if (extractedClass.rule.override) {
      value = extractedClass.rule.override(el, extractedClass, this);
    }

    if (extractedClass.rule.callback) {
      extractedClass.rule.callback(el, extractedClass, this);
    }

    if (value) {
      this.addStyle(value.media, computeStyle(value, this));
    }
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

  style(id: string, node: string, callback?: (style: HTMLStyleElement) => void, replace: boolean = false): void {
    const styleId = `${this.options.defaults.cssPrefix}-${id}`;

    this.staticCss[id] = this.staticCss[id] ?? [];
    if (replace) {
      this.staticCss[id] = [ node ];
    } else {
      this.staticCss[id].push(node);
    }

    doc(() => style(styleId, (style: HTMLStyleElement) => {
      callback && callback(style);
      if (replace) {
        style.innerHTML = node;
      } else {
        style.appendChild(document.createTextNode(node));
      }
    }));
  }

  addStyle(media: string | null | undefined, node: string) {
    this.style(media ?? "base", node);
  }

  addStyles(
    styles: {
      breakpoint?: string | null,
      selector: string,
      styles: Record<string, string | number>,
      onlyOne?: boolean
    },
  ): void {
    if (styles.onlyOne && hasSelector(styles.selector)) {
      return;
    }
    this.addStyle(styles.breakpoint, `${styles.selector} { ${Object.entries(styles.styles).map(([ key, value ]) => `${key}: ${value};`).join(" ")} }`);
  }

  addKeyframe(name: string, value: string | IKeyframe): void {
    this.keyframes[name] = value;
    let css: string = "";
    Object.entries(this.keyframes).forEach(([ key, value ]) => {
      css += `@keyframes ${key} { ${typeof value === "string" ? value : keyframe(value)} } `;
    });
    this.style("keyframes", css);
  }

  listen(pattern: string, callback: (el: HTMLElement, className: string) => void): MutationObserver | undefined {
    return doc(() => listen(pattern, (el: HTMLElement, className: string) => callback(el, className)));
  }

  getOptions(): IOptions {
    return this.options;
  }

  setOptions(options?: Partial<IOptions>) {
    this.initConfig(options);
    this.initColorVariables();
    this.initStyleElements();
    this.initSpaceVariables();
    this.initClassPrefixes();
    this.initRules();
  }

  getCssColorName(value: string | Array<string>, rgb: boolean = false): string | null {
    if (typeof value === "string") {
      value = value.split(":");
    }
    value = value.filter((v) => v);
    if (this.getOptions().defaults?.colors?.[value[0]] === undefined) {
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
    if (this.getOptions().defaults.spaces?.[value] === undefined) {
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

  private initConfig(config: Partial<IOptions> = {}): void {
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
    const breakpoints = this.options.defaults.breakpoints ?? {};
    this.classPrefixes = [
      "hov:",
      ...Object.keys(breakpoints).map((key: string) => key + ":"),
      ...Object.keys(breakpoints).map((key: string) => "hov:" + key + ":"),
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

  private initColorVariables(): void {

    const colors = this.options.defaults.colors ?? {};
    const defaultColor = this.options.defaults.color ?? "primary";

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
    this.style("colors", css.join("\n"), undefined, true);
  }

  private initStyleElements(): void {
    const breakpoints = this.options.defaults.breakpoints ?? {};

    this.style("base", "");
    Object.keys(breakpoints).forEach((breakpoint) => {
      this.style(breakpoint, "", (style: HTMLStyleElement) => {
        style.media = `(min-width: ${breakpoints[breakpoint]}px)`;
      });
    });
  }

  private initSpaceVariables(): void {

    const cssPrefix = this.options.defaults.cssPrefix;
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

    this.style("spaces", css.join("\n"), undefined, true);
  }
}

export type { IOptions } from "./types/IOptions";
export type { IDefaults } from "./types/IDefaults";
export type { IRule } from "./types/IRule";
export type { IExtractedClass } from "./types/IExtractedClass";
export type { IKeyframe } from "./types/IKeyframe";
