# AirCss Documentation

Документация сгенерирована строго по исходникам `src/defaults/rules/*.ts`, `default-options.ts`, `index.ts` и helper-файлам. `styles.css` используется только как файл автодополнения для IDE; runtime-правила описаны объектами `IRule`.

## Что такое AirCss

AirCss — runtime CSS utility engine. Он слушает классы в DOM, парсит их, нормализует значение и добавляет CSS в `<style>` элементы.

Основной объект правила — `IRule`:

```ts
export interface IRule {
  examples?: Array<string>;
  key?: string;
  styles?: Record<string, unknown>;
  units?: IDefaults["units"];
  values?: Record<string, any>;
  init?: (airCss: AirCss) => void;
  callback?: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss) => void;
  override?: (el: HTMLElement, extractedClassName: IExtractedClass, airCss: AirCss) => IExtractedClass | null;
}
```

## Подключение и инициализация

```ts
import { AirCss } from "air-css";

AirCss.setup();
```

С настройками:

```ts
AirCss.setup({
  defaults: {
    cssPrefix: "as",
    units: "px",
    important: true,
    color: 500,
    animationTimingFunction: "ease-in-out",
    grids: 12,
    breakpoints: { sm: 0, md: 768, lg: 1024, xl: 1440, xxl: 1640 },
  },
});
```

Повторный вызов `AirCss.setup(options)` не создает новый instance, а вызывает `setOptions(options)` для текущего singleton instance.

## Синтаксис классов

Общий вид:

```txt
[key]:[value]
[breakpoint]:[key]:[value]
hov:[key]:[value]
hov:[breakpoint]:[key]:[value]
```

Примеры:

```html
<div class="w:100"></div>
<div class="md:w:300"></div>
<div class="hov:bg:red"></div>
<div class="hov:md:bg:blue:500"></div>
```

## Нормализация значений

AirCss применяет значения в таком порядке:

1. Если значение найдено в `rule.values`, используется alias.
2. Если значение в квадратных скобках `[ ... ]`, оно используется как arbitrary value. Подчеркивания `_` заменяются на пробелы.
3. Если значение — число, добавляется `rule.units`, если оно задано, иначе `defaults.units`.
4. Если значение совпадает с цветом, используется CSS variable цвета.
5. Если значение совпадает со spacing, используется CSS variable spacing.
6. Иначе значение используется как обычная CSS-строка.

Примеры:

```bash
w:100                     # 100px
w:50%                     # 50%
w:a                       # auto
w:[calc(100%_-_40px)]     # calc(100% - 40px)
bg:red:500                # var(--as-red-500), через rgba для bg/bc
p:md                      # var(--as-spacing-md)
```

## Hover и без Hover

Обычный класс применяется к самому селектору:

```html
<div class="bg:red"></div>
```

Hover-класс создается с `:hover`:

```html
<div class="hov:bg:red"></div>
```

Будет построен селектор вида `.hov\:bg\:red:hover`.

## Breakpoints

Breakpoints берутся из `defaults.breakpoints`:

| Name | Min width |
|---|---|
| `sm` | `0px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1440px` |
| `xxl` | `1640px` |

Для каждого breakpoint создается отдельный `<style>` с `media="(min-width: ...px)"`.

```html
<div class="md:w:300 lg:w:500"></div>
```

## Colors System

Цвета задаются в `defaults.colors`. Доступные имена по умолчанию:

```txt
primary, secondary, emerald, green, lime, red, orange, amber, yellow, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, slate, gray, zinc, neutral, stone
```

Доступные shades:

```txt
100, 200, 300, 400, 500, 600, 700, 800, 900
```

`primary` по умолчанию ссылается на `blue`, `secondary` — на `purple`.

Для каждого цвета создаются переменные:

```css
--as-blue
--as-blue-rgb
--as-blue-500
--as-blue-500-rgb
```

Примеры:

```html
<div class="bg:primary"></div>
<div class="bg:blue:600"></div>
<div class="text:red:500"></div>
<div class="bc:emerald:400"></div>
```

Кастомные цвета:

```ts
AirCss.setup({
  defaults: {
    colors: {
      brand: {
        100: "#dbeafe",
        500: "#3b82f6",
        900: "#1e3a8a",
      },
    },
  },
});
```

## Spacing System

Spacing задается в `defaults.spaces`. Это responsive CSS variables. Имена spacing по умолчанию: `sm`, `md`, `lg`, `xl`, `xxl`.

| Spacing | sm screen | md screen | lg screen | xl screen | xxl screen |
|---|---:|---:|---:|---:|---:|
| `sm` | 2px | 4px | 6px | 8px | 10px |
| `md` | 4px | 8px | 12px | 16px | 20px |
| `lg` | 6px | 12px | 18px | 24px | 30px |
| `xl` | 8px | 16px | 24px | 32px | 40px |
| `xxl` | 10px | 20px | 30px | 40px | 50px |

Примеры:

```html
<div class="p:md"></div>
<div class="m:xl"></div>
<div class="gap:lg"></div>
```

## Default Settings

```ts
defaults: {
  grids: 12,
  breakpoints: { sm: 0, md: 768, lg: 1024, xl: 1440, xxl: 1640 },
  containers: { sm: "100%", md: "720px", lg: "1000px", xl: "1200px", xxl: "1540px" },
  animationTimingFunction: "ease-in-out",
  units: "px",
  cssPrefix: "as",
  important: true,
  color: 500,
}
```

# Rules Reference

Каждая секция ниже соответствует файлу/группе правил из `src/defaults/rules/*.ts`. В каждом правиле `key` — это префикс класса, `values` — список alias-значений.

## Width

### `w` — `width`

**Styles:**

- `width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
w:[number]        # number + units
w:[number+unit]   # explicit CSS unit/value
w:[alias]         # alias from values
w:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `auto` |
| `f` | `100%` |
| `min` | `min-content` |
| `max` | `max-content` |
| `fit` | `fit-content` |

**Examples:**

```bash
w:100 - 100px by default
w:a - auto
w:f - 100%
w:min - min-content
w:max - max-content
w:[calc(100%_-_40px)] - arbitrary value
```

### `w:min` — `minWidth`

**Styles:**

- `min-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
w:min:[number]        # number + units
w:min:[number+unit]   # explicit CSS unit/value
w:min:[alias]         # alias from values
w:min:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `auto` |
| `f` | `100%` |

**Examples:**

```bash
w:min:100 - 100px by default
w:min:a - auto
w:min:f - 100%
w:min:[calc(100%_-_40px)] - arbitrary value
```

### `w:max` — `maxWidth`

**Styles:**

- `max-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
w:max:[number]        # number + units
w:max:[number+unit]   # explicit CSS unit/value
w:max:[alias]         # alias from values
w:max:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `auto` |
| `f` | `100%` |

**Examples:**

```bash
w:max:100 - 100px by default
w:max:a - auto
w:max:f - 100%
w:max:[calc(100%_-_40px)] - arbitrary value
```

## Height

### `h` — `height`

**Styles:**

- `height: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
h:[number]        # number + units
h:[number+unit]   # explicit CSS unit/value
h:[alias]         # alias from values
h:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `f` | `100%` |
| `a` | `auto` |

**Examples:**

```bash
h:100 - 100px by default
h:f - 100%
h:a - auto
h:[calc(100%_-_40px)] - arbitrary value
```

### `h:min` — `minHeight`

**Styles:**

- `min-height: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** `h:min:a` currently maps to `{value}` in source, so it behaves like a raw alias placeholder.

**Usage:**

```txt
h:min:[number]        # number + units
h:min:[number+unit]   # explicit CSS unit/value
h:min:[alias]         # alias from values
h:min:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `{value}` |
| `f` | `100%` |

**Examples:**

```bash
h:min:100 - 100px by default
h:min:a - {value}
h:min:f - 100%
h:min:[calc(100%_-_40px)] - arbitrary value
```

### `h:max` — `maxHeight`

**Styles:**

- `max-height: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
h:max:[number]        # number + units
h:max:[number+unit]   # explicit CSS unit/value
h:max:[alias]         # alias from values
h:max:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `f` | `100%` |
| `a` | `auto` |

**Examples:**

```bash
h:max:100 - 100px by default
h:max:f - 100%
h:max:a - auto
h:max:[calc(100%_-_40px)] - arbitrary value
```

## Margin

### `m` — `margin`

**Styles:**

- `margin: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
m:[number]        # number + units
m:[number+unit]   # explicit CSS unit/value
m:[alias]         # alias from values
m:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
m:100 - 100px by default
m:i - initial
m:a - auto
m:[calc(100%_-_40px)] - arbitrary value
```

### `mx` — `marginHorizontal`

**Styles:**

- `margin-left: {value}`
- `margin-right: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
mx:[number]        # number + units
mx:[number+unit]   # explicit CSS unit/value
mx:[alias]         # alias from values
mx:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
mx:100 - 100px by default
mx:i - initial
mx:a - auto
mx:[calc(100%_-_40px)] - arbitrary value
```

### `my` — `marginVertical`

**Styles:**

- `margin-top: {value}`
- `margin-bottom: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
my:[number]        # number + units
my:[number+unit]   # explicit CSS unit/value
my:[alias]         # alias from values
my:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
my:100 - 100px by default
my:i - initial
my:a - auto
my:[calc(100%_-_40px)] - arbitrary value
```

### `mt` — `marginTop`

**Styles:**

- `margin-top: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
mt:[number]        # number + units
mt:[number+unit]   # explicit CSS unit/value
mt:[alias]         # alias from values
mt:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
mt:100 - 100px by default
mt:i - initial
mt:a - auto
mt:[calc(100%_-_40px)] - arbitrary value
```

### `mb` — `marginBottom`

**Styles:**

- `margin-bottom: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
mb:[number]        # number + units
mb:[number+unit]   # explicit CSS unit/value
mb:[alias]         # alias from values
mb:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
mb:100 - 100px by default
mb:i - initial
mb:a - auto
mb:[calc(100%_-_40px)] - arbitrary value
```

### `ms` — `marginStart`

**Styles:**

- `margin-left: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ms:[number]        # number + units
ms:[number+unit]   # explicit CSS unit/value
ms:[alias]         # alias from values
ms:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
ms:100 - 100px by default
ms:i - initial
ms:a - auto
ms:[calc(100%_-_40px)] - arbitrary value
```

### `me` — `marginEnd`

**Styles:**

- `margin-right: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
me:[number]        # number + units
me:[number+unit]   # explicit CSS unit/value
me:[alias]         # alias from values
me:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |
| `a` | `auto` |

**Examples:**

```bash
me:100 - 100px by default
me:i - initial
me:a - auto
me:[calc(100%_-_40px)] - arbitrary value
```

## Padding

### `p` — `padding`

**Styles:**

- `padding: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
p:[number]        # number + units
p:[number+unit]   # explicit CSS unit/value
p:[alias]         # alias from values
p:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
p:100 - 100px by default
p:i - initial
p:[calc(100%_-_40px)] - arbitrary value
```

### `px` — `paddingHorizontal`

**Styles:**

- `padding-left: {value}`
- `padding-right: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
px:[number]        # number + units
px:[number+unit]   # explicit CSS unit/value
px:[alias]         # alias from values
px:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
px:100 - 100px by default
px:i - initial
px:[calc(100%_-_40px)] - arbitrary value
```

### `py` — `paddingVertical`

**Styles:**

- `padding-top: {value}`
- `padding-bottom: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
py:[number]        # number + units
py:[number+unit]   # explicit CSS unit/value
py:[alias]         # alias from values
py:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
py:100 - 100px by default
py:i - initial
py:[calc(100%_-_40px)] - arbitrary value
```

### `pt` — `paddingTop`

**Styles:**

- `padding-top: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
pt:[number]        # number + units
pt:[number+unit]   # explicit CSS unit/value
pt:[alias]         # alias from values
pt:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
pt:100 - 100px by default
pt:i - initial
pt:[calc(100%_-_40px)] - arbitrary value
```

### `pb` — `paddingBottom`

**Styles:**

- `padding-bottom: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
pb:[number]        # number + units
pb:[number+unit]   # explicit CSS unit/value
pb:[alias]         # alias from values
pb:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
pb:100 - 100px by default
pb:i - initial
pb:[calc(100%_-_40px)] - arbitrary value
```

### `ps` — `paddingStart`

**Styles:**

- `padding-left: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ps:[number]        # number + units
ps:[number+unit]   # explicit CSS unit/value
ps:[alias]         # alias from values
ps:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
ps:100 - 100px by default
ps:i - initial
ps:[calc(100%_-_40px)] - arbitrary value
```

### `pe` — `paddingEnd`

**Styles:**

- `padding-right: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
pe:[number]        # number + units
pe:[number+unit]   # explicit CSS unit/value
pe:[alias]         # alias from values
pe:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `i` | `initial` |

**Examples:**

```bash
pe:100 - 100px by default
pe:i - initial
pe:[calc(100%_-_40px)] - arbitrary value
```

## Border

### `bst` — `borderStyle`

**Styles:**

- `border-style: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bst:[number]        # number + units
bst:[number+unit]   # explicit CSS unit/value
bst:[alias]         # alias from values
bst:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `none` |
| `solid` | `solid` |
| `dashed` | `dashed` |
| `dotted` | `dotted` |

**Examples:**

```bash
bst:100 - 100px by default
bst:none - none
bst:solid - solid
bst:dashed - dashed
bst:dotted - dotted
bst:[calc(100%_-_40px)] - arbitrary value
```

### `bw` — `borderWidth`

**Styles:**

- `border-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bw:[number]        # number + units
bw:[number+unit]   # explicit CSS unit/value
bw:[alias]         # alias from values
bw:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bw:100 - 100px by default
bw:[calc(100%_-_40px)] - arbitrary value
```

### `bw:t` — `borderWidthTop`

**Styles:**

- `border-top-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bw:t:[number]        # number + units
bw:t:[number+unit]   # explicit CSS unit/value
bw:t:[alias]         # alias from values
bw:t:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bw:t:100 - 100px by default
bw:t:[calc(100%_-_40px)] - arbitrary value
```

### `bw:b` — `borderWidthBottom`

**Styles:**

- `border-bottom-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bw:b:[number]        # number + units
bw:b:[number+unit]   # explicit CSS unit/value
bw:b:[alias]         # alias from values
bw:b:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bw:b:100 - 100px by default
bw:b:[calc(100%_-_40px)] - arbitrary value
```

### `bw:s` — `borderWidthStart`

**Styles:**

- `border-left-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bw:s:[number]        # number + units
bw:s:[number+unit]   # explicit CSS unit/value
bw:s:[alias]         # alias from values
bw:s:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bw:s:100 - 100px by default
bw:s:[calc(100%_-_40px)] - arbitrary value
```

### `bw:e` — `borderWidthEnd`

**Styles:**

- `border-right-width: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bw:e:[number]        # number + units
bw:e:[number+unit]   # explicit CSS unit/value
bw:e:[alias]         # alias from values
bw:e:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bw:e:100 - 100px by default
bw:e:[calc(100%_-_40px)] - arbitrary value
```

### `bc` — `borderColor`

**Styles:**

- `border-color: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Color values are converted to `rgba(..., var(--as-border-color-opacity))`. Also initializes border width/style for `[class*="bc:"]`.

**Usage:**

```txt
bc:[number]        # number + units
bc:[number+unit]   # explicit CSS unit/value
bc:[alias]         # alias from values
bc:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `transparent` |
| `inherit` | `inherit` |
| `initial` | `initial` |

**Examples:**

```bash
bc:red - default shade color
bc:red:500 - specific shade
bc:none - alias if defined
bc:[rgba(0,0,0,.5)] - arbitrary value
```

### `bc:op` — `borderOpacity`

**Styles:**

- `--as-border-color-opacity: value / 100`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Special callback rule. Example: `bc:op:50` sets border color opacity to `0.5`.

**Usage:**

```txt
bc:op:[number]        # number + units
bc:op:[number+unit]   # explicit CSS unit/value
bc:op:[alias]         # alias from values
bc:op:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bc:op:50 - opacity 0.5
bc:op:100 - opacity 1
```

### `br` — `borderRadius`

**Styles:**

- `border-radius: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
br:[number]        # number + units
br:[number+unit]   # explicit CSS unit/value
br:[alias]         # alias from values
br:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `circle` | `50%` |
| `pill` | `999px` |

**Examples:**

```bash
br:100 - 100px by default
br:circle - 50%
br:pill - 999px
br:[calc(100%_-_40px)] - arbitrary value
```

### `br:te` — `borderRadiusTopEnd`

**Styles:**

- `border-top-right-radius: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
br:te:[number]        # number + units
br:te:[number+unit]   # explicit CSS unit/value
br:te:[alias]         # alias from values
br:te:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `circle` | `50%` |
| `pill` | `999px` |

**Examples:**

```bash
br:te:100 - 100px by default
br:te:circle - 50%
br:te:pill - 999px
br:te:[calc(100%_-_40px)] - arbitrary value
```

### `br:be` — `borderRadiusBottomEnd`

**Styles:**

- `border-bottom-right-radius: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
br:be:[number]        # number + units
br:be:[number+unit]   # explicit CSS unit/value
br:be:[alias]         # alias from values
br:be:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `circle` | `50%` |
| `pill` | `999px` |

**Examples:**

```bash
br:be:100 - 100px by default
br:be:circle - 50%
br:be:pill - 999px
br:be:[calc(100%_-_40px)] - arbitrary value
```

### `br:bs` — `borderRadiusBottomStart`

**Styles:**

- `border-bottom-left-radius: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
br:bs:[number]        # number + units
br:bs:[number+unit]   # explicit CSS unit/value
br:bs:[alias]         # alias from values
br:bs:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `circle` | `50%` |
| `pill` | `999px` |

**Examples:**

```bash
br:bs:100 - 100px by default
br:bs:circle - 50%
br:bs:pill - 999px
br:bs:[calc(100%_-_40px)] - arbitrary value
```

### `br:ts` — `borderRadiusTopStart`

**Styles:**

- `border-top-left-radius: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
br:ts:[number]        # number + units
br:ts:[number+unit]   # explicit CSS unit/value
br:ts:[alias]         # alias from values
br:ts:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `circle` | `50%` |
| `pill` | `999px` |

**Examples:**

```bash
br:ts:100 - 100px by default
br:ts:circle - 50%
br:ts:pill - 999px
br:ts:[calc(100%_-_40px)] - arbitrary value
```

## Display

### `d` — `display`

**Styles:**

- `display: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
d:[number]        # number + units
d:[number+unit]   # explicit CSS unit/value
d:[alias]         # alias from values
d:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `none` |
| `grid` | `grid` |
| `flex` | `flex` |
| `block` | `block` |
| `contents` | `contents` |
| `table` | `table` |
| `inlineBlock` | `inline-block` |
| `inlineGrid` | `inline-grid` |
| `inlineFlex` | `inline-flex` |
| `tableCell` | `table-cell` |
| `tableRow` | `table-row` |
| `tableRowGroup` | `table-row-group` |
| `tableColumn` | `table-column` |
| `tableColumnGroup` | `table-column-group` |

**Examples:**

```bash
d:100 - 100px by default
d:none - none
d:grid - grid
d:flex - flex
d:block - block
d:[calc(100%_-_40px)] - arbitrary value
```

## Flex

### `flex` — `flexDirection`

**Styles:**

- `flex-direction: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
flex:[number]        # number + units
flex:[number+unit]   # explicit CSS unit/value
flex:[alias]         # alias from values
flex:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `col` | `column` |
| `row` | `row` |
| `colRev` | `column-reverse` |
| `rowRev` | `row-reverse` |

**Examples:**

```bash
flex:100 - 100px by default
flex:col - column
flex:row - row
flex:colRev - column-reverse
flex:rowRev - row-reverse
flex:[calc(100%_-_40px)] - arbitrary value
```

### `justify` — `flexJustify`

**Styles:**

- `justify-content: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
justify:[number]        # number + units
justify:[number+unit]   # explicit CSS unit/value
justify:[alias]         # alias from values
justify:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `start` | `flex-start` |
| `end` | `flex-end` |
| `center` | `center` |
| `between` | `space-between` |
| `around` | `space-around` |

**Examples:**

```bash
justify:100 - 100px by default
justify:start - flex-start
justify:end - flex-end
justify:center - center
justify:between - space-between
justify:[calc(100%_-_40px)] - arbitrary value
```

### `align` — `flexAlign`

**Styles:**

- `align-items: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
align:[number]        # number + units
align:[number+unit]   # explicit CSS unit/value
align:[alias]         # alias from values
align:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `start` | `flex-start` |
| `end` | `flex-end` |
| `center` | `center` |
| `baseline` | `baseline` |
| `stretch` | `stretch` |

**Examples:**

```bash
align:100 - 100px by default
align:start - flex-start
align:end - flex-end
align:center - center
align:baseline - baseline
align:[calc(100%_-_40px)] - arbitrary value
```

### `basis` — `flexBasis`

**Styles:**

- `flex-basis: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
basis:[number]        # number + units
basis:[number+unit]   # explicit CSS unit/value
basis:[alias]         # alias from values
basis:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `auto` |
| `min` | `min-content` |
| `max` | `max-content` |
| `fit` | `fit-content` |

**Examples:**

```bash
basis:100 - 100px by default
basis:a - auto
basis:min - min-content
basis:max - max-content
basis:fit - fit-content
basis:[calc(100%_-_40px)] - arbitrary value
```

### `wrap` — `flexWrap`

**Styles:**

- `flex-wrap: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
wrap:[number]        # number + units
wrap:[number+unit]   # explicit CSS unit/value
wrap:[alias]         # alias from values
wrap:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `yes` | `wrap` |
| `no` | `nowrap` |
| `rev` | `wrap-reverse` |

**Examples:**

```bash
wrap:100 - 100px by default
wrap:yes - wrap
wrap:no - nowrap
wrap:rev - wrap-reverse
wrap:[calc(100%_-_40px)] - arbitrary value
```

### `order` — `flexOrder`

**Styles:**

- `order: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
order:[number]        # number + units
order:[number+unit]   # explicit CSS unit/value
order:[alias]         # alias from values
order:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `first` | `-9999` |
| `last` | `9999` |

**Examples:**

```bash
order:100 - 100px by default
order:first - -9999
order:last - 9999
order:[calc(100%_-_40px)] - arbitrary value
```

### `gap` — `flexGap`

**Styles:**

- `gap: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
gap:[number]        # number + units
gap:[number+unit]   # explicit CSS unit/value
gap:[alias]         # alias from values
gap:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
gap:100 - 100px by default
gap:[calc(100%_-_40px)] - arbitrary value
```

### `gap:x` — `flexGapHorizontal`

**Styles:**

- `column-gap: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
gap:x:[number]        # number + units
gap:x:[number+unit]   # explicit CSS unit/value
gap:x:[alias]         # alias from values
gap:x:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
gap:x:100 - 100px by default
gap:x:[calc(100%_-_40px)] - arbitrary value
```

### `gap:y` — `flexGapVertical`

**Styles:**

- `row-gap: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
gap:y:[number]        # number + units
gap:y:[number+unit]   # explicit CSS unit/value
gap:y:[alias]         # alias from values
gap:y:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
gap:y:100 - 100px by default
gap:y:[calc(100%_-_40px)] - arbitrary value
```

### `grow` — `flexGrow`

**Styles:**

- `flex-grow: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
grow:[number]        # number + units
grow:[number+unit]   # explicit CSS unit/value
grow:[alias]         # alias from values
grow:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
grow:100 - 100px by default
grow:[calc(100%_-_40px)] - arbitrary value
```

### `shrink` — `flexShrink`

**Styles:**

- `flex-shrink: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
shrink:[number]        # number + units
shrink:[number+unit]   # explicit CSS unit/value
shrink:[alias]         # alias from values
shrink:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
shrink:100 - 100px by default
shrink:[calc(100%_-_40px)] - arbitrary value
```

### `center` — `flexCenter`

**Styles:**

- `display: flex`
- `justify-content: center`
- `align-items: center`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Static helper rule. Use `center` without value.

**Usage:**

```txt
center:[number]        # number + units
center:[number+unit]   # explicit CSS unit/value
center:[alias]         # alias from values
center:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
center
```

## Position

### `pos` — `position`

**Styles:**

- `position: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
pos:[number]        # number + units
pos:[number+unit]   # explicit CSS unit/value
pos:[alias]         # alias from values
pos:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `rel` | `relative` |
| `abs` | `absolute` |
| `fix` | `fixed` |
| `sti` | `sticky` |
| `sta` | `static` |
| `init` | `initial` |

**Examples:**

```bash
pos:100 - 100px by default
pos:rel - relative
pos:abs - absolute
pos:fix - fixed
pos:sti - sticky
pos:[calc(100%_-_40px)] - arbitrary value
```

### `z` — `positionZIndex`

**Styles:**

- `z-index: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
z:[number]        # number + units
z:[number+unit]   # explicit CSS unit/value
z:[alias]         # alias from values
z:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
z:100 - 100px by default
z:[calc(100%_-_40px)] - arbitrary value
```

### `t` — `positionTop`

**Styles:**

- `top: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
t:[number]        # number + units
t:[number+unit]   # explicit CSS unit/value
t:[alias]         # alias from values
t:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
t:100 - 100px by default
t:[calc(100%_-_40px)] - arbitrary value
```

### `e` — `positionEnd`

**Styles:**

- `right: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
e:[number]        # number + units
e:[number+unit]   # explicit CSS unit/value
e:[alias]         # alias from values
e:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
e:100 - 100px by default
e:[calc(100%_-_40px)] - arbitrary value
```

### `b` — `positionBottom`

**Styles:**

- `bottom: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
b:[number]        # number + units
b:[number+unit]   # explicit CSS unit/value
b:[alias]         # alias from values
b:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
b:100 - 100px by default
b:[calc(100%_-_40px)] - arbitrary value
```

### `s` — `positionStart`

**Styles:**

- `left: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
s:[number]        # number + units
s:[number+unit]   # explicit CSS unit/value
s:[alias]         # alias from values
s:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
s:100 - 100px by default
s:[calc(100%_-_40px)] - arbitrary value
```

## Background

### `bg` — `backgroundColor`

**Styles:**

- `background-color: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Color values are converted to `rgba(..., var(--as-background-color-opacity))`. Arbitrary values are used as-is.

**Usage:**

```txt
bg:[number]        # number + units
bg:[number+unit]   # explicit CSS unit/value
bg:[alias]         # alias from values
bg:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `transparent` |

**Examples:**

```bash
bg:red - default shade color
bg:red:500 - specific shade
bg:none - alias if defined
bg:[rgba(0,0,0,.5)] - arbitrary value
```

### `bg:op` — `backgroundOpacity`

**Styles:**

- `--as-background-color-opacity: value / 100`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Special callback rule. Example: `bg:op:50` sets background opacity to `0.5`.

**Usage:**

```txt
bg:op:[number]        # number + units
bg:op:[number+unit]   # explicit CSS unit/value
bg:op:[alias]         # alias from values
bg:op:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bg:op:50 - opacity 0.5
bg:op:100 - opacity 1
```

### `bg:img` — `backgroundImage`

**Styles:**

- `background-image: url({value})`
- `background-size: cover`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:img:[number]        # number + units
bg:img:[number+unit]   # explicit CSS unit/value
bg:img:[alias]         # alias from values
bg:img:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
bg:img:[https://example.com/image.jpg] - url(...) + background-size: cover
```

### `bg:rep` — `backgroundRepeat`

**Styles:**

- `background-repeat: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:rep:[number]        # number + units
bg:rep:[number+unit]   # explicit CSS unit/value
bg:rep:[alias]         # alias from values
bg:rep:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `yes` | `repeat` |
| `no` | `no-repeat` |
| `x` | `repeat-x` |
| `y` | `repeat-y` |
| `space` | `space` |
| `round` | `round` |

**Examples:**

```bash
bg:rep:100 - 100px by default
bg:rep:yes - repeat
bg:rep:no - no-repeat
bg:rep:x - repeat-x
bg:rep:y - repeat-y
bg:rep:[calc(100%_-_40px)] - arbitrary value
```

### `bg:pos` — `backgroundPosition`

**Styles:**

- `background-position: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:pos:[number]        # number + units
bg:pos:[number+unit]   # explicit CSS unit/value
bg:pos:[alias]         # alias from values
bg:pos:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `center` | `center` |
| `top` | `top` |
| `end` | `right` |
| `bottom` | `bottom` |
| `start` | `left` |
| `ts` | `top left` |
| `te` | `top right` |
| `bs` | `bottom left` |
| `be` | `bottom right` |

**Examples:**

```bash
bg:pos:100 - 100px by default
bg:pos:center - center
bg:pos:top - top
bg:pos:end - right
bg:pos:bottom - bottom
bg:pos:[calc(100%_-_40px)] - arbitrary value
```

### `bg:size` — `backgroundSize`

**Styles:**

- `background-size: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:size:[number]        # number + units
bg:size:[number+unit]   # explicit CSS unit/value
bg:size:[alias]         # alias from values
bg:size:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `cover` | `cover` |
| `contain` | `contain` |
| `a` | `auto` |

**Examples:**

```bash
bg:size:100 - 100px by default
bg:size:cover - cover
bg:size:contain - contain
bg:size:a - auto
bg:size:[calc(100%_-_40px)] - arbitrary value
```

### `bg:attach` — `backgroundAttachment`

**Styles:**

- `background-attachment: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:attach:[number]        # number + units
bg:attach:[number+unit]   # explicit CSS unit/value
bg:attach:[alias]         # alias from values
bg:attach:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `scroll` | `scroll` |
| `fixed` | `fixed` |

**Examples:**

```bash
bg:attach:100 - 100px by default
bg:attach:scroll - scroll
bg:attach:fixed - fixed
bg:attach:[calc(100%_-_40px)] - arbitrary value
```

### `bg:origin` — `backgroundOrigin`

**Styles:**

- `background-origin: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:origin:[number]        # number + units
bg:origin:[number+unit]   # explicit CSS unit/value
bg:origin:[alias]         # alias from values
bg:origin:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `border` | `border-box` |
| `padding` | `padding-box` |
| `content` | `content-box` |

**Examples:**

```bash
bg:origin:100 - 100px by default
bg:origin:border - border-box
bg:origin:padding - padding-box
bg:origin:content - content-box
bg:origin:[calc(100%_-_40px)] - arbitrary value
```

### `bg:clip` — `backgroundClip`

**Styles:**

- `background-clip: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:clip:[number]        # number + units
bg:clip:[number+unit]   # explicit CSS unit/value
bg:clip:[alias]         # alias from values
bg:clip:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `border` | `border-box` |
| `padding` | `padding-box` |
| `content` | `content-box` |
| `text` | `text` |

**Examples:**

```bash
bg:clip:100 - 100px by default
bg:clip:border - border-box
bg:clip:padding - padding-box
bg:clip:content - content-box
bg:clip:text - text
bg:clip:[calc(100%_-_40px)] - arbitrary value
```

### `bg:blend` — `backgroundBlendMode`

**Styles:**

- `background-blend-mode: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
bg:blend:[number]        # number + units
bg:blend:[number+unit]   # explicit CSS unit/value
bg:blend:[alias]         # alias from values
bg:blend:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `norm` | `normal` |
| `multiply` | `multiply` |
| `screen` | `screen` |
| `overlay` | `overlay` |
| `darken` | `darken` |
| `lighten` | `lighten` |
| `colorDodge` | `color-dodge` |
| `colorBurn` | `color-burn` |
| `hardLight` | `hard-light` |
| `softLight` | `soft-light` |
| `difference` | `difference` |
| `exclusion` | `exclusion` |
| `hue` | `hue` |
| `saturation` | `saturation` |
| `color` | `color` |
| `luminosity` | `luminosity` |

**Examples:**

```bash
bg:blend:100 - 100px by default
bg:blend:norm - normal
bg:blend:multiply - multiply
bg:blend:screen - screen
bg:blend:overlay - overlay
bg:blend:[calc(100%_-_40px)] - arbitrary value
```

## Text

### `text` — `textColor`

**Styles:**

- `color: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
text:[number]        # number + units
text:[number+unit]   # explicit CSS unit/value
text:[alias]         # alias from values
text:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `initial` | `initial` |
| `inherit` | `inherit` |

**Examples:**

```bash
text:red - default shade color
text:red:500 - specific shade
text:none - alias if defined
text:[rgba(0,0,0,.5)] - arbitrary value
```

### `fw` — `textFontWeight`

**Styles:**

- `font-weight: {value}`

**Units:** ``

**Usage:**

```txt
fw:[number]        # number + units
fw:[number+unit]   # explicit CSS unit/value
fw:[alias]         # alias from values
fw:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `thin` | `100` |
| `extralight` | `200` |
| `light` | `300` |
| `normal` | `400` |
| `medium` | `500` |
| `semibold` | `600` |
| `bold` | `700` |
| `extrabold` | `800` |
| `black` | `900` |

**Examples:**

```bash
fw:1 - value without unit
fw:thin - 100
fw:extralight - 200
fw:light - 300
fw:normal - 400
fw:[calc(100%_-_40px)] - arbitrary value
```

### `ta` — `textAlign`

**Styles:**

- `text-align: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ta:[number]        # number + units
ta:[number+unit]   # explicit CSS unit/value
ta:[alias]         # alias from values
ta:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `start` | `left` |
| `center` | `center` |
| `end` | `right` |
| `justify` | `justify` |

**Examples:**

```bash
ta:100 - 100px by default
ta:start - left
ta:center - center
ta:end - right
ta:justify - justify
ta:[calc(100%_-_40px)] - arbitrary value
```

### `fst` — `textFontStyle`

**Styles:**

- `font-style: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
fst:[number]        # number + units
fst:[number+unit]   # explicit CSS unit/value
fst:[alias]         # alias from values
fst:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `it` | `italic` |
| `norm` | `normal` |

**Examples:**

```bash
fst:100 - 100px by default
fst:it - italic
fst:norm - normal
fst:[calc(100%_-_40px)] - arbitrary value
```

### `tt` — `textTransform`

**Styles:**

- `text-transform: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
tt:[number]        # number + units
tt:[number+unit]   # explicit CSS unit/value
tt:[alias]         # alias from values
tt:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `uppercase` | `uppercase` |
| `lowercase` | `lowercase` |
| `capitalize` | `capitalize` |

**Examples:**

```bash
tt:100 - 100px by default
tt:uppercase - uppercase
tt:lowercase - lowercase
tt:capitalize - capitalize
tt:[calc(100%_-_40px)] - arbitrary value
```

### `td` — `textDecoration`

**Styles:**

- `text-decoration: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
td:[number]        # number + units
td:[number+unit]   # explicit CSS unit/value
td:[alias]         # alias from values
td:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `underline` | `underline` |
| `lineThrough` | `line-through` |
| `overline` | `overline` |
| `none` | `none` |

**Examples:**

```bash
td:100 - 100px by default
td:underline - underline
td:lineThrough - line-through
td:overline - overline
td:none - none
td:[calc(100%_-_40px)] - arbitrary value
```

### `lh` — `textLineHeight`

**Styles:**

- `line-height: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
lh:[number]        # number + units
lh:[number+unit]   # explicit CSS unit/value
lh:[alias]         # alias from values
lh:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
lh:100 - 100px by default
lh:[calc(100%_-_40px)] - arbitrary value
```

### `fs` — `textFontSize`

**Styles:**

- `font-size: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
fs:[number]        # number + units
fs:[number+unit]   # explicit CSS unit/value
fs:[alias]         # alias from values
fs:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
fs:100 - 100px by default
fs:[calc(100%_-_40px)] - arbitrary value
```

### `ls` — `textLetterSpacing`

**Styles:**

- `letter-spacing: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ls:[number]        # number + units
ls:[number+unit]   # explicit CSS unit/value
ls:[alias]         # alias from values
ls:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
ls:100 - 100px by default
ls:[calc(100%_-_40px)] - arbitrary value
```

## Opacity

### `op` — `opacity`

**Styles:**

- `opacity: {value}`

**Units:** ``

**Usage:**

```txt
op:[number]        # number + units
op:[number+unit]   # explicit CSS unit/value
op:[alias]         # alias from values
op:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
op:1 - value without unit
op:[calc(100%_-_40px)] - arbitrary value
```

## Overflow

### `ov` — `overflow`

**Styles:**

- `overflow: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ov:[number]        # number + units
ov:[number+unit]   # explicit CSS unit/value
ov:[alias]         # alias from values
ov:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `vis` | `visible` |
| `hid` | `hidden` |
| `scroll` | `scroll` |
| `a` | `auto` |

**Examples:**

```bash
ov:100 - 100px by default
ov:vis - visible
ov:hid - hidden
ov:scroll - scroll
ov:a - auto
ov:[calc(100%_-_40px)] - arbitrary value
```

### `ov:x` — `overflowX`

**Styles:**

- `overflow-x: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ov:x:[number]        # number + units
ov:x:[number+unit]   # explicit CSS unit/value
ov:x:[alias]         # alias from values
ov:x:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `vis` | `visible` |
| `hid` | `hidden` |
| `scroll` | `scroll` |
| `a` | `auto` |

**Examples:**

```bash
ov:x:100 - 100px by default
ov:x:vis - visible
ov:x:hid - hidden
ov:x:scroll - scroll
ov:x:a - auto
ov:x:[calc(100%_-_40px)] - arbitrary value
```

### `ov:y` — `overflowY`

**Styles:**

- `overflow-y: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ov:y:[number]        # number + units
ov:y:[number+unit]   # explicit CSS unit/value
ov:y:[alias]         # alias from values
ov:y:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `vis` | `visible` |
| `hid` | `hidden` |
| `scroll` | `scroll` |
| `a` | `auto` |

**Examples:**

```bash
ov:y:100 - 100px by default
ov:y:vis - visible
ov:y:hid - hidden
ov:y:scroll - scroll
ov:y:a - auto
ov:y:[calc(100%_-_40px)] - arbitrary value
```

## Cursor

### `cursor` — `cursor`

**Styles:**

- `cursor: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
cursor:[number]        # number + units
cursor:[number+unit]   # explicit CSS unit/value
cursor:[alias]         # alias from values
cursor:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `pointer` | `pointer` |
| `default` | `default` |
| `a` | `auto` |
| `text` | `text` |
| `move` | `move` |
| `grab` | `grab` |
| `grabbing` | `grabbing` |
| `notAllowed` | `not-allowed` |
| `wait` | `wait` |
| `progress` | `progress` |
| `crosshair` | `crosshair` |
| `help` | `help` |
| `zoomIn` | `zoom-in` |
| `zoomOut` | `zoom-out` |

**Examples:**

```bash
cursor:100 - 100px by default
cursor:pointer - pointer
cursor:default - default
cursor:a - auto
cursor:text - text
cursor:[calc(100%_-_40px)] - arbitrary value
```

## Object Fit

### `of` — `objectFit`

**Styles:**

- `object-fit: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
of:[number]        # number + units
of:[number+unit]   # explicit CSS unit/value
of:[alias]         # alias from values
of:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `cover` | `cover` |
| `contain` | `contain` |
| `fill` | `fill` |
| `none` | `none` |
| `scaleDown` | `scale-down` |

**Examples:**

```bash
of:100 - 100px by default
of:cover - cover
of:contain - contain
of:fill - fill
of:none - none
of:[calc(100%_-_40px)] - arbitrary value
```

## Aspect Ratio

### `ar` — `aspectRatio`

**Styles:**

- `aspect-ratio: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ar:[number]        # number + units
ar:[number+unit]   # explicit CSS unit/value
ar:[alias]         # alias from values
ar:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `1:1` | `1 / 1` |
| `4:3` | `4 / 3` |
| `16:9` | `16 / 9` |
| `21:9` | `21 / 9` |
| `2:1` | `2 / 1` |
| `9:16` | `9 / 16` |
| `9:21` | `9 / 21` |
| `3:4` | `3 / 4` |
| `3:2` | `3 / 2` |
| `2:3` | `2 / 3` |
| `1:2` | `1 / 2` |

**Examples:**

```bash
ar:100 - 100px by default
ar:1:1 - 1 / 1
ar:4:3 - 4 / 3
ar:16:9 - 16 / 9
ar:21:9 - 21 / 9
ar:[calc(100%_-_40px)] - arbitrary value
```

## Rotate / Scale CSS Properties

### `rot` — `rotate`

**Styles:**

- `rotate: {value}`

**Units:** `deg`

**Note:** Uses CSS individual `rotate` property, not `transform: rotate(...)`.

**Usage:**

```txt
rot:[number]        # number + units
rot:[number+unit]   # explicit CSS unit/value
rot:[alias]         # alias from values
rot:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
rot:100 - 100deg
rot:[calc(100%_-_40px)] - arbitrary value
```

### `scale` — `scale`

**Styles:**

- `scale: {value}`

**Units:** ``

**Note:** Uses CSS individual `scale` property, not `transform: scale(...)`.

**Usage:**

```txt
scale:[number]        # number + units
scale:[number+unit]   # explicit CSS unit/value
scale:[alias]         # alias from values
scale:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
scale:1 - value without unit
scale:[calc(100%_-_40px)] - arbitrary value
```

## Grid Row / Col

### `row` — `row`

**Styles:**

- `display: grid`
- `grid-template-columns: repeat({value}, minmax(0,1fr))`

**Units:** ``

**Note:** If class is just `row`, it uses `defaults.grids`.

**Usage:**

```txt
row:[number]        # number + units
row:[number+unit]   # explicit CSS unit/value
row:[alias]         # alias from values
row:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `auto-fit` |

**Examples:**

```bash
row - default grid columns from defaults.grids
row:3 - repeat(3, minmax(0,1fr))
row:a - repeat(auto-fit, minmax(0,1fr))
```

### `col` — `col`

**Styles:**

- `grid-column: span {value}`

**Units:** ``

**Note:** `col:a` and `col:f` are handled by override.

**Usage:**

```txt
col:[number]        # number + units
col:[number+unit]   # explicit CSS unit/value
col:[alias]         # alias from values
col:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `span 1` |
| `f` | `1 / -1` |

**Examples:**

```bash
col:6 - grid-column: span 6
col:a - grid-column: span 1
col:f - grid-column: 1 / -1
```

## Container / Cluster

### `container` — `container`

**Styles:**

- `margin-left: auto`
- `margin-right: auto`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Also generates responsive `max-width` from `defaults.containers` for every breakpoint.

**Usage:**

```txt
container:[number]        # number + units
container:[number+unit]   # explicit CSS unit/value
container:[alias]         # alias from values
container:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
container
```

### `cluster` — `cluster`

**Styles:**

- `display: flex`
- `flex-wrap: wrap`
- `gap: {value}`
- `align-items: center`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
cluster:[number]        # number + units
cluster:[number+unit]   # explicit CSS unit/value
cluster:[alias]         # alias from values
cluster:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
cluster:100 - 100px by default
cluster:[calc(100%_-_40px)] - arbitrary value
```

## Filter

### `filter` — `filter`

**Styles:**

- `filter: composed from CSS variables`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Syntax is `filter:[name]:[value]`. Supported names in source: blur, brightness, contrast, grayscale, hue/hue-rotate, invert, opacity, saturate, sepia, drop-shadow.

**Usage:**

```txt
filter:[number]        # number + units
filter:[number+unit]   # explicit CSS unit/value
filter:[alias]         # alias from values
filter:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
filter:blur:100 - blur(10px)
filter:brightness:120 - brightness(120%)
filter:hue:90 - hue-rotate(90deg)
filter:blur:[12px] - arbitrary value
```

### `backdrop` — `backdrop`

**Styles:**

- `backdrop-filter: composed from CSS variables`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Syntax is `backdrop:[name]:[value]`. Supported names in source: blur, brightness, contrast, grayscale, hue/hue-rotate, invert, opacity, saturate, sepia.

**Usage:**

```txt
backdrop:[number]        # number + units
backdrop:[number+unit]   # explicit CSS unit/value
backdrop:[alias]         # alias from values
backdrop:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
backdrop:blur:100 - blur(10px)
backdrop:brightness:120 - brightness(120%)
backdrop:hue:90 - hue-rotate(90deg)
backdrop:blur:[12px] - arbitrary value
```

## Gradient

### `radial` — `gradientRadial`

**Styles:**

- `background: radial-gradient(...)`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Non-arbitrary value is parsed as color list: `radial:red:blue`. Arbitrary value is used as raw background value.

**Usage:**

```txt
radial:[number]        # number + units
radial:[number+unit]   # explicit CSS unit/value
radial:[alias]         # alias from values
radial:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
radial:red:blue - radial-gradient(circle, red, blue)
radial:primary:secondary
radial:[circle,_red,_blue] - arbitrary raw value
```

### `line` — `gradientLinear`

**Styles:**

- `background: linear-gradient(...)`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Non-arbitrary syntax: `line:[deg]:[color1]:[color2]`. Example: `line:90:red:blue`.

**Usage:**

```txt
line:[number]        # number + units
line:[number+unit]   # explicit CSS unit/value
line:[alias]         # alias from values
line:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
line:90:red:blue - linear-gradient(90deg, red, blue)
line:180:primary:secondary
line:[90deg,_red,_blue] - arbitrary raw value
```

## Shadow

### `sh:b` — `boxShadow`

**Styles:**

- `box-shadow: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Non-arbitrary color syntax: `sh:b:20:blue:500` => `0px 0px 20px 0px var(--as-blue-500)`.

**Usage:**

```txt
sh:b:[number]        # number + units
sh:b:[number+unit]   # explicit CSS unit/value
sh:b:[alias]         # alias from values
sh:b:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `none` |

**Examples:**

```bash
sh:b:none - none
sh:b:20:blue:500 - 0px 0px 20px 0px var(--as-blue-500)
sh:b:[0_0_20px_rgba(0,0,0,.3)] - arbitrary value
```

### `sh:t` — `textShadow`

**Styles:**

- `text-shadow: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Non-arbitrary color syntax: `sh:t:10:red:500` => `0px 0px 10px var(--as-red-500)`.

**Usage:**

```txt
sh:t:[number]        # number + units
sh:t:[number+unit]   # explicit CSS unit/value
sh:t:[alias]         # alias from values
sh:t:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
sh:t:10:red:500 - 0px 0px 10px var(--as-red-500)
sh:t:[1px_1px_2px_black] - arbitrary value
```

## Transform

### `tf` — `transformArbitrary`

**Styles:**

- `transform: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Raw transform value. Example: `tf:[translateX(10px)_rotate(45deg)]`.

**Usage:**

```txt
tf:[number]        # number + units
tf:[number+unit]   # explicit CSS unit/value
tf:[alias]         # alias from values
tf:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:[translateX(20px)_rotate(45deg)] - raw transform
```

### `tf:t` — `transformTranslate`

**Styles:**

- `--as-transform-translate: translate(...)`

**Units:** `px`

**Note:** Composed into one global transform rule for `[class*="tf:"]`.

**Usage:**

```txt
tf:t:[number]        # number + units
tf:t:[number+unit]   # explicit CSS unit/value
tf:t:[alias]         # alias from values
tf:t:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:t:100 - default units for this transform function
tf:t:[custom value] - arbitrary raw function arguments
```

### `tf:tx` — `transformTranslateX`

**Styles:**

- `--as-transform-translateX: translateX(...)`

**Units:** `px`

**Usage:**

```txt
tf:tx:[number]        # number + units
tf:tx:[number+unit]   # explicit CSS unit/value
tf:tx:[alias]         # alias from values
tf:tx:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:tx:100 - default units for this transform function
tf:tx:[custom value] - arbitrary raw function arguments
```

### `tf:ty` — `transformTranslateY`

**Styles:**

- `--as-transform-translateY: translateY(...)`

**Units:** `px`

**Usage:**

```txt
tf:ty:[number]        # number + units
tf:ty:[number+unit]   # explicit CSS unit/value
tf:ty:[alias]         # alias from values
tf:ty:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:ty:100 - default units for this transform function
tf:ty:[custom value] - arbitrary raw function arguments
```

### `tf:tz` — `transformTranslateZ`

**Styles:**

- `--as-transform-translateZ: translateZ(...)`

**Units:** `px`

**Usage:**

```txt
tf:tz:[number]        # number + units
tf:tz:[number+unit]   # explicit CSS unit/value
tf:tz:[alias]         # alias from values
tf:tz:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:tz:100 - default units for this transform function
tf:tz:[custom value] - arbitrary raw function arguments
```

### `tf:t3d` — `transformTranslate3d`

**Styles:**

- `--as-transform-translate3d: translate3d(...)`

**Units:** `px`

**Usage:**

```txt
tf:t3d:[number]        # number + units
tf:t3d:[number+unit]   # explicit CSS unit/value
tf:t3d:[alias]         # alias from values
tf:t3d:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:t3d:100 - default units for this transform function
tf:t3d:[custom value] - arbitrary raw function arguments
```

### `tf:sc` — `transformScale`

**Styles:**

- `--as-transform-scale: scale(...)`

**Units:** ``

**Usage:**

```txt
tf:sc:[number]        # number + units
tf:sc:[number+unit]   # explicit CSS unit/value
tf:sc:[alias]         # alias from values
tf:sc:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:sc:100 - default units for this transform function
tf:sc:[custom value] - arbitrary raw function arguments
```

### `tf:scx` — `transformScaleX`

**Styles:**

- `--as-transform-scaleX: scaleX(...)`

**Units:** ``

**Usage:**

```txt
tf:scx:[number]        # number + units
tf:scx:[number+unit]   # explicit CSS unit/value
tf:scx:[alias]         # alias from values
tf:scx:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:scx:100 - default units for this transform function
tf:scx:[custom value] - arbitrary raw function arguments
```

### `tf:scy` — `transformScaleY`

**Styles:**

- `--as-transform-scaleY: scaleY(...)`

**Units:** ``

**Usage:**

```txt
tf:scy:[number]        # number + units
tf:scy:[number+unit]   # explicit CSS unit/value
tf:scy:[alias]         # alias from values
tf:scy:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:scy:100 - default units for this transform function
tf:scy:[custom value] - arbitrary raw function arguments
```

### `tf:scz` — `transformScaleZ`

**Styles:**

- `--as-transform-scaleZ: scaleZ(...)`

**Units:** ``

**Usage:**

```txt
tf:scz:[number]        # number + units
tf:scz:[number+unit]   # explicit CSS unit/value
tf:scz:[alias]         # alias from values
tf:scz:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:scz:100 - default units for this transform function
tf:scz:[custom value] - arbitrary raw function arguments
```

### `tf:sc3` — `transformScale3d`

**Styles:**

- `--as-transform-scale3d: scale3d(...)`

**Units:** ``

**Usage:**

```txt
tf:sc3:[number]        # number + units
tf:sc3:[number+unit]   # explicit CSS unit/value
tf:sc3:[alias]         # alias from values
tf:sc3:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:sc3:100 - default units for this transform function
tf:sc3:[custom value] - arbitrary raw function arguments
```

### `tf:rt` — `transformRotate`

**Styles:**

- `--as-transform-rotate: rotate(...)`

**Units:** `deg`

**Usage:**

```txt
tf:rt:[number]        # number + units
tf:rt:[number+unit]   # explicit CSS unit/value
tf:rt:[alias]         # alias from values
tf:rt:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:rt:100 - default units for this transform function
tf:rt:[custom value] - arbitrary raw function arguments
```

### `tf:rtx` — `transformRotateX`

**Styles:**

- `--as-transform-rotateX: rotateX(...)`

**Units:** `deg`

**Usage:**

```txt
tf:rtx:[number]        # number + units
tf:rtx:[number+unit]   # explicit CSS unit/value
tf:rtx:[alias]         # alias from values
tf:rtx:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:rtx:100 - default units for this transform function
tf:rtx:[custom value] - arbitrary raw function arguments
```

### `tf:rty` — `transformRotateY`

**Styles:**

- `--as-transform-rotateY: rotateY(...)`

**Units:** `deg`

**Usage:**

```txt
tf:rty:[number]        # number + units
tf:rty:[number+unit]   # explicit CSS unit/value
tf:rty:[alias]         # alias from values
tf:rty:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:rty:100 - default units for this transform function
tf:rty:[custom value] - arbitrary raw function arguments
```

### `tf:rtz` — `transformRotateZ`

**Styles:**

- `--as-transform-rotateZ: rotateZ(...)`

**Units:** `deg`

**Usage:**

```txt
tf:rtz:[number]        # number + units
tf:rtz:[number+unit]   # explicit CSS unit/value
tf:rtz:[alias]         # alias from values
tf:rtz:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:rtz:100 - default units for this transform function
tf:rtz:[custom value] - arbitrary raw function arguments
```

### `tf:rt3d` — `transformRotate3d`

**Styles:**

- `--as-transform-rotate3d: rotate3d(...)`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Fourth argument receives `deg` in non-arbitrary syntax.

**Usage:**

```txt
tf:rt3d:[number]        # number + units
tf:rt3d:[number+unit]   # explicit CSS unit/value
tf:rt3d:[alias]         # alias from values
tf:rt3d:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:rt3d:100 - default units for this transform function
tf:rt3d:[custom value] - arbitrary raw function arguments
```

### `tf:skew` — `transformSkew`

**Styles:**

- `--as-transform-skew: skew(...)`

**Units:** `deg`

**Usage:**

```txt
tf:skew:[number]        # number + units
tf:skew:[number+unit]   # explicit CSS unit/value
tf:skew:[alias]         # alias from values
tf:skew:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:skew:100 - default units for this transform function
tf:skew:[custom value] - arbitrary raw function arguments
```

### `tf:skewx` — `transformSkewX`

**Styles:**

- `--as-transform-skewX: skewX(...)`

**Units:** `deg`

**Usage:**

```txt
tf:skewx:[number]        # number + units
tf:skewx:[number+unit]   # explicit CSS unit/value
tf:skewx:[alias]         # alias from values
tf:skewx:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:skewx:100 - default units for this transform function
tf:skewx:[custom value] - arbitrary raw function arguments
```

### `tf:skewy` — `transformSkewY`

**Styles:**

- `--as-transform-skewy: skewy(...)`

**Units:** `deg`

**Note:** Source function name is `skewy`, lower-case y.

**Usage:**

```txt
tf:skewy:[number]        # number + units
tf:skewy:[number+unit]   # explicit CSS unit/value
tf:skewy:[alias]         # alias from values
tf:skewy:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:skewy:100 - default units for this transform function
tf:skewy:[custom value] - arbitrary raw function arguments
```

### `tf:perspective` — `transformPerspectiveFunc`

**Styles:**

- `--as-transform-perspective: perspective(...)`

**Units:** `px`

**Note:** This is transform function perspective.

**Usage:**

```txt
tf:perspective:[number]        # number + units
tf:perspective:[number+unit]   # explicit CSS unit/value
tf:perspective:[alias]         # alias from values
tf:perspective:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:perspective:100 - default units for this transform function
tf:perspective:[custom value] - arbitrary raw function arguments
```

### `tf:mat` — `transformMatrix`

**Styles:**

- `--as-transform-matrix: matrix(...)`

**Units:** ``

**Usage:**

```txt
tf:mat:[number]        # number + units
tf:mat:[number+unit]   # explicit CSS unit/value
tf:mat:[alias]         # alias from values
tf:mat:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:mat:100 - default units for this transform function
tf:mat:[custom value] - arbitrary raw function arguments
```

### `tf:mat3d` — `transformMatrix3d`

**Styles:**

- `--as-transform-matrix3d: matrix3d(...)`

**Units:** ``

**Usage:**

```txt
tf:mat3d:[number]        # number + units
tf:mat3d:[number+unit]   # explicit CSS unit/value
tf:mat3d:[alias]         # alias from values
tf:mat3d:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
tf:mat3d:100 - default units for this transform function
tf:mat3d:[custom value] - arbitrary raw function arguments
```

### `perspective` — `transformPerspective`

**Styles:**

- `perspective: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** This is CSS `perspective` property.

**Usage:**

```txt
perspective:[number]        # number + units
perspective:[number+unit]   # explicit CSS unit/value
perspective:[alias]         # alias from values
perspective:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
perspective:100 - 100px by default
perspective:[calc(100%_-_40px)] - arbitrary value
```

### `origin` — `transformOrigin`

**Styles:**

- `transform-origin: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
origin:[number]        # number + units
origin:[number+unit]   # explicit CSS unit/value
origin:[alias]         # alias from values
origin:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `center` | `center` |
| `top` | `top` |
| `bottom` | `bottom` |
| `left` | `left` |
| `right` | `right` |
| `topLeft` | `top left` |
| `topCenter` | `top center` |
| `topRight` | `top right` |
| `centerLeft` | `center left` |
| `centerRight` | `center right` |
| `bottomLeft` | `bottom left` |
| `bottomCenter` | `bottom center` |
| `bottomRight` | `bottom right` |

**Examples:**

```bash
origin:100 - 100px by default
origin:center - center
origin:top - top
origin:bottom - bottom
origin:left - left
origin:[calc(100%_-_40px)] - arbitrary value
```

### `style` — `transformStyle`

**Styles:**

- `transform-style: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
style:[number]        # number + units
style:[number+unit]   # explicit CSS unit/value
style:[alias]         # alias from values
style:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `3d` | `preserve-3d` |
| `flat` | `flat` |

**Examples:**

```bash
style:100 - 100px by default
style:3d - preserve-3d
style:flat - flat
style:[calc(100%_-_40px)] - arbitrary value
```

### `backface` — `transformBackfaceVisibility`

**Styles:**

- `backface-visibility: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
backface:[number]        # number + units
backface:[number+unit]   # explicit CSS unit/value
backface:[alias]         # alias from values
backface:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `hid` | `hidden` |
| `vis` | `visible` |

**Examples:**

```bash
backface:100 - 100px by default
backface:hid - hidden
backface:vis - visible
backface:[calc(100%_-_40px)] - arbitrary value
```

## Animation

### `an` — `animation`

**Styles:**

- `animation: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Non-arbitrary syntax: `an:[duration-ms]:[name]` or `an:[duration-ms]:[name]:[timing-function]`. It becomes `[name] [duration]ms [timing]`.

**Usage:**

```txt
an:[number]        # number + units
an:[number+unit]   # explicit CSS unit/value
an:[alias]         # alias from values
an:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
an:600:fadeIn - animation: fadeIn 600ms ease-in-out
an:600:fadeIn:linear - animation: fadeIn 600ms linear
an:[fadeIn_600ms_linear_infinite] - arbitrary full animation value
```

### `an:dur` — `animationDuration`

**Styles:**

- `animation-duration: {value}`

**Units:** `ms`

**Usage:**

```txt
an:dur:[number]        # number + units
an:dur:[number+unit]   # explicit CSS unit/value
an:dur:[alias]         # alias from values
an:dur:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
an:dur:100 - 100ms
an:dur:[calc(100%_-_40px)] - arbitrary value
```

### `an:func` — `animationTimingFunction`

**Styles:**

- `animation-timing-function: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:func:[number]        # number + units
an:func:[number+unit]   # explicit CSS unit/value
an:func:[alias]         # alias from values
an:func:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `ease` | `ease` |
| `line` | `linear` |
| `in` | `ease-in` |
| `out` | `ease-out` |
| `inOut` | `ease-in-out` |
| `start` | `step-start` |
| `end` | `step-end` |

**Examples:**

```bash
an:func:100 - 100px by default
an:func:ease - ease
an:func:line - linear
an:func:in - ease-in
an:func:out - ease-out
an:func:[calc(100%_-_40px)] - arbitrary value
```

### `an:delay` — `animationDelay`

**Styles:**

- `animation-delay: {value}`

**Units:** `ms`

**Usage:**

```txt
an:delay:[number]        # number + units
an:delay:[number+unit]   # explicit CSS unit/value
an:delay:[alias]         # alias from values
an:delay:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
an:delay:100 - 100ms
an:delay:[calc(100%_-_40px)] - arbitrary value
```

### `an:count` — `animationIterationCount`

**Styles:**

- `animation-iteration-count: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:count:[number]        # number + units
an:count:[number+unit]   # explicit CSS unit/value
an:count:[alias]         # alias from values
an:count:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `inf` | `infinite` |

**Examples:**

```bash
an:count:100 - 100px by default
an:count:inf - infinite
an:count:[calc(100%_-_40px)] - arbitrary value
```

### `an:dir` — `animationDirection`

**Styles:**

- `animation-direction: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:dir:[number]        # number + units
an:dir:[number+unit]   # explicit CSS unit/value
an:dir:[alias]         # alias from values
an:dir:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `norm` | `normal` |
| `rev` | `reverse` |
| `alt` | `alternate` |
| `altRev` | `alternate-reverse` |

**Examples:**

```bash
an:dir:100 - 100px by default
an:dir:norm - normal
an:dir:rev - reverse
an:dir:alt - alternate
an:dir:altRev - alternate-reverse
an:dir:[calc(100%_-_40px)] - arbitrary value
```

### `an:fill` — `animationFillMode`

**Styles:**

- `animation-fill-mode: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:fill:[number]        # number + units
an:fill:[number+unit]   # explicit CSS unit/value
an:fill:[alias]         # alias from values
an:fill:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `none` |
| `forward` | `forwards` |
| `back` | `backwards` |
| `both` | `both` |

**Examples:**

```bash
an:fill:100 - 100px by default
an:fill:none - none
an:fill:forward - forwards
an:fill:back - backwards
an:fill:both - both
an:fill:[calc(100%_-_40px)] - arbitrary value
```

### `an:state` — `animationPlayState`

**Styles:**

- `animation-play-state: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:state:[number]        # number + units
an:state:[number+unit]   # explicit CSS unit/value
an:state:[alias]         # alias from values
an:state:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `pause` | `paused` |
| `play` | `running` |

**Examples:**

```bash
an:state:100 - 100px by default
an:state:pause - paused
an:state:play - running
an:state:[calc(100%_-_40px)] - arbitrary value
```

### `an:time` — `animationTimeline`

**Styles:**

- `animation-timeline: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:time:[number]        # number + units
an:time:[number+unit]   # explicit CSS unit/value
an:time:[alias]         # alias from values
an:time:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `a` | `auto` |
| `scroll` | `scroll()` |
| `view` | `view()` |

**Examples:**

```bash
an:time:100 - 100px by default
an:time:a - auto
an:time:scroll - scroll()
an:time:view - view()
an:time:[calc(100%_-_40px)] - arbitrary value
```

### `an:range` — `animationRange`

**Styles:**

- `animation-range: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:range:[number]        # number + units
an:range:[number+unit]   # explicit CSS unit/value
an:range:[alias]         # alias from values
an:range:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `norm` | `normal` |
| `cover` | `cover` |
| `contain` | `contain` |
| `entry` | `entry` |
| `exit` | `exit` |
| `entryCross` | `entry-crossing` |
| `exitCross` | `exit-crossing` |

**Examples:**

```bash
an:range:100 - 100px by default
an:range:norm - normal
an:range:cover - cover
an:range:contain - contain
an:range:entry - entry
an:range:[calc(100%_-_40px)] - arbitrary value
```

### `an:comp` — `animationComposite`

**Styles:**

- `animation-composite: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
an:comp:[number]        # number + units
an:comp:[number+unit]   # explicit CSS unit/value
an:comp:[alias]         # alias from values
an:comp:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `add` | `additive` |
| `rep` | `replace` |
| `acc` | `accumulate` |

**Examples:**

```bash
an:comp:100 - 100px by default
an:comp:add - additive
an:comp:rep - replace
an:comp:acc - accumulate
an:comp:[calc(100%_-_40px)] - arbitrary value
```

## Transition

### `ts` — `transition`

**Styles:**

- `transition-property: all`
- `transition-duration: {value}`

**Units:** `ms`

**Usage:**

```txt
ts:[number]        # number + units
ts:[number+unit]   # explicit CSS unit/value
ts:[alias]         # alias from values
ts:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
ts:100 - 100ms
ts:[calc(100%_-_40px)] - arbitrary value
```

### `ts:prop` — `transitionProperty`

**Styles:**

- `transition-property: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ts:prop:[number]        # number + units
ts:prop:[number+unit]   # explicit CSS unit/value
ts:prop:[alias]         # alias from values
ts:prop:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `none` | `none` |
| `all` | `all` |

**Examples:**

```bash
ts:prop:100 - 100px by default
ts:prop:none - none
ts:prop:all - all
ts:prop:[calc(100%_-_40px)] - arbitrary value
```

### `ts:dur` — `transitionDuration`

**Styles:**

- `transition-duration: {value}`

**Units:** `ms`

**Usage:**

```txt
ts:dur:[number]        # number + units
ts:dur:[number+unit]   # explicit CSS unit/value
ts:dur:[alias]         # alias from values
ts:dur:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
ts:dur:100 - 100ms
ts:dur:[calc(100%_-_40px)] - arbitrary value
```

### `ts:beh` — `transitionBehavior`

**Styles:**

- `transition-behavior: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ts:beh:[number]        # number + units
ts:beh:[number+unit]   # explicit CSS unit/value
ts:beh:[alias]         # alias from values
ts:beh:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `allow` | `allow-discrete` |
| `normal` | `normal` |

**Examples:**

```bash
ts:beh:100 - 100px by default
ts:beh:allow - allow-discrete
ts:beh:normal - normal
ts:beh:[calc(100%_-_40px)] - arbitrary value
```

### `ts:func` — `transitionTimingFunction`

**Styles:**

- `transition-timing-function: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ts:func:[number]        # number + units
ts:func:[number+unit]   # explicit CSS unit/value
ts:func:[alias]         # alias from values
ts:func:[arbitrary]     # raw value inside []
```

**Aliases:**

| Alias | CSS value |
|---|---|
| `ease` | `ease` |
| `linear` | `linear` |
| `easeIn` | `ease-in` |
| `easeOut` | `ease-out` |
| `easeInOut` | `ease-in-out` |

**Examples:**

```bash
ts:func:100 - 100px by default
ts:func:ease - ease
ts:func:linear - linear
ts:func:easeIn - ease-in
ts:func:easeOut - ease-out
ts:func:[calc(100%_-_40px)] - arbitrary value
```

### `ts:delay` — `transitionDelay`

**Styles:**

- `transition-delay: {value}`

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Usage:**

```txt
ts:delay:[number]        # number + units
ts:delay:[number+unit]   # explicit CSS unit/value
ts:delay:[alias]         # alias from values
ts:delay:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
ts:delay:100 - 100px by default
ts:delay:[calc(100%_-_40px)] - arbitrary value
```

## Group Hover

### `group` — `group`

**Styles:**

_No direct `styles` field; rule works through `override` / `callback`._

**Units:** default from `defaults.units` for numeric values, unless special override handles it.

**Note:** Special rule. Syntax: parent has class `group`, child has class like `group:bg:red` or `group:w:100`. On parent hover it applies the nested rule.

**Usage:**

```txt
group:[number]        # number + units
group:[number+unit]   # explicit CSS unit/value
group:[alias]         # alias from values
group:[arbitrary]     # raw value inside []
```

**Aliases:**

_No aliases defined._

**Examples:**

```bash
<div class="group"><div class="group:bg:red">...</div></div>
```

# Adding Custom Rules

Добавление rules делается через `AirCss.setup({ rules: { ... } })`. Ключ в объекте `rules` — имя для options, а настоящий class pattern берется из поля `key` внутри `IRule`.

```ts
import { AirCss } from "air-css";
import type { IRule } from "air-css";

const userSelect: IRule = {
  key: "select",
  styles: {
    "user-select": "{value}",
  },
  values: {
    none: "none",
    text: "text",
    all: "all",
  },
};

AirCss.setup({
  rules: {
    userSelect,
  },
});
```

Использование:

```html
<div class="select:none"></div>
```

## Rule with custom units

```ts
const duration: IRule = {
  key: "dur",
  units: "ms",
  styles: {
    "transition-duration": "{value}",
  },
};
```

`dur:300` будет `300ms`.

## Rule with callback / override

```ts
const myRule: IRule = {
  key: "my",
  styles: { color: "{value}" },
  override: (el, extracted, airCss) => {
    extracted.normalizedValue = "red";
    return extracted;
  },
  callback: (el, extracted, airCss) => {
    console.log("generated", extracted.className);
  },
};
```

# Adding Custom Styles

Метод `addStyles` добавляет CSS объектом:

```ts
const air = new AirCss();

air.addStyles({
  selector: ".card",
  styles: {
    padding: "20px",
    border: "1px solid #000",
  },
});
```

Responsive style:

```ts
air.addStyles({
  breakpoint: "md",
  selector: ".card",
  styles: {
    width: "500px",
  },
});
```

Низкоуровневый метод `addStyle(media, node)` добавляет готовую CSS-строку в style tag:

```ts
air.addStyle(null, ".demo { color: red; }");
air.addStyle("md", ".demo { color: blue; }");
```

# Adding Keyframe Animations

Метод `addKeyframe(name, value)` принимает строку или объект `IKeyframe`.

String syntax:

```ts
air.addKeyframe("fadeIn", `
  from { opacity: 0; }
  to { opacity: 1; }
`);
```

Object syntax:

```ts
air.addKeyframe("fadeIn", {
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});
```

Использование:

```html
<div class="an:600:fadeIn"></div>
<div class="an:600:fadeIn:linear an:count:inf"></div>
```

# Helper Functions / Public Methods

## `AirCss.setup(options?)`
Создает singleton instance или обновляет настройки существующего instance.


## `getOptions()`
Возвращает текущие options.


## `setOptions(options?)`
Мержит настройки, пересоздает class prefixes, rules, color variables, style elements и spacing variables.


## `getRuleWithKey(key)`
Возвращает правило по `IRule.key`.


## `getRules()`
Возвращает все runtime rules.


## `getClassPrefixes()`
Возвращает prefixes: `hov:`, breakpoints и `hov:[breakpoint]:`.


## `listen(pattern, callback)`
Слушает DOM classes через `MutationObserver`. Patterns:

```txt
*        # все классы
abc*     # начинается с abc
*abc     # заканчивается на abc
*abc*    # содержит abc
abc      # точное совпадение
```

## `getCssColorName(value, rgb?)`

```ts
air.getCssColorName("blue:500");      // --as-blue-500
air.getCssColorName("blue:500", true); // --as-blue-500-rgb
```

## `getCssColorValue(value, rgb?)`

```ts
air.getCssColorValue("blue:500");      // var(--as-blue-500)
air.getCssColorValue("blue:500", true); // var(--as-blue-500-rgb)
```

## `getCssSpaceName(value)` / `getCssSpaceValue(value)`

```ts
air.getCssSpaceName("md");  // --as-spacing-md
air.getCssSpaceValue("md"); // var(--as-spacing-md)
```

# Notes about `styles.css`

`styles.css` — это autocomplete/helper файл. Он содержит статически перечисленные классы и варианты с breakpoints/hover, но динамические значения вроде `w:120`, `w:[120px]`, `bg:[rgba(...)]` генерируются runtime-движком и не обязаны быть перечислены в CSS-файле.
