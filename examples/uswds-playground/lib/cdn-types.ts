export type CdnEntry = {
  key: string;
  tagName: string;
  description: string;
  example: Record<string, unknown>;
  bundleUrl: string;
  propDescriptions?: Record<string, string>;
};
