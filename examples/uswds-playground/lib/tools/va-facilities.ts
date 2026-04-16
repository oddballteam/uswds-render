import { tool } from "ai";
import { z } from "zod";

const ALL_FACILITIES = [
  {
    name: "VA Portland Medical Center",
    type: "health" as const,
    address: "3710 SW US Veterans Hospital Rd, Portland, OR 97239",
    phone: "(503) 220-8262",
    distance: "3.2 miles",
    hours: "Mon-Fri 8:00 AM - 4:30 PM",
    services: ["Primary Care", "Mental Health", "Pharmacy", "Lab"],
    waitTime: "12 days average",
  },
  {
    name: "Portland VA Regional Benefits Office",
    type: "benefits" as const,
    address: "100 SW Main St, Portland, OR 97204",
    phone: "(800) 827-1000",
    distance: "0.5 miles",
    hours: "Mon-Fri 8:00 AM - 4:00 PM",
    services: ["Disability Claims", "Education", "Home Loans", "Vocational Rehab"],
    waitTime: "Walk-in or appointment",
  },
  {
    name: "Willamette National Cemetery",
    type: "cemetery" as const,
    address: "11800 SE Mt Scott Blvd, Portland, OR 97086",
    phone: "(503) 273-5250",
    distance: "9.8 miles",
    hours: "Daily 8:00 AM - sunset",
    services: ["Burial", "Memorial Services", "Grounds"],
    waitTime: "N/A",
  },
  {
    name: "Vancouver VA Clinic",
    type: "health" as const,
    address: "1601 E 4th Plain Blvd, Vancouver, WA 98661",
    phone: "(360) 759-1901",
    distance: "11.4 miles",
    hours: "Mon-Fri 7:30 AM - 4:00 PM",
    services: ["Primary Care", "Mental Health", "Women's Health"],
    waitTime: "6 days average",
  },
];

export const searchVAFacilities = tool({
  description:
    "Search for VA facilities near a location. Optionally filter by serviceType (health, benefits, cemetery).",
  inputSchema: z.object({
    location: z.string(),
    serviceType: z.enum(["health", "benefits", "cemetery"]).nullish(),
    radius: z.number().nullish(),
  }),
  execute: async ({ serviceType }) => {
    return ALL_FACILITIES.filter((f) => {
      if (serviceType && f.type !== serviceType) return false;
      return true;
    });
  },
});
