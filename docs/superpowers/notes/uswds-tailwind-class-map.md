# USWDS Tailwind v4 Class Map

Vendored preset: `packages/uswds/src/lib/tokens/` (sourced from IHIutch/uswds-tailwind MIT).

Files inspected:
- `packages/uswds/src/lib/tokens/index.css` — Tailwind v4 CSS-first layer. Contains the full `@theme` block (colors, fonts, text sizes, containers, breakpoints), two `@utility` rules (`text-*`, `font-*`), and several `@custom-variant` declarations. Loads `@tailwindcss/forms`, `tailwindcss-animate`, `@iconify/tailwind4`, `@tailwindcss/typography`, and references `@config "@uswds-tailwind/theme/tailwind.config.ts"`.
- `packages/uswds/src/lib/tokens/tailwind.config.ts` — JS config supplying only a `@tailwindcss/typography` `DEFAULT.css` recipe (prose styles wired to USWDS fonts/colors). **No `theme.extend.colors`, no plugins registering custom utilities.**

**Big picture:** This preset is a thin CSS-first surface that exposes USWDS's *raw* color/token palette (e.g. `blue-60v`, `gray-cool-10`, `red-50`) and font stacks. It does **not** define any USWDS semantic aliases (`primary`, `base`, `ink`, `success`, `error`, `accent-cool`, `emergency`, `info`) or any `usa-*` component utilities. There are no custom radii, shadows, spacing units, or focus-ring utilities beyond stock Tailwind v4 defaults.

---

## Colors

The preset defines **raw USWDS color families only**, each with numeric grade tokens. Every `--color-<family>-<grade>` variable is automatically exposed as `bg-<family>-<grade>`, `text-<family>-<grade>`, `border-<family>-<grade>`, `fill-<family>-<grade>`, `ring-<family>-<grade>`, `outline-<family>-<grade>`, etc. by Tailwind v4.

### Families available

- **Reds:** `red`, `red-cool`, `red-warm`
- **Oranges:** `orange`, `orange-warm`
- **Yellow/Gold:** `gold`, `yellow`
- **Greens:** `green`, `green-warm`, `green-cool`, `mint`, `mint-cool`
- **Cyans/Blues:** `cyan`, `blue`, `blue-cool`, `blue-warm`
- **Indigos:** `indigo`, `indigo-cool`, `indigo-warm`
- **Violets/Magenta:** `violet`, `violet-warm`, `magenta`
- **Grays:** `gray`, `gray-cool`, `gray-warm`
- **Utility:** `transparent`, `current`

### Grades

- Colored families: `5, 10, 20, 30, 40, 50, 60, 70, 80, 90` plus vivid variants `5v, 10v, 20v, 30v, 40v, 50v, 60v, 70v, 80v` (no `90v`).
- Grays: `1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90` (no vivid variants). Gray-cool has `1..5` fine grades on the light end.

No `black` / `white` tokens are defined in `@theme` — use Tailwind v4 built-ins (`bg-white`, `bg-black`) which v4 keeps by default, OR reference via arbitrary values. The typography config does call `theme('--color-black')` / `theme('--color-white')`, suggesting Tailwind v4's default `white`/`black` are available.

### Plan → actual mapping

| Plan-assumed class | Actual class | Notes |
|---|---|---|
| `bg-primary` | `bg-blue-60v` | USWDS default "primary" = Blue-60v (#005ea2). No `primary` alias exists. |
| `bg-primary-dark` | `bg-blue-70v` | |
| `bg-primary-darker` | `bg-blue-80v` | |
| `bg-primary-light` | `bg-blue-30v` | |
| `bg-primary-lighter` | `bg-blue-10v` | |
| `bg-primary-vivid` | `bg-blue-warm-60v` (`#0050d8`) | USWDS "primary-vivid" token. |
| `bg-secondary` | `bg-red-50` (`#d83933`) | USWDS "secondary" = Red-50. |
| `bg-secondary-dark` | `bg-red-60v` | |
| `bg-secondary-vivid` | `bg-red-warm-50v` | |
| `text-ink` | `text-gray-90` | USWDS "ink" ≈ Gray-90 (#1b1b1b). Typography preset uses `--color-black` for prose; for body text Gray-90 is the conventional USWDS mapping. |
| `bg-base` | `bg-gray-cool-60` | USWDS "base" = Gray-cool-60. |
| `text-base-dark` | `text-gray-cool-70` | |
| `text-base-darker` | `text-gray-cool-80` | |
| `text-base-darkest` | `text-gray-cool-90` | |
| `border-base-light` | `border-gray-cool-30` | |
| `border-base-lighter` | `border-gray-cool-20` | |
| `bg-base-lightest` | `bg-gray-cool-5` | |
| `bg-success` | `bg-green-cool-50v` (`#008817`) | USWDS success. |
| `bg-success-light` | `bg-green-cool-20v` | |
| `bg-success-lighter` | `bg-green-cool-5` | |
| `bg-success-dark` | `bg-green-cool-60v` | |
| `bg-success-darker` | `bg-green-cool-70v` | |
| `bg-warning` | `bg-gold-20v` (`#ffbe2e`) | USWDS warning. |
| `bg-warning-light` | `bg-gold-10v` | |
| `bg-warning-lighter` | `bg-gold-5v` | |
| `bg-warning-dark` | `bg-gold-30v` | |
| `bg-warning-darker` | `bg-gold-40v` | |
| `bg-error` | `bg-red-60v` (`#b50909`) | USWDS error. |
| `bg-error-light` | `bg-red-30v` | |
| `bg-error-lighter` | `bg-red-10v` | |
| `bg-error-dark` | `bg-red-70v` | |
| `bg-error-darker` | `bg-red-80v` | |
| `bg-emergency` | `bg-red-warm-60v` (`#9c3d10`)? USWDS emergency = `#9c3d10` | Use `bg-red-warm-60v`. |
| `bg-emergency-dark` | `bg-red-warm-80v` | |
| `bg-info` | `bg-cyan-30v` (`#00bde3`) | USWDS info. |
| `bg-info-light` | `bg-cyan-10v` | |
| `bg-info-lighter` | `bg-cyan-5` | |
| `bg-info-dark` | `bg-cyan-40v` | |
| `bg-info-darker` | `bg-cyan-60v` | |
| `bg-accent-cool` | `bg-blue-cool-40v` (`#28a0cb`) | USWDS accent-cool. |
| `bg-accent-cool-dark` | `bg-blue-cool-60v` | |
| `bg-accent-cool-light` | `bg-blue-cool-20v` | |
| `bg-accent-warm` | `bg-orange-30v` (`#fa9441`) | USWDS accent-warm. |
| `bg-accent-warm-dark` | `bg-orange-50v` | |
| `bg-accent-warm-light` | `bg-orange-10v` | |
| `text-violet` / `bg-violet` | `text-violet-70v` / `bg-violet-50v` | For link-visited style, typography config uses `--color-violet-70v`. |
| `bg-white` / `text-white` | `bg-white` / `text-white` | Tailwind v4 default. |
| `bg-black` | `bg-black` | Tailwind v4 default. |

**Recommendation:** Downstream components should either (a) use the raw USWDS class names directly, or (b) add a small semantic-alias layer to `index.css` that defines `--color-primary: var(--color-blue-60v)`, etc., so the plan-assumed names work. Option (b) is cheaper than rewriting every component recipe. See "Deltas from plan" below.

---

## Typography

### Font families

Defined in `@theme`; exposed via the custom `@utility font-*` rule which also sets `--font-normalization` from the `--multiplier` side-token.

| Actual class | Stack | Multiplier |
|---|---|---|
| `font-open-sans` | Open Sans Variable → system | 1.01 |
| `font-public-sans` | Public Sans Variable → system | 1.00 |
| `font-merriweather` | Merriweather Variable → serif | 0.98 |
| `font-source-sans` | Source Sans 3 Variable → system | 1.06 |
| `font-roboto-mono` | Roboto Mono Variable → mono | 0.95 |
| `font-georgia` | Georgia → serif | 1.05 |
| `font-helvetica` | Helvetica Neue → system | 1.01 |
| `font-tahoma` | Tahoma → system | 1.00 |
| `font-verdana` | Verdana → system | 0.99 |

**No `font-sans` / `font-serif` / `font-mono` aliases are defined.** Tailwind v4's defaults may still emit them unless overridden; to match USWDS, use the explicit family classes above. Typography/prose defaults to `font-source-sans`. Headings default to `font-merriweather`.

### Font weights

Not defined in `@theme` → Tailwind v4 defaults apply: `font-thin` (100), `font-extralight` (200), `font-light` (300), `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700), `font-extrabold` (800), `font-black` (900). All usable.

### Font sizes

Exposed via `@utility text-*` which multiplies the size by `--font-normalization` (scaling per-family to match USWDS x-height normalization).

| Class | Size (rem) | Line-height ratio |
|---|---|---|
| `text-xs` | 0.75 | 1/0.75 |
| `text-sm` | 0.875 | 1.25/0.875 |
| `text-base` | 1.0 | 1.5 |
| `text-lg` | 1.125 | 1.75/1.125 |
| `text-xl` | 1.25 | 1.75/1.25 |
| `text-2xl` | 1.5 | 2/1.5 |
| `text-3xl` | 1.875 | 2.25/1.875 |
| `text-4xl` | 2.25 | 2.5/2.25 |
| `text-5xl` | 3.0 | 1 |
| `text-6xl` | 3.75 | 1 |
| `text-7xl` | 4.5 | 1 |
| `text-8xl` | 6.0 | 1 |
| `text-9xl` | 8.0 | 1 |

Line-height utilities (`leading-*`): not customized → Tailwind v4 defaults (`leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose`).

Letter-spacing (`tracking-*`): not customized → Tailwind v4 defaults.

---

## Spacing / sizing

**Not customized.** No `--spacing-*` overrides in `@theme`, so Tailwind v4's default `--spacing: 0.25rem` step applies. Use standard `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`, `space-x-*`, `w-*`, `h-*` utilities. The typography config references `--spacing(N)` via Tailwind's arbitrary-spacing syntax, confirming the default spacing scale is in use.

### Containers / breakpoints

Custom container queries + breakpoints are defined:

| Class | Size |
|---|---|
| `@container-card` / `card:` | 160px |
| `@container-card-lg` / `card-lg:` | 240px |
| `@container-mobile` / `mobile:` | 320px |
| `@container-mobile-lg` / `mobile-lg:` | 480px |
| `@container-tablet` / `tablet:` | 640px |
| `@container-tablet-lg` / `tablet-lg:` | 880px |
| `@container-desktop` / `desktop:` | 1024px |
| `@container-desktop-lg` / `desktop-lg:` | 1200px |
| `@container-widescreen` / `widescreen:` | 1400px |
| `max-w-prose` | 68ex (`--container-prose`) |

Prefer `tablet:`, `desktop:`, `widescreen:` (USWDS breakpoint names) over Tailwind's stock `md:`/`lg:`/`xl:` — those stock names are **not** remapped, so they still use Tailwind defaults unless overridden. Use the USWDS-named ones for USWDS-accurate responsive behavior.

---

## Radii

**Not customized.** No `--radius-*` in `@theme`. Tailwind v4 defaults apply:

| Class | Size |
|---|---|
| `rounded-none` | 0 |
| `rounded-xs` / `rounded-sm` | 0.125rem / 0.25rem |
| `rounded` / `rounded-md` | 0.25rem / 0.375rem |
| `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-3xl` | 0.5 / 0.75 / 1 / 1.5rem |
| `rounded-full` | 9999px |

USWDS components typically use `rounded` (4px) for buttons/inputs; use `rounded-md` or `rounded` to match.

---

## Focus ring

**No USWDS-specific focus utility is defined.** No `@utility usa-focus`, no `--ring-*` tokens, no `--outline-*` tokens.

Use stock Tailwind v4 utilities:

- `outline-2` (or `outline-[0.25rem]` for USWDS's 0.25rem/4px outline width)
- `outline-offset-0` or `outline-offset-2`
- `outline-gold-20v` (USWDS focus color is Gold-20v `#ffbe2e`)
- `focus-visible:` or `focus:` variant prefix

**Canonical USWDS focus recipe:**
```
focus:outline-[0.25rem] focus:outline-gold-20v focus:outline-offset-0
```
or
```
focus-visible:outline-[0.25rem] focus-visible:outline-gold-20v focus-visible:outline-offset-0
```

**Recommendation:** Add a `@utility usa-focus` block to `index.css` so components can write `focus:usa-focus`. Currently components must repeat the three-class recipe above.

---

## Shadows

**Not customized.** No `--shadow-*` in `@theme`. Tailwind v4 defaults apply: `shadow-xs`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-inner`, `shadow-none`. USWDS shadow tokens are not exposed.

---

## Custom `@utility` blocks

| Class | Purpose |
|---|---|
| `text-*` | Sets `font-size` and `line-height` from `--text-*` theme tokens, multiplied by `var(--font-normalization)` so that x-height scales consistently across font families. |
| `font-*` | Sets `font-family` from `--font-*` theme tokens and also writes `--font-normalization` from the `--multiplier` side-token so subsequent `text-*` utilities scale correctly. |

**No `usa-*` component utilities exist** (no `usa-button`, `usa-input`, `usa-focus`, etc.). Components must compose raw Tailwind utilities.

---

## Custom `@custom-variant` blocks

| Variant | Selector |
|---|---|
| `thumb:` | Targets `::-webkit-slider-runnable-track`, `::-moz-range-track`, `::-ms-track` (note: same selectors as `track:` — appears to be a naming bug upstream, see below). |
| `track:` | Targets `::-webkit-slider-runnable-track ::-moz-range-track`, `::-ms-track` (missing comma between first two — upstream bug; still produces working track styling for at least -webkit- and -ms-). |
| `valid:` | Applies when element has `[data-valid]` attribute (React-Aria integration). |
| `invalid:` | Applies when element has `[data-invalid]` attribute (React-Aria integration). |
| `forced-colors:` | Applies inside `@media (forced-colors: active)` (Windows High-Contrast Mode / accessibility). |

---

## Plugins enabled

- `@tailwindcss/forms` with `strategy: 'class'` — form-reset utilities only apply when you opt in with classes like `form-input`, `form-select`, `form-checkbox`, `form-radio`, `form-textarea`.
- `tailwindcss-animate` — exposes `animate-in`, `animate-out`, `fade-in-*`, `slide-in-from-*`, `zoom-in-*`, etc.
- `@iconify/tailwind4` with `scale: 0, square: false` — enables `icon-[prefix--name]` arbitrary icon utilities.
- `@tailwindcss/typography` — `prose`, `prose-lg`, etc. The `DEFAULT` prose recipe is customized in `tailwind.config.ts` to use USWDS fonts (Source Sans body, Merriweather headings, Roboto Mono code/kbd) and USWDS colors.

---

## Deltas from plan

Downstream component tasks **must** adjust these:

1. **No semantic color aliases.** Plan assumes `bg-primary`, `text-ink`, `border-base-light`, `bg-success-lighter`, `text-error-dark`, `bg-accent-cool`, etc. None exist. Two options:
   - **(A) Preferred — add aliases.** Extend `index.css` `@theme` with a small block mapping USWDS semantic names to the raw palette (e.g. `--color-primary: var(--color-blue-60v)`). Do this once before writing components, then the plan's recipes work verbatim.
   - **(B) Substitute at use site.** Replace every plan reference per the table in the Colors section (e.g. `bg-primary` → `bg-blue-60v`, `text-ink` → `text-gray-90`, `border-base-light` → `border-gray-cool-30`, `bg-success-lighter` → `bg-green-cool-5`, `text-error-dark` → `text-red-70v`).
2. **No `font-sans` / `font-serif` / `font-mono` aliases.** Plan references `font-sans`. Substitute `font-source-sans` (USWDS body default) or `font-public-sans`. For mono use `font-roboto-mono`. For serif headings use `font-merriweather`.
3. **No `usa-focus` utility.** Plan references `focus-visible:outline-2 focus-visible:outline-primary`. Substitute the full recipe: `focus-visible:outline-[0.25rem] focus-visible:outline-gold-20v focus-visible:outline-offset-0`. Consider adding a `@utility usa-focus` block to `index.css` once and reusing `focus:usa-focus` everywhere.
4. **No custom radii/shadows/spacing.** Plan recipes using `rounded-md`, `shadow-md`, `p-4` etc. work as-is (stock Tailwind v4 defaults). No substitution needed; just be aware these are not USWDS-token-backed.
5. **Breakpoint names differ.** Prefer `tablet:`, `desktop:`, `widescreen:` over `md:`, `lg:`, `xl:` for USWDS-accurate responsive breakpoints (640 / 1024 / 1400px instead of Tailwind's 768 / 1024 / 1280).
6. **Validation variants.** USWDS error/valid states use `data-invalid:` / `data-valid:` via the custom variants (React-Aria pattern), not `aria-invalid:` — use `invalid:border-red-60v`, etc.
7. **Forms plugin is class-strategy.** Inputs need `form-input` (etc.) class to receive the @tailwindcss/forms reset. Don't rely on global-reset styling.
8. **No `black` / `white` in `@theme`.** These still work via Tailwind v4 defaults (`bg-white`, `bg-black`, `text-white`, `text-black`) and are referenced by the prose recipe.

### Suggested `index.css` addition (one-time, unblocks the plan verbatim)

```css
@theme {
  /* USWDS semantic color aliases */
  --color-primary: var(--color-blue-60v);
  --color-primary-dark: var(--color-blue-70v);
  --color-primary-darker: var(--color-blue-80v);
  --color-primary-light: var(--color-blue-30v);
  --color-primary-lighter: var(--color-blue-10v);
  --color-primary-vivid: var(--color-blue-warm-60v);
  --color-secondary: var(--color-red-50);
  --color-secondary-dark: var(--color-red-60v);
  --color-secondary-light: var(--color-red-30);
  --color-secondary-vivid: var(--color-red-warm-50v);
  --color-base: var(--color-gray-cool-60);
  --color-base-dark: var(--color-gray-cool-70);
  --color-base-darker: var(--color-gray-cool-80);
  --color-base-darkest: var(--color-gray-cool-90);
  --color-base-light: var(--color-gray-cool-30);
  --color-base-lighter: var(--color-gray-cool-20);
  --color-base-lightest: var(--color-gray-cool-5);
  --color-ink: var(--color-gray-90);
  --color-success: var(--color-green-cool-50v);
  --color-success-dark: var(--color-green-cool-60v);
  --color-success-darker: var(--color-green-cool-70v);
  --color-success-light: var(--color-green-cool-20v);
  --color-success-lighter: var(--color-green-cool-5);
  --color-warning: var(--color-gold-20v);
  --color-warning-dark: var(--color-gold-30v);
  --color-warning-darker: var(--color-gold-40v);
  --color-warning-light: var(--color-gold-10v);
  --color-warning-lighter: var(--color-gold-5v);
  --color-error: var(--color-red-60v);
  --color-error-dark: var(--color-red-70v);
  --color-error-darker: var(--color-red-80v);
  --color-error-light: var(--color-red-30v);
  --color-error-lighter: var(--color-red-10v);
  --color-emergency: var(--color-red-warm-60v);
  --color-emergency-dark: var(--color-red-warm-80v);
  --color-info: var(--color-cyan-30v);
  --color-info-dark: var(--color-cyan-40v);
  --color-info-darker: var(--color-cyan-60v);
  --color-info-light: var(--color-cyan-10v);
  --color-info-lighter: var(--color-cyan-5);
  --color-accent-cool: var(--color-blue-cool-40v);
  --color-accent-cool-dark: var(--color-blue-cool-60v);
  --color-accent-cool-light: var(--color-blue-cool-20v);
  --color-accent-warm: var(--color-orange-30v);
  --color-accent-warm-dark: var(--color-orange-50v);
  --color-accent-warm-light: var(--color-orange-10v);

  /* USWDS font aliases */
  --font-sans: var(--font-source-sans);
  --font-sans--multiplier: var(--font-source-sans--multiplier);
  --font-serif: var(--font-merriweather);
  --font-serif--multiplier: var(--font-merriweather--multiplier);
  --font-mono: var(--font-roboto-mono);
  --font-mono--multiplier: var(--font-roboto-mono--multiplier);
}

@utility usa-focus {
  outline: 0.25rem solid var(--color-gold-20v);
  outline-offset: 0;
}
```

Adding this block makes `bg-primary`, `text-ink`, `border-base-light`, `font-sans`, `focus:usa-focus`, etc. work exactly as the plan specifies — with zero per-component substitutions.
