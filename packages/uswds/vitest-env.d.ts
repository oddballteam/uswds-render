import type {} from "@testing-library/jest-dom/vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}
