# Changelog

## 0.1.0-rc.1 — 2026-04-15

- 36 USWDS-styled React components mirroring `@json-render/shadcn` 1:1.
- Zod-based catalog (`uswdsComponentDefinitions`) for AI output validation.
- Vendored `uswds-tailwind` preset with semantic color/font aliases (MIT).
- Subpath exports: `/catalog` (Zod only), `/tokens` (Tailwind preset), `/tokens.css` (CSS layer).
- Storybook with per-component stories.
- 75 tests (unit + axe a11y + catalog contract + shadcn parity).
