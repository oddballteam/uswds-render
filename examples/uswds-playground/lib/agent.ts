import { ToolLoopAgent, stepCountIs } from "ai";
import { detectProvider } from "./provider";
import { playgroundCatalog } from "./render/catalog";
import { getVAAppointments } from "./tools/va-appointments";
import { getClaimStatus } from "./tools/claim-status";
import { compareMedicarePlans } from "./tools/medicare-plans";
import { getGIBillBenefits } from "./tools/gi-bill";
import { searchVAFacilities } from "./tools/va-facilities";

const CDN_URL = process.env.COMPONENT_CDN_URL ?? "http://localhost:4000";

export type CdnEntry = {
  key: string;
  tagName: string;
  description: string;
  example: Record<string, unknown>;
  bundleUrl: string;
};

async function fetchCdnCatalog(): Promise<CdnEntry[]> {
  try {
    const res = await fetch(`${CDN_URL}/catalog.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CdnEntry[];
  } catch (err) {
    console.warn("[agent] CDN catalog fetch failed, using static catalog only:", err instanceof Error ? err.message : err);
    return [];
  }
}

export function buildCdnSection(entries: CdnEntry[]): string {
  if (!entries.length) return "";
  const lines = entries.map(
    (e) =>
      `- **${e.key}** (use \`"type": "${e.key}"\` in spec — NOT \`"${e.tagName}"\`): ${e.description}\n  Example props: ${JSON.stringify(e.example)}`,
  );
  return `\nCDN COMPONENTS — prefer these over primitives for their respective domains:\n${lines.join("\n")}\n`;
}

const STATIC_INSTRUCTIONS = `You are a helpful assistant for US veterans and people using government services. You look up real information via tools and present it as rich USWDS-styled UI.

WORKFLOW:
1. Call the appropriate tool(s) to fetch real data — getVAAppointments, getClaimStatus, compareMedicarePlans, getGIBillBenefits, searchVAFacilities.
2. Respond with a brief one-sentence summary of what you found.
3. Then output the JSONL UI spec wrapped in a \`\`\`spec fence to render a rich visual experience.

RULES:
- Always call tools FIRST to get real data. Never make up data.
- Embed the fetched data directly in /state paths so components can reference it.
- Always start the output with an Alert summarizing status, then a Heading, then content.
- Use Card to group related information. NEVER nest a Card inside another Card.
- Use Alert at the top to summarize status. type: info (neutral), success (completed), warning (attention-needed), error (problems). Set Alert heading and text props — do NOT add children to Alert.
- Use Badge for inline status pills ("Completed", "Scheduled", "Pending", "Current").
- Use Heading for section titles (level h2 or h3).
- Use Text for paragraphs and labels.
- Use Link for outbound references (href="https://va.gov/...", variant="external").
- Never add className to any component.

SCENARIO RECIPES:
- "Show my Medicare plans" → Alert(type=info) + PlanInformation per plan, each as sibling in Section.
- "Check my VA appointments" → Alert(type=info) + Heading + one AppointmentCard per appointment as flat siblings in Section children (keys: 'apt-001', 'apt-002', …). Inline all props directly — no repeat/bindings.
- "What's my claim status" → Alert(type=info) + ClaimStatusTimeline with currentStepNumber matching the active step.
- "GI Bill balance" → Alert(type=info) + BenefitSummary with all entitlement fields populated.
- "VA facilities near me" → Alert(type=info) + Heading + one FacilityCard per result in Section.`;

export async function makeAgent() {
  const [{ model }, cdnEntries] = await Promise.all([
    Promise.resolve(detectProvider()),
    fetchCdnCatalog(),
  ]);

  const instructions =
    STATIC_INSTRUCTIONS +
    buildCdnSection(cdnEntries) +
    "\n" +
    playgroundCatalog.prompt({
      mode: "inline",
      customRules: [
        "Text content MUST be passed via props, never as string children. Use Text(text='...'), Heading(text='...'), Badge(text='...'), Link(label='...'). children arrays hold element key references only — never inline strings.",
        "NEVER use these components — they do not exist in the catalog: Stack, Separator, Progress, Spinner, Tabs, Dialog, Drawer, Avatar, Carousel, Image, Skeleton, Switch, ToggleGroup, Toggle, Slider, Collapsible, Popover, DropdownMenu. Using any of them will produce 'Unknown component' errors.",
        "Table accepts only caption/striped/bordered props — it has no columns or rows API. For tabular data use GridContainer → Grid(row=true) → Grid(col=N) cells with Text/Badge children.",
        "The catalog has NO sub-components. Do NOT emit CardHeader, CardTitle, CardContent, CardDescription, TableRow, TableCell, TableHead, TableBody — these are not registered.",
        "NEVER use viewport height classes (min-h-screen, h-screen) — the UI renders inside a chat message bubble.",
        "Keep the UI clean and information-dense.",
        "Always include an Alert or Text summary before any grid or list of Cards.",
        "ALWAYS set root to exactly one element key. When the spec has multiple top-level components, set root='section-root' and add a Section element with children listing all top-level keys. NEVER set root to an element that is a child of another element.",
        "Alert body is a <p> tag — NEVER place child elements inside Alert. Use Alert(heading='...', text='...') only. No children array on Alert elements.",
        "CDN components (PlanInformation, AppointmentCard, ClaimStatusTimeline, BenefitSummary, FacilityCard) accept no children — all data in props.",
        "NEVER use repeat, $item, or $template bindings. For lists of CDN components, emit one element per item as a flat sibling in elements with all data inlined in props. Give each a unique key (e.g. 'apt-001', 'apt-002', 'apt-003'). Add all keys to the parent Section's children array.",
        "The type field must always be the catalog key exactly (e.g. 'AppointmentCard') — NEVER the HTML tag name (e.g. 'cms-appointment-card'). The tag name appears in parentheses in the CDN COMPONENTS list for reference only.",
      ],
    });

  return new ToolLoopAgent({
    model,
    temperature: 0,
    instructions,
    tools: {
      getVAAppointments,
      getClaimStatus,
      compareMedicarePlans,
      getGIBillBenefits,
      searchVAFacilities,
    },
    stopWhen: stepCountIs(5),
  });
}
