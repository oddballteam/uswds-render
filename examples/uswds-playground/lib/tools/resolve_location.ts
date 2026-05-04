import { tool } from "ai";
import { z } from "zod";

type Location = {
  zip: string;
  city: string;
  state: string;
  stateCode: string;
  county: string;
  fipsCode: string;
};

const LOCATIONS: Record<string, Location> = {
  "90210": {
    zip: "90210",
    city: "Beverly Hills",
    state: "California",
    stateCode: "CA",
    county: "Los Angeles County",
    fipsCode: "06037",
  },
  "10001": {
    zip: "10001",
    city: "New York",
    state: "New York",
    stateCode: "NY",
    county: "New York County",
    fipsCode: "36061",
  },
  "33101": {
    zip: "33101",
    city: "Miami",
    state: "Florida",
    stateCode: "FL",
    county: "Miami-Dade County",
    fipsCode: "12086",
  },
  "97201": {
    zip: "97201",
    city: "Portland",
    state: "Oregon",
    stateCode: "OR",
    county: "Multnomah County",
    fipsCode: "41051",
  },
  "60601": {
    zip: "60601",
    city: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    county: "Cook County",
    fipsCode: "17031",
  },
  "78701": {
    zip: "78701",
    city: "Austin",
    state: "Texas",
    stateCode: "TX",
    county: "Travis County",
    fipsCode: "48453",
  },
};

const DEFAULT: Location = LOCATIONS["97201"]!;

export const resolve_location = tool({
  description:
    "Resolve a ZIP code (or a fallback city/state) to FIPS county code, city, and state. Call this before search_medicare_plans or other location-aware tools so plan results match the beneficiary's rating region.",
  inputSchema: z.object({
    zip: z.string().describe("5-digit ZIP code."),
    fallbackCity: z.string().nullish(),
    fallbackState: z.string().nullish().describe("Two-letter state code used when the ZIP is unknown."),
  }),
  execute: async ({ zip, fallbackCity, fallbackState }) => {
    const match = LOCATIONS[zip];
    if (match) {
      return { location: match, matched: "zip" as const };
    }
    if (fallbackState) {
      const byState = Object.values(LOCATIONS).find((l) => l.stateCode === fallbackState.toUpperCase());
      if (byState) return { location: byState, matched: "state" as const };
    }
    if (fallbackCity) {
      const byCity = Object.values(LOCATIONS).find((l) => l.city.toLowerCase() === fallbackCity.toLowerCase());
      if (byCity) return { location: byCity, matched: "city" as const };
    }
    return {
      location: { ...DEFAULT, zip },
      matched: "default" as const,
      note: "ZIP not in demo dataset — using Portland, OR as a representative sample market.",
    };
  },
});
