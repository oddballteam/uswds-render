declare module "jest-axe" {
  export function configureAxe(
    options?: Record<string, unknown>,
  ): (html: Element | string) => Promise<unknown>;

  export const axe: (html: Element | string) => Promise<unknown>;

  /** Passed to `expect.extend()` in `tests/setup.ts`. */
  export const toHaveNoViolations: import("vitest").MatchersObject<
    import("vitest").MatcherState
  >;
}
