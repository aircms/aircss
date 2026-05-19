# AirCSS Documentation

AirCSS — runtime CSS-фреймворк, который генерирует стили прямо в браузере, наблюдая за классами в DOM. Никакого build-шага не требуется.

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Class Syntax](#class-syntax)
3. [Breakpoints](#breakpoints)
4. [Hover States](#hover-states)
5. [Color System](#color-system)
6. [Spacing System](#spacing-system)
7. [Configuration](#configuration)
8. [Rules Reference](#rules-reference)
    - [Display](#display)
    - [Width](#width)
    - [Height](#height)
    - [Margin](#margin)
    - [Padding](#padding)
    - [Position](#position)
    - [Z-Index & Inset](#z-index--inset)
    - [Aspect Ratio](#aspect-ratio)
    - [Overflow](#overflow)
    - [Flexbox — Direction](#flexbox--direction)
    - [Flexbox — Justify Content](#flexbox--justify-content)
    - [Flexbox — Align Items](#flexbox--align-items)
    - [Flexbox — Wrap](#flexbox--wrap)
    - [Flexbox — Grow & Shrink](#flexbox--grow--shrink)
    - [Flexbox — Order](#flexbox--order)
    - [Flexbox — Basis](#flexbox--basis)
    - [Flexbox — Gap](#flexbox--gap)
    - [Center (shorthand)](#center-shorthand)
    - [Grid — Row & Col](#grid--row--col)
    - [Cluster](#cluster)
    - [Container](#container)
    - [Background Color](#background-color)
    - [Background Opacity](#background-opacity)
    - [Background Image](#background-image)
    - [Background Repeat](#background-repeat)
    - [Background Position](#background-position)
    - [Background Size](#background-size)
    - [Background Attachment](#background-attachment)
    - [Background Origin](#background-origin)
    - [Background Clip](#background-clip)
    - [Background Blend Mode](#background-blend-mode)
    - [Gradient — Radial](#gradient--radial)
    - [Gradient — Linear](#gradient--linear)
    - [Text Color](#text-color)
    - [Font Size](#font-size)
    - [Font Weight](#font-weight)
    - [Text Align](#text-align)
    - [Font Style](#font-style)
    - [Text Transform](#text-transform)
    - [Text Decoration](#text-decoration)
    - [Line Height](#line-height)
    - [Letter Spacing](#letter-spacing)
    - [Border Style](#border-style)
    - [Border Width](#border-width)
    - [Border Color](#border-color)
    - [Border Opacity](#border-opacity)
    - [Border Radius](#border-radius)
    - [Opacity](#opacity)
    - [Box Shadow](#box-shadow)
    - [Text Shadow](#text-shadow)
    - [Filter](#filter)
    - [Backdrop Filter](#backdrop-filter)
    - [Rotate](#rotate)
    - [Scale](#scale)
    - [Transform Functions (tf:*)](#transform-functions-tf)
    - [Transform — Arbitrary](#transform--arbitrary)
    - [Transform — Perspective](#transform--perspective)
    - [Transform — Origin](#transform--origin)
    - [Transform — Style](#transform--style)
    - [Transform — Backface Visibility](#transform--backface-visibility)
    - [Transition](#transition)
    - [Animation](#animation)
    - [Cursor](#cursor)
    - [Object Fit](#object-fit)
    - [Group Hover](#group-hover)
9. [Adding Custom Rules](#adding-custom-rules)
10. [Adding Custom Styles](#adding-custom-styles)
11. [Adding Keyframe Animations](#adding-keyframe-animations)
12. [Helper Methods](#helper-methods)

---

## Installation & Setup

### NPM

```bash
npm install aircss
```

### Via CDN / Script tag

```html
<script src="aircss.min.js"></script>
```

### Basic initialization

```ts
import { AirCss } from 'aircss';

// Singleton — recommended for most apps
AirCss.setup();
```

### With options

```ts
AirCss.setup({
  defaults: {
    cssPrefix: 'as',       // prefix for CSS variables (default: 'as')
    units: 'px',           // default unit for numeric values (default: 'px')
    important: true,       // append !important to all generated styles (default: true)
    color: 500,            // default color shade (default: 500)
    grids: 12,             // default number of grid columns (default: 12)
    animationTimingFunction: 'ease-in-out', // default animation easing
  },
});
```

### Direct instantiation

```ts
import { AirCss } from 'aircss';

const css = new AirCss({
  defaults: {
    cssPrefix: 'app',
    units: 'rem',
  },
});
```

> `AirCss.setup()` creates a singleton. Subsequent calls to `setup()` update options on the existing instance.

---

## Class Syntax

The general pattern for a class:

```
[breakpoint:]  [hov:]  rule-key  [:value]
```

- **breakpoint** — optional screen prefix: `sm`, `md`, `lg`, `xl`, `xxl`
- **hov** — optional hover state prefix
- **rule-key** — identifies the CSS rule (e.g. `w`, `bg`, `text`)
- **value** — a number, alias, color name, or arbitrary value

### Value types

| Type | Syntax | Example | Result |
|---|---|---|---|
| Number | `rule:N` | `w:100` | `width: 100px` |
| Number + unit | `rule:[Nunit]` | `w:[5rem]` | `width: 5rem` |
| Alias | `rule:alias` | `w:a` | `width: auto` |
| Color | `rule:colorName` | `bg:blue` | uses `--as-blue-500` |
| Color + shade | `rule:colorName:shade` | `bg:blue:700` | uses `--as-blue-700` |
| Spacing token | `rule:spacingName` | `p:md` | uses `--as-spacing-md` |
| Arbitrary | `rule:[any value]` | `w:[calc(100%_-_40px)]` | `width: calc(100% - 40px)` |

> **Note:** underscores `_` inside `[...]` are converted to spaces.

---

## Breakpoints

AirCSS uses a **mobile-first** approach. Styles without a breakpoint prefix apply to all screens. Breakpoint-prefixed styles apply from that width and up.

### Default breakpoints

| Prefix | min-width | Description |
|---|---|---|
| `sm` | 0px | All screens (base / mobile) |
| `md` | 768px | Tablet and up |
| `lg` | 1024px | Desktop and up |
| `xl` | 1440px | Large desktop |
| `xxl` | 1640px | Extra large desktop |

### Usage

```html
<!-- Width 100% on all screens, 50% on md+, 25% on lg+ -->
<div class="w:f md:w:[50%] lg:w:[25%]"></div>

<!-- Hidden on mobile, flex on md+ -->
<div class="d:none md:d:flex"></div>

<!-- Text left on mobile, center on md+ -->
<p class="ta:start md:ta:center"></p>

<!-- Padding increases per breakpoint -->
<section class="px:16 md:px:32 lg:px:48"></section>
```

### Custom breakpoints

```ts
AirCss.setup({
  defaults: {
    breakpoints: {
      mobile: 0,
      tablet: 768,
      desktop: 1200,
    },
    containers: {
      mobile: '100%',
      tablet: '740px',
      desktop: '1140px',
    },
  },
});
```

```html
<!-- Now use your breakpoint names as prefixes -->
<div class="mobile:d:none tablet:d:flex"></div>
```

---

## Hover States

Prefix any class with `hov:` to apply it only on hover.

### Syntax

```
hov:rule:value
```

### Examples

```html
<!-- Change background color on hover -->
<button class="bg:blue hov:bg:blue:700 ts:200"></button>

<!-- Change text color on hover -->
<a class="text:gray:600 hov:text:blue ts:150"></a>

<!-- Scale up on hover -->
<div class="hov:scale:[1.05] ts:200"></div>

<!-- Show on hover (opacity) -->
<span class="op:0 hov:op:100 ts:300"></span>

<!-- Combine with breakpoint -->
<div class="md:hov:bg:red:500"></div>
```

---

## Color System

AirCSS ships with a full color palette. Colors are exposed as CSS variables at the `:root` level.

### Available color names

`emerald` · `green` · `lime` · `red` · `orange` · `amber` · `yellow` · `teal` · `cyan` · `sky` · `blue` · `indigo` · `violet` · `purple` · `fuchsia` · `pink` · `rose` · `slate` · `gray` · `zinc` · `neutral` · `stone`

**Aliases (configurable):**
- `primary` → `blue` (default)
- `secondary` → `purple` (default)

### Shades

Each color has shades from `100` to `900`.

| Shade | Meaning |
|---|---|
| 100 | Lightest |
| 200–400 | Light |
| 500 | Base (default when no shade specified) |
| 600–800 | Dark |
| 900 | Darkest |

### CSS Variables generated

```css
:root {
  --as-blue-500: #3b82f6;
  --as-blue-500-rgb: 59, 130, 246;
  --as-blue: var(--as-blue-500);       /* default shade alias */
  --as-blue-rgb: var(--as-blue-500-rgb);
  /* ... all colors and shades ... */
}
```

### Using colors in classes

```html
<!-- Default shade (500) -->
<div class="bg:blue">blue-500 background</div>

<!-- Specific shade -->
<div class="bg:blue:700">blue-700 background</div>

<!-- Text color -->
<p class="text:gray:800">dark gray text</p>

<!-- Primary alias -->
<button class="bg:primary hov:bg:primary:700"></button>

<!-- Arbitrary color -->
<div class="bg:[#ff0066]"></div>
```

### Custom colors

```ts
AirCss.setup({
  defaults: {
    colors: {
      // Alias to existing color
      primary: 'blue',
      secondary: 'purple',

      // Custom palette
      brand: {
        100: '#fde8f0',
        500: '#e63946',
        700: '#c1121f',
        900: '#6b0d16',
      },
    },
  },
});
```

```html
<!-- Use your custom color -->
<div class="bg:brand text:brand:100"></div>
```

---

## Spacing System

AirCSS has a responsive spacing system. Spacing tokens are CSS variables that automatically change value at each breakpoint.

### Default spacing tokens

| Token | sm (0px) | md (768px) | lg (1024px) | xl (1440px) | xxl (1640px) |
|---|---|---|---|---|---|
| `sm` | 2px | 4px | 6px | 8px | 10px |
| `md` | 4px | 8px | 12px | 16px | 20px |
| `lg` | 6px | 12px | 18px | 24px | 30px |
| `xl` | 8px | 16px | 24px | 32px | 40px |
| `xxl` | 10px | 20px | 30px | 40px | 50px |

### CSS Variables generated

```css
:root { --as-spacing-sm: 2px; --as-spacing-md: 4px; /* ... */ }

@media (min-width: 768px) {
  :root { --as-spacing-sm: 4px; --as-spacing-md: 8px; /* ... */ }
}
/* etc. */
```

### Using spacing tokens

```html
<!-- Responsive padding using token — grows with screen size automatically -->
<div class="p:md"></div>
<div class="px:lg py:md"></div>
<div class="gap:xl"></div>
<div class="m:sm"></div>
```

### Custom spacing

```ts
AirCss.setup({
  defaults: {
    spaces: {
      // key = breakpoint name, value = map of token → value at that breakpoint
      sm: {   // at 0px
        xs: '2px', sm: '4px', md: '8px', lg: '16px',
      },
      md: {   // at 768px
        xs: '4px', sm: '8px', md: '16px', lg: '32px',
      },
      lg: {   // at 1024px
        xs: '6px', sm: '12px', md: '24px', lg: '48px',
      },
    },
  },
});
```

---

## Configuration

Full configuration interface:

```ts
AirCss.setup({
  // Override the document (useful for iframes)
  document: window.document,

  defaults: {
    cssPrefix: 'as',             // CSS variable prefix: --as-blue-500
    units: 'px',                 // Default units appended to numeric values
    important: true,             // Add !important to all generated styles
    color: 500,                  // Default color shade when no shade given
    grids: 12,                   // Default columns for row:N
    animationTimingFunction: 'ease-in-out', // Default for an:{dur}:{name}

    breakpoints: {
      sm: 0,
      md: 768,
      lg: 1024,
      xl: 1440,
      xxl: 1640,
    },

    containers: {
      sm: '100%',
      md: '720px',
      lg: '1000px',
      xl: '1200px',
      xxl: '1540px',
    },

    // Responsive spacing tokens
    spaces: {
      sm: { sm: '2px', md: '4px', lg: '6px', xl: '8px', xxl: '10px' },
      md: { sm: '4px', md: '8px', lg: '12px', xl: '16px', xxl: '20px' },
      lg: { sm: '6px', md: '12px', lg: '18px', xl: '24px', xxl: '30px' },
      xl: { sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '40px' },
      xxl: { sm: '10px', md: '20px', lg: '30px', xl: '40px', xxl: '50px' },
    },

    colors: {
      primary: 'blue',
      secondary: 'purple',
      // ... add custom palettes
    },
  },

  // Extend or override built-in rules
  rules: {
    myCustomRule: { /* IRule */ },
  },
});
```

---

## Rules Reference

---

### Display

**Key:** `d` | **CSS:** `display`

#### Usage

```
d:{alias}
```

#### Aliases

| Alias | Value |
|---|---|
| `none` | `none` |
| `flex` | `flex` |
| `grid` | `grid` |
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

#### Examples

```
d:none          → display: none
d:flex          → display: flex
d:grid          → display: grid
d:block         → display: block
d:inlineBlock   → display: inline-block
d:inlineFlex    → display: inline-flex
d:contents      → display: contents

md:d:flex       → @media (min-width: 768px) { display: flex }
sm:d:none       → display: none on all screens
lg:d:grid       → display: grid on lg+
hov:d:flex      → display: flex on hover
```

---

### Width

**Key:** `w` | **CSS:** `width`
**Key:** `w:max` | **CSS:** `max-width`
**Key:** `w:min` | **CSS:** `min-width`

#### Usage

```
w:{number}       → width: Npx  (default units)
w:[N + unit]     → width in given units
w:{alias}        → alias value
w:[arbitrary]    → any CSS value
```

#### Aliases

| Alias | Value |
|---|---|
| `a` | `auto` |
| `f` | `100%` |
| `min` | `min-content` |
| `max` | `max-content` |
| `fit` | `fit-content` |

#### Examples

```
w:100                   → width: 100px
w:f                     → width: 100%
w:a                     → width: auto
w:min                   → width: min-content
w:max                   → width: max-content
w:fit                   → width: fit-content
w:[50vw]                → width: 50vw
w:[calc(100%_-_40px)]   → width: calc(100% - 40px)

w:max:800               → max-width: 800px
w:max:f                 → max-width: 100%
w:max:a                 → max-width: auto

w:min:320               → min-width: 320px
w:min:f                 → min-width: 100%
w:min:a                 → min-width: auto

md:w:f                  → @media md → width: 100%
hov:w:f                 → width: 100% on hover
```

---

### Height

**Key:** `h` | **CSS:** `height`
**Key:** `h:max` | **CSS:** `max-height`
**Key:** `h:min` | **CSS:** `min-height`

#### Usage

```
h:{number}    → height: Npx
h:{alias}     → alias value
h:[arbitrary] → any CSS value
```

#### Aliases

| Alias | Value |
|---|---|
| `f` | `100%` |
| `a` | `auto` |

#### Examples

```
h:100             → height: 100px
h:f               → height: 100%
h:a               → height: auto
h:[100vh]         → height: 100vh
h:[100dvh]        → height: 100dvh

h:max:600         → max-height: 600px
h:max:f           → max-height: 100%
h:max:a           → max-height: auto

h:min:200         → min-height: 200px
h:min:f           → min-height: 100%
h:min:[50vh]      → min-height: 50vh

md:h:f            → @media md → height: 100%
```

---

### Margin

**Keys:** `m` · `mx` · `my` · `mt` · `mb` · `ms` · `me` | **CSS:** `margin-*`

#### Usage

```
m:{number}    → margin: Npx
m:{alias}     → alias value
m:[arbitrary] → any value
```

#### Aliases (all margin rules)

| Alias | Value |
|---|---|
| `a` | `auto` |
| `i` | `initial` |

#### Examples

```
m:16        → margin: 16px
m:a         → margin: auto
m:i         → margin: initial
m:[-8px]    → margin: -8px
m:md        → margin: var(--as-spacing-md)

mx:a        → margin-left: auto; margin-right: auto  (center element)
mx:24       → margin-left: 24px; margin-right: 24px
my:32       → margin-top: 32px; margin-bottom: 32px

mt:8        → margin-top: 8px
mb:16       → margin-bottom: 16px
ms:24       → margin-left: 24px
me:24       → margin-right: 24px

mt:lg       → margin-top: var(--as-spacing-lg)

md:mx:a     → @media md → margin: 0 auto
hov:mt:0    → margin-top: 0 on hover
```

---

### Padding

**Keys:** `p` · `px` · `py` · `pt` · `pb` · `ps` · `pe` | **CSS:** `padding-*`

#### Usage

```
p:{number}    → padding: Npx
p:{alias}     → alias value
p:[arbitrary] → any value
```

#### Aliases

| Alias | Value |
|---|---|
| `i` | `initial` |

#### Examples

```
p:16          → padding: 16px
p:i           → padding: initial
p:md          → padding: var(--as-spacing-md)

px:24         → padding-left: 24px; padding-right: 24px
py:12         → padding-top: 12px; padding-bottom: 12px

pt:8          → padding-top: 8px
pb:8          → padding-bottom: 8px
ps:16         → padding-left: 16px
pe:16         → padding-right: 16px

px:xl         → padding-left/right: var(--as-spacing-xl)

sm:p:16       → @media sm → padding: 16px
md:px:32      → @media md → padding-left/right: 32px
lg:px:48      → @media lg → padding-left/right: 48px
```

---

### Position

**Key:** `pos` | **CSS:** `position`

#### Aliases

| Alias | Value |
|---|---|
| `rel` | `relative` |
| `abs` | `absolute` |
| `fix` | `fixed` |
| `sti` | `sticky` |
| `sta` | `static` |
| `init` | `initial` |

#### Examples

```
pos:rel       → position: relative
pos:abs       → position: absolute
pos:fix       → position: fixed
pos:sti       → position: sticky
pos:sta       → position: static

md:pos:abs    → @media md → position: absolute
```

---

### Z-Index & Inset

**Keys:** `z` · `t` · `b` · `s` · `e`
**CSS:** `z-index` · `top` · `bottom` · `left` · `right`

#### Examples

```
z:10          → z-index: 10
z:100         → z-index: 100
z:[9999]      → z-index: 9999

t:0           → top: 0px
t:20          → top: 20px
t:[50%]       → top: 50%
t:[-1px]      → top: -1px

b:0           → bottom: 0px
b:[20px]      → bottom: 20px

s:0           → left: 0px
s:16          → left: 16px
s:[-10px]     → left: -10px

e:0           → right: 0px
e:16          → right: 16px

md:t:0        → @media md → top: 0px
```

> Tip: `s` = start = left, `e` = end = right (RTL-friendly naming).

---

### Aspect Ratio

**Key:** `ar` | **CSS:** `aspect-ratio`

#### Aliases

| Alias | Value |
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

#### Examples

```
ar:1:1        → aspect-ratio: 1 / 1
ar:16:9       → aspect-ratio: 16 / 9
ar:4:3        → aspect-ratio: 4 / 3
ar:9:16       → aspect-ratio: 9 / 16  (portrait)

md:ar:16:9    → @media md → aspect-ratio: 16 / 9
```

---

### Overflow

**Keys:** `ov` · `ov:x` · `ov:y` | **CSS:** `overflow` · `overflow-x` · `overflow-y`

#### Aliases

| Alias | Value |
|---|---|
| `vis` | `visible` |
| `hid` | `hidden` |
| `scroll` | `scroll` |
| `a` | `auto` |

#### Examples

```
ov:hid          → overflow: hidden
ov:scroll       → overflow: scroll
ov:a            → overflow: auto
ov:vis          → overflow: visible

ov:x:hid        → overflow-x: hidden
ov:x:scroll     → overflow-x: scroll
ov:y:a          → overflow-y: auto
ov:y:hid        → overflow-y: hidden

md:ov:hid       → @media md → overflow: hidden
```

---

### Flexbox — Direction

**Key:** `flex` | **CSS:** `flex-direction`

#### Aliases

| Alias | Value |
|---|---|
| `row` | `row` |
| `col` | `column` |
| `rowRev` | `row-reverse` |
| `colRev` | `column-reverse` |

#### Examples

```
flex:row        → flex-direction: row
flex:col        → flex-direction: column
flex:rowRev     → flex-direction: row-reverse
flex:colRev     → flex-direction: column-reverse

sm:flex:col     → column on mobile
md:flex:row     → row on md+
```

---

### Flexbox — Justify Content

**Key:** `justify` | **CSS:** `justify-content`

#### Aliases

| Alias | Value |
|---|---|
| `start` | `flex-start` |
| `end` | `flex-end` |
| `center` | `center` |
| `between` | `space-between` |
| `around` | `space-around` |

#### Examples

```
justify:start       → justify-content: flex-start
justify:end         → justify-content: flex-end
justify:center      → justify-content: center
justify:between     → justify-content: space-between
justify:around      → justify-content: space-around

md:justify:between  → @media md → justify-content: space-between
```

---

### Flexbox — Align Items

**Key:** `align` | **CSS:** `align-items`

#### Aliases

| Alias | Value |
|---|---|
| `start` | `flex-start` |
| `end` | `flex-end` |
| `center` | `center` |
| `baseline` | `baseline` |
| `stretch` | `stretch` |

#### Examples

```
align:start         → align-items: flex-start
align:end           → align-items: flex-end
align:center        → align-items: center
align:baseline      → align-items: baseline
align:stretch       → align-items: stretch

md:align:center     → @media md → align-items: center
```

---

### Flexbox — Wrap

**Key:** `wrap` | **CSS:** `flex-wrap`

#### Aliases

| Alias | Value |
|---|---|
| `yes` | `wrap` |
| `no` | `nowrap` |
| `rev` | `wrap-reverse` |

#### Examples

```
wrap:yes      → flex-wrap: wrap
wrap:no       → flex-wrap: nowrap
wrap:rev      → flex-wrap: wrap-reverse

md:wrap:yes   → @media md → flex-wrap: wrap
```

---

### Flexbox — Grow & Shrink

**Key:** `grow` | **CSS:** `flex-grow`
**Key:** `shrink` | **CSS:** `flex-shrink`

#### Examples

```
grow:1        → flex-grow: 1
grow:0        → flex-grow: 0

shrink:0      → flex-shrink: 0
shrink:1      → flex-shrink: 1

md:grow:1     → @media md → flex-grow: 1
```

---

### Flexbox — Order

**Key:** `order` | **CSS:** `order`

#### Aliases

| Alias | Value |
|---|---|
| `first` | `-9999` |
| `last` | `9999` |

#### Examples

```
order:first     → order: -9999
order:last      → order: 9999
order:2         → order: 2

md:order:first  → @media md → order: -9999
```

---

### Flexbox — Basis

**Key:** `basis` | **CSS:** `flex-basis`

#### Aliases

| Alias | Value |
|---|---|
| `a` | `auto` |
| `min` | `min-content` |
| `max` | `max-content` |
| `fit` | `fit-content` |

#### Examples

```
basis:a         → flex-basis: auto
basis:min       → flex-basis: min-content
basis:max       → flex-basis: max-content
basis:[50%]     → flex-basis: 50%
basis:[200px]   → flex-basis: 200px
```

---

### Flexbox — Gap

**Keys:** `gap` · `gap:x` · `gap:y` | **CSS:** `gap` · `column-gap` · `row-gap`

#### Examples

```
gap:16          → gap: 16px
gap:8           → gap: 8px
gap:md          → gap: var(--as-spacing-md)

gap:x:24        → column-gap: 24px
gap:y:12        → row-gap: 12px
gap:x:xl        → column-gap: var(--as-spacing-xl)

md:gap:24       → @media md → gap: 24px
```

---

### Center (shorthand)

**Key:** `center` | **CSS:** `display: flex; justify-content: center; align-items: center`

#### Examples

```
center          → display: flex; justify-content: center; align-items: center

md:center       → @media md → centered flex
hov:center      → centered flex on hover
```

---

### Grid — Row & Col

**Key:** `row` | **CSS:** `display: grid; grid-template-columns`
**Key:** `col` | **CSS:** `grid-column`

#### Aliases for `row`

| Alias | Value |
|---|---|
| `a` | `auto-fit` |
| (no value) | uses default grid columns (12) |

#### Aliases for `col`

| Alias | Value |
|---|---|
| `a` | `span 1` |
| `f` | `1 / -1` (full width) |

#### Examples

```
row             → display: grid; grid-template-columns: repeat(12, minmax(0, 1fr))
row:4           → repeat(4, minmax(0, 1fr))
row:a           → repeat(auto-fit, minmax(0, 1fr))

col:6           → grid-column: span 6
col:3           → grid-column: span 3
col:12          → grid-column: span 12
col:a           → grid-column: span 1
col:f           → grid-column: 1 / -1

sm:col:12 md:col:6 lg:col:4   → responsive columns
```

#### Example markup

```html
<div class="row gap:24">
  <div class="col:12 md:col:6 lg:col:4">Card 1</div>
  <div class="col:12 md:col:6 lg:col:4">Card 2</div>
  <div class="col:12 md:col:6 lg:col:4">Card 3</div>
</div>
```

---

### Cluster

**Key:** `cluster` | **CSS:** `display: flex; flex-wrap: wrap; gap: {value}; align-items: center`

A layout shorthand for wrapping inline groups (tags, chips, buttons).

#### Examples

```
cluster:8       → flex wrap container with gap: 8px
cluster:16      → flex wrap container with gap: 16px
cluster:md      → flex wrap with gap: var(--as-spacing-md)

md:cluster:24   → @media md → cluster with 24px gap
```

---

### Container

**Key:** `container` | **CSS:** `margin-left: auto; margin-right: auto` + responsive `max-width`

The `container` class generates `max-width` constraints for every breakpoint automatically at init.

#### Examples

```
container       → max-width changes per breakpoint + margin: 0 auto
```

Default max-widths: `sm=100%`, `md=720px`, `lg=1000px`, `xl=1200px`, `xxl=1540px`.
Override via `defaults.containers` in config.

---

### Background Color

**Key:** `bg` | **CSS:** `background-color` (rendered as `rgba()`)

Colors are rendered as `rgba(R, G, B, opacity)` using the `-rgb` CSS variable and an opacity variable (`--as-background-color-opacity`, default `1`). Arbitrary values bypass this and are applied directly.

#### Examples

```
bg:blue                 → background-color: rgba(var(--as-blue-500-rgb), 1)
bg:blue:700             → background-color: rgba(var(--as-blue-700-rgb), 1)
bg:red:300              → background-color: rgba(var(--as-red-300-rgb), 1)
bg:primary              → background-color: rgba(var(--as-primary-rgb), 1)
bg:none                 → background-color: transparent
bg:[#ff0066]            → background-color: #ff0066  (arbitrary, bypasses rgba)
bg:[rgba(0,0,0,0.5)]    → background-color: rgba(0,0,0,0.5)

hov:bg:blue:600         → background-color on hover
md:bg:gray:100          → @media md → background
```

---

### Background Opacity

**Key:** `bg:op` | **CSS:** `--as-background-color-opacity` (CSS variable)

Controls the opacity of a `bg:*` color. Value is 0–100 (percentage).

#### Examples

```
bg:op:50        → --as-background-color-opacity: 0.5
bg:op:80        → --as-background-color-opacity: 0.8
bg:op:0         → --as-background-color-opacity: 0  (fully transparent)
bg:op:100       → --as-background-color-opacity: 1

hov:bg:op:80    → opacity 80% on hover
```

#### Usage with color

```html
<div class="bg:blue bg:op:20">Semi-transparent blue background</div>
```

---

### Background Image

**Key:** `bg:img` | **CSS:** `background-image: url(...)` + `background-size: cover`

#### Examples

```
bg:img:[/img/hero.jpg]          → background-image: url(/img/hero.jpg); background-size: cover
bg:img:[https://example.com/x]  → external image
```

---

### Background Repeat

**Key:** `bg:rep` | **CSS:** `background-repeat`

#### Aliases

| Alias | Value |
|---|---|
| `yes` | `repeat` |
| `no` | `no-repeat` |
| `x` | `repeat-x` |
| `y` | `repeat-y` |
| `space` | `space` |
| `round` | `round` |

#### Examples

```
bg:rep:no       → background-repeat: no-repeat
bg:rep:yes      → background-repeat: repeat
bg:rep:x        → background-repeat: repeat-x
bg:rep:y        → background-repeat: repeat-y
```

---

### Background Position

**Key:** `bg:pos` | **CSS:** `background-position`

#### Aliases

| Alias | Value |
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

#### Examples

```
bg:pos:center   → background-position: center
bg:pos:top      → background-position: top
bg:pos:te       → background-position: top right
bg:pos:bs       → background-position: bottom left
```

---

### Background Size

**Key:** `bg:size` | **CSS:** `background-size`

#### Aliases

| Alias | Value |
|---|---|
| `cover` | `cover` |
| `contain` | `contain` |
| `a` | `auto` |

#### Examples

```
bg:size:cover       → background-size: cover
bg:size:contain     → background-size: contain
bg:size:a           → background-size: auto
bg:size:[200px]     → background-size: 200px
```

---

### Background Attachment

**Key:** `bg:attach` | **CSS:** `background-attachment`

#### Aliases

| Alias | Value |
|---|---|
| `scroll` | `scroll` |
| `fixed` | `fixed` |

#### Examples

```
bg:attach:fixed     → background-attachment: fixed  (parallax effect)
bg:attach:scroll    → background-attachment: scroll
```

---

### Background Origin

**Key:** `bg:origin` | **CSS:** `background-origin`

#### Aliases

| Alias | Value |
|---|---|
| `border` | `border-box` |
| `padding` | `padding-box` |
| `content` | `content-box` |

#### Examples

```
bg:origin:border    → background-origin: border-box
bg:origin:padding   → background-origin: padding-box
bg:origin:content   → background-origin: content-box
```

---

### Background Clip

**Key:** `bg:clip` | **CSS:** `background-clip`

#### Aliases

| Alias | Value |
|---|---|
| `border` | `border-box` |
| `padding` | `padding-box` |
| `content` | `content-box` |
| `text` | `text` |

#### Examples

```
bg:clip:border      → background-clip: border-box
bg:clip:text        → background-clip: text  (use with text gradient)
```

#### Gradient text example

```html
<h1 class="line:90:blue:purple bg:clip:text text:[transparent]">Gradient Text</h1>
```

---

### Background Blend Mode

**Key:** `bg:blend` | **CSS:** `background-blend-mode`

#### Aliases

| Alias | Value |
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

#### Examples

```
bg:blend:multiply   → background-blend-mode: multiply
bg:blend:overlay    → background-blend-mode: overlay
bg:blend:screen     → background-blend-mode: screen
```

---

### Gradient — Radial

**Key:** `radial` | **CSS:** `background: radial-gradient(...)`

Syntax: `radial:{color1}:{color2}:...` — colors are resolved via CSS variable system.

#### Examples

```
radial:blue:purple              → radial-gradient(circle, var(--as-blue) 0%, var(--as-purple) 100%)
radial:red:orange:yellow        → 3-stop radial gradient
radial:blue:700:blue:200        → dark to light blue radial
radial:[#ff0066_#0099ff]        → arbitrary radial gradient
```

---

### Gradient — Linear

**Key:** `line` | **CSS:** `background: linear-gradient(...)`

Syntax: `line:{degrees}:{color1}:{color2}:...`

#### Examples

```
line:90:blue:purple             → linear-gradient(90deg, var(--as-blue) 0%, var(--as-purple) 100%)
line:45:red:orange:yellow       → 3-stop at 45deg
line:0:blue:800:blue:200        → vertical gradient with shades
line:135:primary:secondary      → diagonal primary to secondary
line:[90deg,#ff0,#f0f]         → arbitrary
```

---

### Text Color

**Key:** `text` | **CSS:** `color`

#### Aliases

| Alias | Value |
|---|---|
| `initial` | `initial` |
| `inherit` | `inherit` |

#### Examples

```
text:blue               → color: var(--as-blue)  (shade 500)
text:blue:700           → color: var(--as-blue-700)
text:red:400            → color: var(--as-red-400)
text:gray:800           → color: var(--as-gray-800)
text:primary            → color: var(--as-primary)
text:inherit            → color: inherit
text:initial            → color: initial
text:[#fff]             → color: #fff
text:[rgba(0,0,0,0.5)]  → color: rgba(0,0,0,0.5)

hov:text:blue           → color on hover
md:text:gray:700        → @media md → color
```

---

### Font Size

**Key:** `fs` | **CSS:** `font-size`

#### Examples

```
fs:16               → font-size: 16px
fs:24               → font-size: 24px
fs:48               → font-size: 48px
fs:[1.5rem]         → font-size: 1.5rem
fs:[clamp(14px,4vw,32px)] → fluid font size

sm:fs:14            → 14px on mobile
md:fs:16            → 16px on tablet+
lg:fs:18            → 18px on desktop+
```

---

### Font Weight

**Key:** `fw` | **CSS:** `font-weight`

#### Aliases

| Alias | Value |
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

#### Examples

```
fw:thin         → font-weight: 100
fw:light        → font-weight: 300
fw:normal       → font-weight: 400
fw:medium       → font-weight: 500
fw:semibold     → font-weight: 600
fw:bold         → font-weight: 700
fw:extrabold    → font-weight: 800
fw:black        → font-weight: 900
fw:700          → font-weight: 700  (numeric)

hov:fw:bold     → bold on hover
md:fw:semibold  → @media md → font-weight: 600
```

---

### Text Align

**Key:** `ta` | **CSS:** `text-align`

#### Aliases

| Alias | Value |
|---|---|
| `start` | `left` |
| `center` | `center` |
| `end` | `right` |
| `justify` | `justify` |

#### Examples

```
ta:start            → text-align: left
ta:center           → text-align: center
ta:end              → text-align: right
ta:justify          → text-align: justify

sm:ta:center        → center on mobile
md:ta:start         → left on md+
```

---

### Font Style

**Key:** `fst` | **CSS:** `font-style`

#### Aliases

| Alias | Value |
|---|---|
| `it` | `italic` |
| `norm` | `normal` |

#### Examples

```
fst:it          → font-style: italic
fst:norm        → font-style: normal
hov:fst:it      → italic on hover
```

---

### Text Transform

**Key:** `tt` | **CSS:** `text-transform`

#### Aliases

| Alias | Value |
|---|---|
| `uppercase` | `uppercase` |
| `lowercase` | `lowercase` |
| `capitalize` | `capitalize` |

#### Examples

```
tt:uppercase    → text-transform: uppercase
tt:lowercase    → text-transform: lowercase
tt:capitalize   → text-transform: capitalize
hov:tt:uppercase → uppercase on hover
```

---

### Text Decoration

**Key:** `td` | **CSS:** `text-decoration`

#### Aliases

| Alias | Value |
|---|---|
| `underline` | `underline` |
| `lineThrough` | `line-through` |
| `overline` | `overline` |
| `none` | `none` |

#### Examples

```
td:underline        → text-decoration: underline
td:lineThrough      → text-decoration: line-through
td:overline         → text-decoration: overline
td:none             → text-decoration: none

hov:td:underline    → underline on hover
hov:td:none         → remove decoration on hover
```

---

### Line Height

**Key:** `lh` | **CSS:** `line-height`

#### Examples

```
lh:24           → line-height: 24px
lh:[1.5]        → line-height: 1.5
lh:[1.2]        → line-height: 1.2
lh:[normal]     → line-height: normal

md:lh:32        → @media md → line-height: 32px
```

---

### Letter Spacing

**Key:** `ls` | **CSS:** `letter-spacing`

#### Examples

```
ls:2            → letter-spacing: 2px
ls:[-1px]       → letter-spacing: -1px
ls:[0.05em]     → letter-spacing: 0.05em
ls:[0.1rem]     → letter-spacing: 0.1rem
```

---

### Border Style

**Key:** `bst` | **CSS:** `border-style`

#### Aliases

| Alias | Value |
|---|---|
| `none` | `none` |
| `solid` | `solid` |
| `dashed` | `dashed` |
| `dotted` | `dotted` |

#### Examples

```
bst:solid       → border-style: solid
bst:dashed      → border-style: dashed
bst:dotted      → border-style: dotted
bst:none        → border-style: none

hov:bst:dashed  → dashed on hover
```

---

### Border Width

**Keys:** `bw` · `bw:t` · `bw:b` · `bw:s` · `bw:e` | **CSS:** `border-width-*`

#### Examples

```
bw:1            → border-width: 1px
bw:2            → border-width: 2px
bw:0            → border-width: 0px

bw:t:2          → border-top-width: 2px
bw:b:1          → border-bottom-width: 1px
bw:s:3          → border-left-width: 3px
bw:e:0          → border-right-width: 0px

md:bw:2         → @media md → border-width: 2px
```

---

### Border Color

**Key:** `bc` | **CSS:** `border-color` (rgba) — also auto-sets `border-width: 1px; border-style: solid`

Same rgba + opacity variable mechanism as background color. The opacity variable is `--as-border-color-opacity`.

#### Aliases

| Alias | Value |
|---|---|
| `none` | `transparent` |
| `inherit` | `inherit` |
| `initial` | `initial` |

#### Examples

```
bc:blue             → border: 1px solid rgba(var(--as-blue-500-rgb), 1)
bc:gray:300         → border: 1px solid rgba(gray-300, 1)
bc:none             → border-color: transparent
bc:inherit          → border-color: inherit
bc:[#e2e8f0]        → border-color: #e2e8f0  (arbitrary)

hov:bc:blue:400     → border-color on hover
md:bc:gray:200      → @media md → border-color
```

---

### Border Opacity

**Key:** `bc:op` | **CSS:** `--as-border-color-opacity`

#### Examples

```
bc:op:50        → --as-border-color-opacity: 0.5
bc:op:30        → --as-border-color-opacity: 0.3
hov:bc:op:100   → full opacity on hover
```

---

### Border Radius

**Keys:** `br` · `br:te` · `br:be` · `br:bs` · `br:ts` | **CSS:** `border-radius-*`

`te` = top-end (top-right), `ts` = top-start (top-left), `be` = bottom-end (bottom-right), `bs` = bottom-start (bottom-left).

#### Aliases (all border-radius rules)

| Alias | Value |
|---|---|
| `circle` | `50%` |
| `pill` | `999px` |

#### Examples

```
br:8            → border-radius: 8px
br:16           → border-radius: 16px
br:circle       → border-radius: 50%
br:pill         → border-radius: 999px
br:[4px_8px]    → arbitrary

br:te:8         → border-top-right-radius: 8px
br:ts:8         → border-top-left-radius: 8px
br:be:8         → border-bottom-right-radius: 8px
br:bs:8         → border-bottom-left-radius: 8px

br:te:circle br:be:circle   → right half-circle

hov:br:circle   → circle on hover
md:br:16        → @media md → border-radius: 16px
```

---

### Opacity

**Key:** `op` | **CSS:** `opacity`

Value is 0–100 (percentage), automatically divided by 100. Arbitrary values are passed through.

#### Examples

```
op:0            → opacity: 0
op:25           → opacity: 0.25
op:50           → opacity: 0.5
op:75           → opacity: 0.75
op:100          → opacity: 1
op:[0.33]       → opacity: 0.33  (arbitrary, bypasses division)

hov:op:100      → fully visible on hover
md:op:80        → @media md → opacity: 0.8
```

---

### Box Shadow

**Key:** `sh:b` | **CSS:** `box-shadow`

Syntax: `sh:b:{blur}:{colorName}:{shade}` → `0px 0px {blur}px 0px var(--as-{color}-{shade})`

#### Aliases

| Alias | Value |
|---|---|
| `none` | `none` |

#### Examples

```
sh:b:20:blue:500            → box-shadow: 0px 0px 20px 0px var(--as-blue-500)
sh:b:10:gray:300            → box-shadow: 0px 0px 10px 0px var(--as-gray-300)
sh:b:30:purple              → 30px spread with default shade
sh:b:none                   → box-shadow: none
sh:b:[0_4px_12px_rgba(0,0,0,0.15)]  → arbitrary box shadow

hov:sh:b:24:blue:400        → glow on hover
md:sh:b:16:gray:200         → @media md → shadow
```

---

### Text Shadow

**Key:** `sh:t` | **CSS:** `text-shadow`

Syntax: `sh:t:{blur}:{colorName}:{shade}` → `0px 0px {blur}px var(--as-{color}-{shade})`

#### Examples

```
sh:t:4:blue:500             → text-shadow: 0px 0px 4px var(--as-blue-500)
sh:t:8:red                  → text-shadow: 0px 0px 8px var(--as-red)
sh:t:[2px_2px_4px_#000]     → arbitrary text shadow

hov:sh:t:6:purple:400       → text shadow on hover
```

---

### Filter

**Key:** `filter` | **CSS:** `filter` (via CSS variables — multiple filters compose correctly)

Each filter function is stored in its own CSS variable and composed automatically. Syntax: `filter:{function}:{value}`

#### Supported functions

| Function | Unit | Value meaning |
|---|---|---|
| `blur` | px (÷10) | `filter:blur:10` → `blur(1px)` |
| `brightness` | % | `filter:brightness:150` → `brightness(150%)` |
| `contrast` | % | `filter:contrast:80` → `contrast(80%)` |
| `grayscale` | % | `filter:grayscale:100` → `grayscale(100%)` |
| `invert` | % | `filter:invert:100` → `invert(100%)` |
| `saturate` | % | `filter:saturate:200` → `saturate(200%)` |
| `sepia` | % | `filter:sepia:80` → `sepia(80%)` |
| `hue` | deg | `filter:hue:180` → `hue-rotate(180deg)` |

#### Examples

```
filter:blur:20                  → filter: blur(2px)
filter:blur:50                  → filter: blur(5px)
filter:brightness:50            → filter: brightness(50%)
filter:brightness:150           → filter: brightness(150%)
filter:contrast:80              → filter: contrast(80%)
filter:grayscale:100            → filter: grayscale(100%)
filter:invert:100               → filter: invert(100%)
filter:saturate:200             → filter: saturate(200%)
filter:sepia:60                 → filter: sepia(60%)
filter:hue:90                   → filter: hue-rotate(90deg)

filter:blur:[3px]               → filter: blur(3px)  (arbitrary)

// Multiple filters compose on one element:
filter:blur:20 filter:brightness:80  → filter: blur(2px) brightness(80%)

hov:filter:brightness:80        → brightness on hover
md:filter:grayscale:100         → @media md → grayscale
```

---

### Backdrop Filter

**Key:** `backdrop` | **CSS:** `backdrop-filter` (same composition mechanism as `filter`)

Same syntax as `filter`, same supported functions. Perfect for frosted-glass effects.

#### Examples

```
backdrop:blur:40                → backdrop-filter: blur(4px)
backdrop:blur:80                → backdrop-filter: blur(8px)
backdrop:brightness:70          → backdrop-filter: brightness(70%)
backdrop:saturate:150           → backdrop-filter: saturate(150%)
backdrop:grayscale:100          → backdrop-filter: grayscale(100%)

// Compose multiple:
backdrop:blur:40 backdrop:brightness:90  → blur(4px) brightness(90%)

hov:backdrop:blur:60            → frosted glass on hover
```

#### Frosted glass example

```html
<div class="pos:fix t:0 s:0 w:f h:f backdrop:blur:40 backdrop:brightness:70 bg:white bg:op:10">
  Frosted glass overlay
</div>
```

---

### Rotate

**Key:** `rot` | **CSS:** `rotate` (CSS `rotate` property, not `transform`)

Unit: `deg` (appended automatically to numeric values).

#### Examples

```
rot:45          → rotate: 45deg
rot:90          → rotate: 90deg
rot:180         → rotate: 180deg
rot:[-45deg]    → rotate: -45deg  (arbitrary)
rot:[0.5turn]   → rotate: 0.5turn

hov:rot:180     → rotate 180° on hover
ts:300 hov:rot:90   → animated rotation
```

---

### Scale

**Key:** `scale` | **CSS:** `scale` (CSS `scale` property)

Unit: none (unitless).

#### Examples

```
scale:1         → scale: 1
scale:2         → scale: 2
scale:[0.5]     → scale: 0.5
scale:[0.95]    → scale: 0.95
scale:[1.1]     → scale: 1.1

hov:scale:[1.05]    → scale up on hover
ts:200 hov:scale:[1.05]   → smooth scale transition
```

---

### Transform Functions (tf:*)

**CSS:** `transform` (composed via CSS variables)

Each `tf:*` rule stores its value in a dedicated CSS variable (`--as-transform-{funcName}`). All variables are then composed into the final `transform` property. This means **multiple `tf:*` classes on one element work independently and don't override each other**.

> Any element with a `tf:*` class gets: `transform: var(--as-transform-translate, translate(0,0)) var(--as-transform-rotate, rotate(0deg)) ...` automatically via the `[class*="tf:"]` attribute selector.

#### All transform functions

| Key | CSS function | Unit | Example |
|---|---|---|---|
| `tf:tx` | `translateX` | px | `tf:tx:20` |
| `tf:ty` | `translateY` | px | `tf:ty:10` |
| `tf:tz` | `translateZ` | px | `tf:tz:5` |
| `tf:t` | `translate` | px | `tf:t:10:20` |
| `tf:t3d` | `translate3d` | px | `tf:t3d:10:20:5` |
| `tf:rt` | `rotate` | deg | `tf:rt:45` |
| `tf:rtx` | `rotateX` | deg | `tf:rtx:30` |
| `tf:rty` | `rotateY` | deg | `tf:rty:60` |
| `tf:rtz` | `rotateZ` | deg | `tf:rtz:45` |
| `tf:rt3d` | `rotate3d` | deg (4th arg) | `tf:rt3d:0:1:0:45` |
| `tf:sc` | `scale` | unitless | `tf:sc:2` |
| `tf:scx` | `scaleX` | unitless | `tf:scx:1:5` → `scaleX(1, 5)` |
| `tf:scy` | `scaleY` | unitless | `tf:scy:2` |
| `tf:scz` | `scaleZ` | unitless | `tf:scz:1` |
| `tf:sc3` | `scale3d` | unitless | `tf:sc3:1:2:1` |
| `tf:skew` | `skew` | deg | `tf:skew:10:5` |
| `tf:skewx` | `skewX` | deg | `tf:skewx:15` |
| `tf:skewy` | `skewY` | deg | `tf:skewy:10` |
| `tf:mat` | `matrix` | unitless | `tf:mat:1:0:0:1:0:0` |
| `tf:mat3d` | `matrix3d` | unitless | `tf:mat3d:...16 values` |
| `tf:perspective` | `perspective` | px | `tf:perspective:1000` |

Multiple values are separated by `:` and joined with `, ` inside the function.

#### Examples

```
tf:tx:20                    → translateX(20px)
tf:ty:[-10px]               → translateY(-10px)  (arbitrary)
tf:t:10:20                  → translate(10px, 20px)
tf:tz:5                     → translateZ(5px)
tf:t3d:10:20:5              → translate3d(10px, 20px, 5px)

tf:rt:45                    → rotate(45deg)
tf:rtx:30                   → rotateX(30deg)
tf:rty:180                  → rotateY(180deg)
tf:rt3d:0:1:0:45            → rotate3d(0, 1, 0, 45deg)

tf:sc:2                     → scale(2)
tf:scx:0:5                  → scaleX(0, 5)
tf:sc3:1:1:2                → scale3d(1, 1, 2)

tf:skew:10:5                → skew(10deg, 5deg)
tf:skewx:15                 → skewX(15deg)

tf:mat:1:0:0:1:10:20        → matrix(1, 0, 0, 1, 10, 20)

// Multiple transforms compose correctly:
tf:tx:20 tf:rt:45           → translateX(20px) rotate(45deg)
tf:tx:0 tf:ty:[-4px] tf:sc:[1.02]   → combined on hover card lift

hov:tf:ty:[-4px]            → lift on hover
ts:300 hov:tf:ty:[-8px]     → smooth lift transition
md:tf:tx:0                  → reset transform on md+
```

---

### Transform — Arbitrary

**Key:** `tf` | **CSS:** `transform: {value}` (direct, bypasses CSS variable composition)

Use for complex one-off transforms or when composition isn't needed.

#### Examples

```
tf:[rotate(45deg)]                          → transform: rotate(45deg)
tf:[translateX(50%)_rotate(45deg)]          → transform: translateX(50%) rotate(45deg)
tf:[matrix(1,0.5,-0.5,1,30,10)]            → complex matrix
```

---

### Transform — Perspective

**Key:** `perspective` | **CSS:** `perspective`

#### Examples

```
perspective:1000        → perspective: 1000px
perspective:500         → perspective: 500px
perspective:[50vw]      → perspective: 50vw
```

---

### Transform — Origin

**Key:** `origin` | **CSS:** `transform-origin`

#### Aliases

| Alias | Value |
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

#### Examples

```
origin:center           → transform-origin: center
origin:topLeft          → transform-origin: top left
origin:bottomRight      → transform-origin: bottom right
origin:[50%_0]          → arbitrary
```

---

### Transform — Style

**Key:** `style` | **CSS:** `transform-style`

#### Aliases

| Alias | Value |
|---|---|
| `3d` | `preserve-3d` |
| `flat` | `flat` |

#### Examples

```
style:3d        → transform-style: preserve-3d
style:flat      → transform-style: flat
```

---

### Transform — Backface Visibility

**Key:** `backface` | **CSS:** `backface-visibility`

#### Aliases

| Alias | Value |
|---|---|
| `hid` | `hidden` |
| `vis` | `visible` |

#### Examples

```
backface:hid    → backface-visibility: hidden
backface:vis    → backface-visibility: visible
```

---

### Transition

**Keys:** `ts` · `ts:prop` · `ts:dur` · `ts:func` · `ts:delay` · `ts:beh` | **CSS:** `transition-*`

#### `ts` — shorthand

Syntax: `ts:{duration}` → `transition-property: all; transition-duration: Nms`

#### Examples

```
ts:300                  → transition-property: all; transition-duration: 300ms
ts:500                  → transition: all 500ms

ts:prop:none            → transition-property: none
ts:prop:all             → transition-property: all
ts:prop:[opacity,transform]  → transition-property: opacity, transform (arbitrary)

ts:dur:200              → transition-duration: 200ms

ts:func:ease            → transition-timing-function: ease
ts:func:linear          → transition-timing-function: linear
ts:func:easeIn          → transition-timing-function: ease-in
ts:func:easeOut         → transition-timing-function: ease-out
ts:func:easeInOut       → transition-timing-function: ease-in-out

ts:delay:150            → transition-delay: 150ms
ts:delay:300            → transition-delay: 300ms

ts:beh:allow            → transition-behavior: allow-discrete
ts:beh:normal           → transition-behavior: normal
```

#### Common pattern

```html
<button class="bg:blue hov:bg:blue:700 text:white ts:200 ts:func:easeInOut">
  Smooth hover
</button>
```

---

### Animation

**Keys:** `an` · `an:dur` · `an:func` · `an:delay` · `an:count` · `an:dir` · `an:fill` · `an:play` · `an:timeline` · `an:range` · `an:comp`

#### `an` — shorthand

Syntax: `an:{duration}:{keyframeName}` or `an:{duration}:{keyframeName}:{timing}`

```
an:500:fadeIn               → animation: fadeIn 500ms ease-in-out
an:300:slideUp              → animation: slideUp 300ms ease-in-out
an:1000:spin:linear         → animation: spin 1000ms linear
an:[spin_1s_linear_infinite]  → arbitrary
```

#### `an:dur` — duration

```
an:dur:2000         → animation-duration: 2000ms
```

#### `an:func` — timing function

| Alias | Value |
|---|---|
| `ease` | `ease` |
| `line` | `linear` |
| `in` | `ease-in` |
| `out` | `ease-out` |
| `inOut` | `ease-in-out` |
| `start` | `step-start` |
| `end` | `step-end` |

```
an:func:ease        → animation-timing-function: ease
an:func:line        → animation-timing-function: linear
an:func:inOut       → animation-timing-function: ease-in-out
```

#### `an:delay` — delay

```
an:delay:500        → animation-delay: 500ms
an:delay:1000       → animation-delay: 1000ms
```

#### `an:count` — iteration count

| Alias | Value |
|---|---|
| `inf` | `infinite` |

```
an:count:inf        → animation-iteration-count: infinite
an:count:3          → animation-iteration-count: 3
```

#### `an:dir` — direction

| Alias | Value |
|---|---|
| `norm` | `normal` |
| `rev` | `reverse` |
| `alt` | `alternate` |
| `altRev` | `alternate-reverse` |

```
an:dir:rev          → animation-direction: reverse
an:dir:alt          → animation-direction: alternate
```

#### `an:fill` — fill mode

| Alias | Value |
|---|---|
| `none` | `none` |
| `forward` | `forwards` |
| `back` | `backwards` |
| `both` | `both` |

```
an:fill:both        → animation-fill-mode: both
an:fill:forward     → animation-fill-mode: forwards
```

#### `an:play` — play state

| Alias | Value |
|---|---|
| `pause` | `paused` |
| `run` | `running` |

```
an:play:pause       → animation-play-state: paused
an:play:run         → animation-play-state: running
```

#### `an:timeline` — scroll-driven animations

| Alias | Value |
|---|---|
| `a` | `auto` |
| `scroll` | `scroll()` |
| `view` | `view()` |

```
an:timeline:scroll  → animation-timeline: scroll()
an:timeline:view    → animation-timeline: view()
```

#### `an:range` — animation range

| Alias | Value |
|---|---|
| `norm` | `normal` |
| `cover` | `cover` |
| `contain` | `contain` |
| `entry` | `entry` |
| `exit` | `exit` |
| `entryCross` | `entry-crossing` |
| `exitCross` | `exit-crossing` |

#### `an:comp` — animation composite

| Alias | Value |
|---|---|
| `add` | `additive` |
| `rep` | `replace` |
| `acc` | `accumulate` |

#### Full animation example

```html
<div class="an:800:fadeIn an:fill:both an:delay:200">Fade in with delay</div>
<div class="an:1000:spin an:count:inf an:func:line">Infinite spinner</div>
<div class="hov:an:300:pulse">Pulse on hover</div>
<div class="an:timeline:view an:range:cover">Scroll-driven animation</div>
```

---

### Cursor

**Key:** `cursor` | **CSS:** `cursor`

Accepts any valid CSS cursor value (no aliases, passed through directly).

#### Examples

```
cursor:pointer      → cursor: pointer
cursor:default      → cursor: default
cursor:none         → cursor: none
cursor:grab         → cursor: grab
cursor:grabbing     → cursor: grabbing
cursor:not-allowed  → cursor: not-allowed
cursor:crosshair    → cursor: crosshair
cursor:text         → cursor: text
cursor:zoom-in      → cursor: zoom-in
cursor:zoom-out     → cursor: zoom-out
cursor:move         → cursor: move
cursor:help         → cursor: help
cursor:wait         → cursor: wait

hov:cursor:pointer  → pointer on hover
```

---

### Object Fit

**Key:** `of` | **CSS:** `object-fit`

#### Aliases

| Alias | Value |
|---|---|
| `cover` | `cover` |
| `contain` | `contain` |
| `fill` | `fill` |
| `none` | `none` |
| `scaleDown` | `scale-down` |

#### Examples

```
of:cover        → object-fit: cover
of:contain      → object-fit: contain
of:fill         → object-fit: fill
of:none         → object-fit: none
of:scaleDown    → object-fit: scale-down

md:of:cover     → @media md → object-fit: cover
```

---

### Group Hover

**Key:** `group` | **CSS:** `.group:hover .{child} { ... }`

Apply `group` to a parent element, then use `group:{rule}:{value}` on child elements. The child styles activate when the **parent** is hovered.

#### Examples

```
group                   → marks element as group container
group:bg:blue           → .group:hover .{class} { background-color: ... }
group:text:white        → .group:hover .{class} { color: white }
group:op:100            → .group:hover .{class} { opacity: 1 }
group:tf:ty:[-4px]      → .group:hover .{class} { translateY(-4px) }
group:scale:[1.05]      → .group:hover .{class} { scale: 1.05 }

md:group:bg:blue        → same but inside @media md
```

#### Example markup

```html
<div class="group pos:rel ov:hid br:12">
  <img class="w:f h:f of:cover ts:300 group:scale:[1.05]" src="photo.jpg">
  <div class="pos:abs b:0 s:0 w:f p:16
              bg:black bg:op:0 group:bg:op:60
              text:white op:0 group:op:100
              ts:300">
    Caption appears on hover
  </div>
</div>
```

---

## Adding Custom Rules

A rule is a plain object implementing `IRule`. Pass rules in the `rules` option of `AirCss.setup()` or `new AirCss()`.

### IRule interface

```ts
interface IRule {
  key?: string;             // Class name key (e.g. 'my-rule' → class="my-rule:value")
  styles?: Record<string, unknown>;  // CSS template — use '{value}' placeholder
  units?: string;           // Override default units for numeric values ('' = no unit)
  values?: Record<string, any>;      // Named aliases: 'a' → 'auto', etc.
  init?: (airCss: AirCss) => void;   // Runs once at startup
  override?: (el: HTMLElement, extracted: IExtractedClass, airCss: AirCss) => IExtractedClass | null;
  callback?: (el: HTMLElement, extracted: IExtractedClass, airCss: AirCss) => void;
}
```

### Example 1 — Simple rule with styles and aliases

```ts
import { AirCss, IRule } from 'aircss';

const textGradient: IRule = {
  key: 'tg',
  styles: {
    'background': '{value}',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    'background-clip': 'text',
  },
  values: {
    fire:  'linear-gradient(90deg, #ff6a00, #ee0979)',
    ocean: 'linear-gradient(90deg, #0099f7, #f11712)',
    candy: 'linear-gradient(90deg, #a18cd1, #fbc2eb)',
  },
};

AirCss.setup({ rules: { textGradient } });
```

```html
<h1 class="tg:fire">Fire gradient text</h1>
<h1 class="tg:ocean">Ocean gradient text</h1>
```

### Example 2 — Rule with custom units

```ts
const zoomLevel: IRule = {
  key: 'zoom',
  units: '%',        // numeric values get '%' instead of default 'px'
  styles: {
    zoom: '{value}',
  },
};

// zoom:150 → zoom: 150%
```

### Example 3 — Rule with `override` (custom value logic)

```ts
const aspectRatioCustom: IRule = {
  key: 'ratio',
  styles: { 'aspect-ratio': '{value}' },
  override: (el, extracted, airCss) => {
    // Input: "ratio:16:9" → extracted.value = "16:9"
    const [w, h] = extracted.value.split(':');
    extracted.normalizedValue = `${w} / ${h}`;
    return extracted;
  },
};

// ratio:16:9 → aspect-ratio: 16 / 9
// ratio:4:3  → aspect-ratio: 4 / 3
```

### Example 4 — Rule with `init` (global styles on startup)

```ts
const scrollbar: IRule = {
  key: 'scrollbar',
  styles: { overflow: 'auto' },
  init: (airCss) => {
    // Runs once when AirCss initializes
    airCss.addStyles({
      selector: '::-webkit-scrollbar',
      styles: { width: '6px', height: '6px' },
    });
    airCss.addStyles({
      selector: '::-webkit-scrollbar-thumb',
      styles: { background: '#555', 'border-radius': '3px' },
    });
    airCss.addStyles({
      selector: '::-webkit-scrollbar-track',
      styles: { background: 'transparent' },
    });
  },
};

// class="scrollbar" → overflow: auto + custom scrollbar globally applied
```

### Example 5 — Rule with `override` returning `null` (writes styles manually)

```ts
import { buildSelector } from 'aircss/helper/build-selector';

const bgColorCustom: IRule = {
  key: 'bgc',
  override: (el, extracted, airCss) => {
    // Write multiple CSS properties manually
    airCss.addStyles({
      breakpoint: extracted.media,
      selector: buildSelector(extracted),
      styles: {
        'background-color': extracted.value,
        'transition': 'background-color 200ms ease',
      },
    });
    return null; // returning null prevents default style writing
  },
};
```

### Example 6 — Rule with `callback` (side effects after style is written)

```ts
const lazyFade: IRule = {
  key: 'lazy',
  styles: { opacity: '0', transition: 'opacity 0.5s ease' },
  callback: (el, extracted, airCss) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        observer.unobserve(el);
      }
    });
    observer.observe(el);
  },
};

// class="lazy" → fades in when element enters viewport
```

---

## Adding Custom Styles

Use the `addStyle` and `addStyles` methods to inject CSS imperatively.

### `addStyle(media, cssString)`

Appends a raw CSS string to the style element for the given breakpoint.

```ts
const css = new AirCss();

// Base styles (no media query)
css.addStyle(null, '.my-component { display: flex; gap: 16px; }');

// Inside a breakpoint
css.addStyle('md', '.my-component { flex-direction: column; }');
css.addStyle('lg', '.my-component { padding: 32px; }');
```

### `addStyles(options)`

Structured helper — builds a CSS rule from an object.

```ts
css.addStyles({
  breakpoint: null,          // null = base, or 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  selector: '.card',
  styles: {
    'border-radius': '12px',
    'box-shadow': '0 4px 20px rgba(0,0,0,0.1)',
    'padding': '24px',
    'background': 'white',
  },
});

// With breakpoint
css.addStyles({
  breakpoint: 'md',
  selector: '.card',
  styles: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr',
  },
});
```

### In a rule's `init` hook

```ts
const myComponent: IRule = {
  key: 'card',
  init: (airCss) => {
    // Global base styles registered once at startup
    airCss.addStyles({
      selector: '.card',
      styles: { 'border-radius': '12px', overflow: 'hidden' },
    });

    // Responsive overrides
    airCss.addStyles({
      breakpoint: 'md',
      selector: '.card',
      styles: { display: 'flex', 'flex-direction': 'row' },
    });
  },
  styles: {
    // Per-instance styles based on value
    'box-shadow': '{value}',
  },
  values: {
    sm: '0 2px 8px rgba(0,0,0,0.08)',
    md: '0 4px 16px rgba(0,0,0,0.12)',
    lg: '0 8px 32px rgba(0,0,0,0.16)',
  },
};

// class="card:sm"  → box-shadow: 0 2px 8px ...
// class="card:lg"  → box-shadow: 0 8px 32px ...
```

---

## Adding Keyframe Animations

### `keyframe(name, definition)`

Register a keyframe animation. Must be called **before** the animation class is applied to the DOM.

```ts
const css = new AirCss();
// — or —
AirCss.setup();
const css = /* get instance */ new AirCss();
```

### Object syntax

```ts
css.keyframe('fadeIn', {
  from: { opacity: '0' },
  to:   { opacity: '1' },
});

css.keyframe('slideUp', {
  from: { opacity: '0', transform: 'translateY(20px)' },
  to:   { opacity: '1', transform: 'translateY(0)' },
});

css.keyframe('slideDown', {
  from: { opacity: '0', transform: 'translateY(-20px)' },
  to:   { opacity: '1', transform: 'translateY(0)' },
});

css.keyframe('pulse', {
  '0%':   { transform: 'scale(1)' },
  '50%':  { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
});

css.keyframe('spin', {
  from: { transform: 'rotate(0deg)' },
  to:   { transform: 'rotate(360deg)' },
});

css.keyframe('bounce', {
  '0%, 100%': { transform: 'translateY(0)',    'animation-timing-function': 'ease-in-out' },
  '50%':      { transform: 'translateY(-20px)', 'animation-timing-function': 'ease-in-out' },
});

css.keyframe('shake', {
  '0%, 100%': { transform: 'translateX(0)' },
  '25%':      { transform: 'translateX(-8px)' },
  '75%':      { transform: 'translateX(8px)' },
});

css.keyframe('flash', {
  '0%, 50%, 100%': { opacity: '1' },
  '25%, 75%':      { opacity: '0' },
});
```

### Raw CSS string syntax

```ts
css.keyframe('wiggle', `
  0%   { transform: rotate(-3deg); }
  50%  { transform: rotate(3deg); }
  100% { transform: rotate(-3deg); }
`);
```

### Using keyframes in HTML

```html
<!-- an:{duration}:{name} -->
<div class="an:500:fadeIn an:fill:both">Fade in</div>
<div class="an:300:slideUp an:fill:both an:delay:200">Slide up with delay</div>

<!-- an:{duration}:{name}:{timingFunction} -->
<div class="an:1000:spin:linear an:count:inf">Infinite spinner</div>
<div class="an:800:bounce:ease-in-out an:count:inf">Bounce</div>

<!-- Trigger on hover -->
<button class="hov:an:300:pulse">Pulse on hover</button>

<!-- Scroll-driven -->
<div class="an:timeline:view an:range:entry an:500:fadeIn">Animate on scroll</div>
```

### Full setup example

```ts
import { AirCss } from 'aircss';

// 1. Initialize
AirCss.setup({
  defaults: {
    animationTimingFunction: 'ease-in-out',
  },
});

const css = new AirCss();

// 2. Register all keyframes at startup
css.keyframe('fadeIn',  { from: { opacity: '0' }, to: { opacity: '1' } });
css.keyframe('fadeOut', { from: { opacity: '1' }, to: { opacity: '0' } });
css.keyframe('slideUp', { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } });
css.keyframe('spin',    { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });

// 3. Use in HTML — classes processed automatically when added to DOM
document.querySelector('.spinner').classList.add('an:1000:spin', 'an:count:inf', 'an:func:line');
```

---

## Helper Methods

### `AirCss.setup(options?): void`

Static. Creates the singleton instance or updates options on the existing one.

```ts
AirCss.setup({ defaults: { units: 'rem' } });
```

### `new AirCss(options?)`

Creates a new AirCss instance. Options same as `setup()`.

### `css.getOptions(): IOptions`

Returns the current fully merged options object.

```ts
const opts = css.getOptions();
console.log(opts.defaults.breakpoints); // { sm: 0, md: 768, ... }
console.log(opts.defaults.colors);      // { blue: { 500: '#3b82f6', ... }, ... }
```

### `css.setOptions(options?: IUserOptions): void`

Re-initializes all internal state with new options. Re-runs `initConfig`, `initClassPrefixes`, `initRules`, `initColorVariables`, `initStyleElements`, `initSpaceVariables`.

```ts
css.setOptions({ defaults: { important: false } });
```

### `css.getRules(): Record<string, IRule>`

Returns all registered rules keyed by their `key`.

```ts
const rules = css.getRules();
console.log(rules['bg']); // backgroundColor IRule object
```

### `css.getRuleWithKey(key: string): IRule | undefined`

Returns a single rule by key.

```ts
const widthRule = css.getRuleWithKey('w');
```

### `css.getClassPrefixes(): string[]`

Returns all valid class prefixes (e.g. `['hov:', 'sm:', 'md:', 'lg:', ...]`).

```ts
console.log(css.getClassPrefixes());
// ['hov:', 'sm:', 'md:', 'lg:', 'xl:', 'xxl:', 'hov:sm:', 'hov:md:', ...]
```

### `css.addStyle(media, cssString): void`

Appends a CSS string to the style element for the given breakpoint.

```ts
css.addStyle(null, '.reset { margin: 0; padding: 0; }');
css.addStyle('md', '.layout { display: grid; }');
```

| `media` | Writes to |
|---|---|
| `null` | base `<style>` tag (no media query) |
| `'md'` | `<style media="(min-width: 768px)">` |
| `'lg'` | `<style media="(min-width: 1024px)">` |

### `css.addStyles(options): void`

Structured CSS injection.

```ts
css.addStyles({
  breakpoint: 'lg',          // optional — defaults to null (base)
  selector: '.container',
  styles: {
    'max-width': '1200px',
    'margin': '0 auto',
  },
});
```

**Signature:**
```ts
addStyles(options: {
  breakpoint?: string | null;
  selector: string;
  styles: Record<string, string | number>;
}): void
```

### `css.keyframe(name, definition): void`

Registers a `@keyframes` animation.

```ts
css.keyframe('name', { from: {...}, to: {...} }); // object syntax
css.keyframe('name', `from {...} to {...}`);       // raw CSS string
```

**Signature:**
```ts
keyframe(name: string, value: string | IKeyframe): void
```

where `IKeyframe` is:

```ts
type IKeyframe = Record<string, Record<string, string>>;
// e.g. { 'from': { opacity: '0' }, 'to': { opacity: '1' } }
```

### `css.listen(pattern, callback): MutationObserver | undefined`

Watches for class mutations on the DOM. Callback fires whenever a matching class is added to any element.

```ts
const observer = css.listen('bg:*', (el, className) => {
  console.log('bg rule applied:', className, el);
});

// Watch all classes
css.listen('*', (el, className) => {
  analytics.track('class_applied', { className });
});

// Stop watching
observer?.disconnect();
```

**Signature:**
```ts
listen(
  pattern: string,
  callback: (el: HTMLElement, className: string) => void
): MutationObserver | undefined
```

### `css.getCssColorName(value, rgb?): string | null`

Returns the CSS variable name for a color, or `null` if the color doesn't exist.

```ts
css.getCssColorName('blue');           // '--as-blue'
css.getCssColorName('blue:500');       // '--as-blue-500'
css.getCssColorName(['blue', '700']);  // '--as-blue-700'
css.getCssColorName('blue', true);     // '--as-blue-rgb'
css.getCssColorName('blue:500', true); // '--as-blue-500-rgb'
css.getCssColorName('unknown');        // null
```

**Signature:**
```ts
getCssColorName(value: string | string[], rgb?: boolean): string | null
```

### `css.getCssColorValue(value, rgb?): string | null`

Returns a `var(...)` expression for a color.

```ts
css.getCssColorValue('blue:500');       // 'var(--as-blue-500)'
css.getCssColorValue('primary');        // 'var(--as-primary)'
css.getCssColorValue('blue:500', true); // 'var(--as-blue-500-rgb)'
css.getCssColorValue('unknown');        // null
```

**Signature:**
```ts
getCssColorValue(value: string | string[], rgb?: boolean): string | null
```

### `css.getCssSpaceName(value): string | null`

Returns the CSS variable name for a spacing token, or `null` if not found.

```ts
css.getCssSpaceName('md');   // '--as-spacing-md'
css.getCssSpaceName('xl');   // '--as-spacing-xl'
css.getCssSpaceName('2xl');  // null (doesn't exist by default)
```

**Signature:**
```ts
getCssSpaceName(value: string): string | null
```

### `css.getCssSpaceValue(value): string | null`

Returns a `var(...)` expression for a spacing token.

```ts
css.getCssSpaceValue('md');  // 'var(--as-spacing-md)'
css.getCssSpaceValue('lg');  // 'var(--as-spacing-lg)'
css.getCssSpaceValue('xs');  // null (if not configured)
```

**Signature:**
```ts
getCssSpaceValue(value: string): string | null
```

### `css.getStyleElement(media, callback): void`

Low-level access to a `<style>` DOM element. Useful if you need to directly manipulate style content.

```ts
css.getStyleElement(null, (styleEl) => {
  console.log(styleEl.innerHTML); // all base styles
});

css.getStyleElement('md', (styleEl) => {
  styleEl.innerHTML = ''; // clear md styles
});
```

**Signature:**
```ts
getStyleElement(
  media: string | null | undefined,
  callback: (style: HTMLStyleElement) => void
): void
```
