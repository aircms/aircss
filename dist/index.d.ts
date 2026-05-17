type TDefaultColorName = "emerald" | "green" | "lime" | "red" | "orange" | "amber" | "yellow" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "slate" | "gray" | "zinc" | "neutral" | "stone";
type TColorName = TDefaultColorName | (string & {});
type TColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
type TColorPalette = Partial<Record<TColorShade, string>>;
type TColorValue = TColorName | TColorPalette;
type TColors = Partial<Record<TColorName, TColorValue>>;

interface IDefaults {
    cssPrefix: string;
    units: "px" | "%" | "em" | "rem" | "vw" | "vh" | "dvw" | "dvh" | string;
    color: number;
    animationTimingFunction: string;
    important: boolean;
    grids: number;
    containers: Record<string, number>;
    breakpoints: Record<string, number>;
    spaces: Record<string, Record<string, string>>;
    colors: TColors & {
        primary?: TColorValue;
        secondary?: TColorValue;
    };
}

interface IExtractedClass {
    rule?: IRule;
    className: string;
    key: string;
    value: string;
    normalizedValue: string;
    hover: boolean;
    media: string | null;
    arbitrary: boolean;
}

type TDefaultRule = "width" | "height" | "margin" | "padding" | "border-style" | "border-width" | "border-color" | "border-radius" | "box-shadow" | "opacity" | "transition" | "display" | "aspect-ratio" | "position" | "top" | "end" | "bottom" | "start" | "z-index" | "background-color" | "blur" | "background-image" | "background-gradient" | "background-position" | "color" | "cursor" | "overflow" | "object-fit" | "rotate" | "scale" | "visibility" | "font-size" | "font-weight" | "line-height" | "letter-spacing" | "text-align" | "font-style" | "text-decoration" | "text-transform" | "text-shadow";
interface IRule {
    examples?: Array<string>;
    key?: string;
    styles?: {
        [key: string]: unknown;
    };
    units?: IDefaults["units"];
    values?: {
        [key: string]: any;
    };
    init?: (airCss: AirCss) => void;
    callback?: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss) => void;
    override?: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss) => IExtractedClass | null;
}

interface IOptions {
    defaults: IDefaults;
    rules: Record<string | TDefaultRule, IRule>;
}
interface IUserOptions {
    defaults?: IDefaults;
    rules?: Record<string | TDefaultRule, IRule>;
}

interface IKeyframe {
    [step: string]: {
        [property: string]: string | number | Array<string | number>;
    };
}

declare class AirCss {
    private options;
    private classCache;
    private keyframes;
    private classPrefixes;
    private rules;
    private static instance;
    static setup(options?: IUserOptions): void;
    constructor(options?: IUserOptions);
    getRuleWithKey(key: string): IRule | undefined;
    getClassPrefixes(): Array<string>;
    getRules(): Record<string, IRule>;
    getStyleElement(media: string | null | undefined, callback: (style: HTMLStyleElement) => void): void;
    addStyle(media: string | null | undefined, node: string): void;
    addStyles(styles: {
        breakpoint?: string | null;
        selector: string;
        styles: Record<string, string | number>;
    }): void;
    addKeyframe(name: string, value: string | IKeyframe): void;
    listen(pattern: string, callback: (el: HTMLElement, className: string) => void): MutationObserver | undefined;
    getOptions(): IOptions;
    setOptions(options?: IUserOptions): void;
    getCssColorName(value: string | Array<string>, rgb?: boolean): string | null;
    getCssColorValue(value: string | Array<string>, rgb?: boolean): string | null;
    getCssSpaceName(value: string): string | null;
    getCssSpaceValue(value: string): string | null;
    private initConfig;
    private initClassPrefixes;
    private initRules;
    private initColorVariables;
    private initStyleElements;
    private initSpaceVariables;
}

export { AirCss, type IOptions };
