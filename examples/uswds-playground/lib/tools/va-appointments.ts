import { tool } from "ai";
import { z } from "zod";

const ALL_APPOINTMENTS = [
  {
    id: "apt-001",
    date: "2026-03-15T10:00:00Z",
    provider: "Dr. Sarah Chen",
    facility: "VA Portland Medical Center",
    type: "in_person" as const,
    department: "Primary Care",
    status: "completed",
    notes: "Annual physical exam",
  },
  {
    id: "apt-002",
    date: "2026-03-22T14:30:00Z",
    provider: "Dr. Michael Ramirez",
    facility: "VA Portland Medical Center",
    type: "telehealth" as const,
    department: "Mental Health",
    status: "completed",
    notes: "Follow-up session",
  },
  {
    id: "apt-003",
    date: "2026-04-02T09:00:00Z",
    provider: "Dr. Lisa Park",
    facility: "VA Portland Medical Center",
    type: "in_person" as const,
    department: "Cardiology",
    status: "completed",
    notes: "Stress test results review",
  },
  {
    id: "apt-004",
    date: "2026-04-20T11:00:00Z",
    provider: "Dr. James Wilson",
    facility: "VA Portland Medical Center",
    type: "in_person" as const,
    department: "Primary Care",
    status: "scheduled",
    notes: "Routine checkup",
  },
  {
    id: "apt-005",
    date: "2026-04-28T15:00:00Z",
    provider: "Dr. Sarah Chen",
    facility: "VA Portland Medical Center",
    type: "telehealth" as const,
    department: "Primary Care",
    status: "scheduled",
    notes: "Lab results discussion",
  },
];

export const getVAAppointments = tool({
  description:
    "Get VA medical appointments for the veteran. Use timeframe='past_month' for completed visits, 'upcoming' for future ones. Optionally filter by type (telehealth or in_person).",
  inputSchema: z.object({
    timeframe: z.enum(["past_month", "upcoming"]),
    type: z.enum(["telehealth", "in_person"]).nullish(),
  }),
  execute: async ({ timeframe, type }) => {
    const status = timeframe === "past_month" ? "completed" : "scheduled";
    return ALL_APPOINTMENTS.filter((a) => {
      if (a.status !== status) return false;
      if (type && a.type !== type) return false;
      return true;
    });
  },
});
