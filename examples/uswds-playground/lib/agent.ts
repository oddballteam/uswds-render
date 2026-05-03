import { ToolLoopAgent, stepCountIs } from "ai";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";
import { detectProvider } from "./provider";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";
import { getVAAppointments } from "./tools/va-appointments";
import { getClaimStatus } from "./tools/claim-status";
import { compareMedicarePlans } from "./tools/medicare-plans";
import { getGIBillBenefits } from "./tools/gi-bill";
import { searchVAFacilities } from "./tools/va-facilities";

import type { CdnEntry } from "./cdn-types";

const CDN_URL = process.env.COMPONENT_CDN_URL ?? "http://localhost:4000";

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
  const lines = entries.map((e) => {
    const propsLine =
      e.propDescriptions && Object.keys(e.propDescriptions).length > 0
        ? `\n  Props: ${Object.entries(e.propDescriptions)
            .map(([k, v]) => `${k} (${v})`)
            .join(" · ")}`
        : "";
    return `- **${e.key}** (use \`"type": "${e.key}"\` — NOT \`"${e.tagName}"\`): ${e.description}${propsLine}\n  Example: ${JSON.stringify(e.example)}`;
  });
  return `\nCDN COMPONENTS — prefer these over primitives for their respective domains:\n${lines.join("\n")}\n`;
}

export function buildCdnRules(entries: CdnEntry[]): string {
  if (!entries.length) return "";
  const keys = entries.map((e) => e.key).join(", ");
  return `\nCDN COMPONENT RULES (apply to ${keys}):\n` +
    `- Accept no children — all data in props only.\n` +
    `- Inline all fetched data directly in props. Do NOT route data through /state — CDN components cannot read state bindings.\n` +
    `- For lists: emit one element per data item as a separate /children/- patch on the parent, each with full props inline.\n` +
    `- The type field must exactly match the catalog key — NEVER the HTML tag name.\n` +
    `- NEVER use repeat, $item, or $template bindings.\n`;
}

export function buildCdnScenarios(entries: CdnEntry[]): string {
  if (!entries.length) return "";
  const lines = entries.map((e) => {
    const trigger = e.description.split(/\.\s/)[0];
    return `- ${trigger} → use **${e.key}**`;
  });
  return `\nCDN SCENARIO RECIPES — match user intent to the right CDN component:\n${lines.join("\n")}\n`;
}

const STATIC_INSTRUCTIONS = `You are a helpful assistant for US veterans and people using government services. You look up real information via tools and present it as rich USWDS-styled UI.

WORKFLOW:
1. Call the appropriate tool(s) to fetch real data.
2. Respond with a brief one-sentence summary of what you found.
3. Then output the JSONL UI spec wrapped in a \`\`\`spec fence to render a rich visual experience.

COMPONENT PRIORITY:
CDN components are ALWAYS the first choice. When a CDN component exists for the data you are displaying, you MUST use it — never fall back to Card/Badge/Text primitives for the same domain. Primitives are only for layout and content that no CDN component covers.

RULES:
- Always call tools FIRST to get real data. Never make up data.
- For primitive components (Text, Badge, Card, etc.), embed fetched data in /state paths and reference it via $state bindings. For CDN components, inline the fetched data directly in props — CDN components cannot read from state.
- Always start the output with an Alert summarizing status, then a Heading, then content.
- Use Card to group related information ONLY when no CDN component covers the domain. NEVER nest a Card inside another Card.
- Use Alert at the top to summarize status. type: info (neutral), success (completed), warning (attention-needed), error (problems). Set Alert heading and text props — do NOT add children to Alert.
- Use Badge for inline status pills ONLY when no CDN component covers the domain.
- Use Heading for section titles (level h2 or h3).
- Use Text for paragraphs and labels ONLY when no CDN component covers the domain.
- Use Link for outbound references (href="https://va.gov/...", variant="external").
- Never add className to any component.;`

export async function makeAgent() {
  const [{ model }, cdnEntries] = await Promise.all([
    Promise.resolve(detectProvider()),
    fetchCdnCatalog(),
  ]);

  console.log(`[agent] CDN entries fetched: ${cdnEntries.length}${cdnEntries.length ? ` (${cdnEntries.map((e) => e.key).join(", ")})` : " — CDN may be offline"}`);

  // CDN components get permissive Zod props (CDN owns validation) but are
  // registered in the extended catalog so they appear in the AVAILABLE
  // COMPONENTS list that generatePrompt emits. Without this, generatePrompt
  // says "ONLY use component types from the AVAILABLE COMPONENTS list" and
  // the model correctly ignores CDN components appended outside that list.
  const cdnDefs = Object.fromEntries(
    cdnEntries.map((e) => [
      e.key,
      {
        props: z.record(z.string(), z.unknown()),
        // Strip soft "Prefer over" language from CDN team's description and replace
        // with a hard mandate so the model treats CDN as first choice in AVAILABLE COMPONENTS.
        description: `ALWAYS USE FOR THIS DOMAIN — NEVER substitute Card/Badge/Text: ${e.description.replace(/\.\s*Prefer over[^.]*\./gi, ".")}`,
        example: e.example,
      },
    ]),
  );

  const extendedCatalog = defineCatalog(schema, {
    components: { ...uswdsComponentDefinitions, ...cdnDefs },
    actions: {},
  });

  const cdnCustomRules: string[] = cdnEntries.length > 0
    ? [
        `CDN components (${cdnEntries.map((e) => e.key).join(", ")}) are in the AVAILABLE COMPONENTS list above. You MUST use them instead of Card/Badge/Text primitives for their respective domains. See CDN COMPONENTS section below for prop details and examples.`,
      ]
    : [];

  const instructions =
    STATIC_INSTRUCTIONS +
    "\n" +
    extendedCatalog.prompt({
      mode: "inline",
      customRules: [
        ...cdnCustomRules,
        "Text content MUST be passed via props, never as string children. Use Text(text='...'), Heading(text='...'), Badge(text='...'), Link(label='...'). children arrays hold element key references only — never inline strings.",
        "NEVER use these components — they do not exist in the catalog: Stack, Separator, Progress, Spinner, Tabs, Dialog, Drawer, Avatar, Carousel, Image, Skeleton, Switch, ToggleGroup, Toggle, Slider, Collapsible, Popover, DropdownMenu. Using any of them will produce 'Unknown component' errors.",
        "Table renders a bare <table> element and DROPS ALL CHILDREN — Section, Text, Grid, or any element you add as a child will silently disappear. Table has no row/column/cell API. It is only for a visual table shell with a caption; it cannot display data. For ANY tabular or list data (payments, appointments, rows of records) use GridContainer → Grid(row=true) → Grid(col=N) cells with Text/Badge children, combined with repeat+state for dynamic rows. NEVER attempt to build a data table with Table — use Grid.",
        "The catalog has NO sub-components. Do NOT emit CardHeader, CardTitle, CardContent, CardDescription, TableRow, TableCell, TableHead, TableBody — these are not registered.",
        "NEVER use viewport height classes (min-h-screen, h-screen) — the UI renders inside a chat message bubble.",
        "Keep the UI clean and information-dense.",
        "Always include an Alert or Text summary before any grid or list of Cards.",
        "IGNORE the /root and /elements format shown in the examples above — do NOT output /root or /elements patches. Use a NESTED spec instead: patches build a plain tree rooted at {type, props, children}.",
        "Nested spec: start with {\"op\":\"add\",\"path\":\"/type\",\"value\":\"Section\"}, {\"op\":\"add\",\"path\":\"/props\",\"value\":{}}, {\"op\":\"add\",\"path\":\"/children\",\"value\":[]}. Then stream top-level children as {\"op\":\"add\",\"path\":\"/children/-\",\"value\":{type, props, children:[...]}}. All children are INLINE objects — no element keys, no elements map. Orphaned elements are structurally impossible.",
        "For nested subtrees (e.g. GridContainer > Grid > Grid > Card), write the full subtree inline as a single /children/- value. Each inner element's children go in its own inline children array.",
        "Grid layout requires THREE layers: GridContainer → Grid(row=true) → Grid(col=N). NEVER skip the row Grid — placing Grid(col=N) as a direct child of GridContainer omits the flex container and columns will stack vertically instead of side by side.",
        "Alert body is a <p> tag — NEVER place child elements inside Alert. Use Alert(heading='...', text='...') only. No children array on Alert elements.",
      ],
    }) +
    buildCdnSection(cdnEntries) +
    buildCdnRules(cdnEntries) +
    buildCdnScenarios(cdnEntries);

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
