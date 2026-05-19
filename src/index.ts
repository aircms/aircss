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
import { hexToRgb } from "./helper/hexToRgb";
import { extractClassesFromHtml } from "./helper/extract-classes-from-html";

export class AirCss {
  private options: IOptions = defaultOptions;
  private classCache: Record<string, boolean> = {};
  private keyframes: Record<string, string | IKeyframe> = {};
  private classPrefixes: Array<string> = [];
  private rules: Record<string, IRule> = {};
  private staticCss: Record<string, Array<string>> = {};

  private static instance: AirCss | null = null;

  static getInstance(options?: Partial<IOptions>): AirCss {
    if (!this.instance) {
      this.instance = new this(options);
    } else {
      this.instance.setOptions(options);
    }
    return this.instance;
  }

  constructor(options?: Partial<IOptions>) {
    this.setOptions(options);

    this.listen("*", (el: HTMLElement, className: string) => {
      if (this.classCache[className]) {
        return;
      }
      this.classCache[className] = true;
      this.proceedClassName(className, el);
    });
  }

  getStaticCss(html: string): string {

    extractClassesFromHtml(html).forEach((className) => this.proceedClassName(className, null));

    const css: Array<string> = [];

    Object.entries(this.staticCss).forEach(([ id, nodes ]) => {
      let media: string = "";
      if (this.options.defaults.breakpoints?.[id] !== undefined) {
        media = `media="(min-width: ${this.options.defaults.breakpoints[id]}px)"`;
      }
      css.push(`<style id="${id}" ${media}>${(nodes ?? []).join("")}</style>`);
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

  style(id: string, node: string, callback?: (style: HTMLStyleElement) => void): void {
    const styleId = `${this.options.defaults.cssPrefix}-${id}`;

    this.staticCss[styleId] = this.staticCss[styleId] ?? [];
    this.staticCss[styleId].push(node);

    doc(() => style(styleId, (style: HTMLStyleElement) => {
      // callback && callback(style);
      // style.appendChild(document.createTextNode(node));
    }));
  }

  addStyle(media: string | null | undefined, node: string) {
    this.style(media ?? "base", node);
  }

  addStyles(styles: { breakpoint?: string | null, selector: string, styles: Record<string, string | number> }): void {
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
    this.style("colors", css.join("\n"));
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

    this.style("spaces", css.join("\n"));
  }
}

export type { IOptions } from "./types/IOptions";
export type { IDefaults } from "./types/IDefaults";
export type { IRule } from "./types/IRule";
export type { IExtractedClass } from "./types/IExtractedClass";
export type { IKeyframe } from "./types/IKeyframe";
