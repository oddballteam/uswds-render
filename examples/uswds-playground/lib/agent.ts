import { ToolLoopAgent, stepCountIs } from "ai";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";
import { detectProvider } from "./provider";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";
// Legacy VA demo tools — kept on disk but disabled in the CMS playground.
// import { getVAAppointments } from "./tools/va-appointments";
// import { getClaimStatus } from "./tools/claim-status";
// import { compareMedicarePlans } from "./tools/medicare-plans";
// import { getGIBillBenefits } from "./tools/gi-bill";
// import { searchVAFacilities } from "./tools/va-facilities";
import { search_medicare_knowledge } from "./tools/search_medicare_knowledge";
import { check_eligibility_basics } from "./tools/check_eligibility_basics";
import { resolve_location } from "./tools/resolve_location";
import { search_medicare_plans } from "./tools/search_medicare_plans";
import { search_drugs_and_dosages } from "./tools/search_drugs_and_dosages";
import { calculate_drug_costs } from "./tools/calculate_drug_costs";
import { get_saved_health_preferences } from "./tools/get_saved_health_preferences";
import { get_beneficiary_profile } from "./tools/get_beneficiary_profile";
import { find_assistance_programs } from "./tools/find_assistance_programs";

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

// Static prefix — everything up to (but not including) the AVAILABLE COMPONENTS
// section, which is generated dynamically in makeAgent() so the CDN-extended
// catalog can be injected at runtime.
const AGENT_INSTRUCTIONS_PREFIX = `You are a CMS / Medicare assistant. You help beneficiaries and people shopping for Medicare understand their options, compare plans, estimate drug costs, and find cost-assistance programs. You look up information via tools and present it as rich USWDS-styled UI.

WORKFLOW:
1. Call the appropriate tools to gather real data. Chain them when a later tool needs an id or code from an earlier one.
2. Respond with a brief, conversational summary of what you found.
3. Then output the UI spec wrapped in a \`\`\`spec fence to render a rich visual experience.

COMPONENT PRIORITY:
CDN components are ALWAYS the first choice. When a CDN component exists for the data you are displaying, you MUST use it — never fall back to Card/Badge/Text primitives for the same domain. Primitives are only for layout and content that no CDN component covers.

RULES:
- Always call tools FIRST to get real data. Never fabricate plan names, drug prices, star ratings, or beneficiary data.
- Prefer INLINE values in component props over /state bindings. You are rendering tool results one-shot — copy values from the tool result directly into the Card / Text / Badge that shows them. Reserve { "$state": "/path" } for arrays you iterate with \`repeat\`, or for interactive forms driven by RadioGroup / TextInput / Button actions.
- Every heading or label you emit MUST have an adjacent element with real, non-placeholder content. Before closing the spec, walk every non-leaf element and confirm no children array is empty or left as a TODO. Empty sections are a bug.
- Every plan / program / drug listed in a tool result must render as its own Card with the key facts from that record. Do not emit a section heading like "Available plans" and then omit the plan cards.
- Begin every spec with an Alert summarizing status (info/success/warning), then a Heading, then content.
- Use Card to group related information. NEVER nest a Card inside another Card.
- Use Alert at the top to summarize status. type: info (neutral), success (completed), warning (attention-needed), error (problems). Set Alert heading and text props — do NOT add children to Alert.
- Use Badge for inline status pills (e.g., "5-star", "$0 premium", "PA required", "Tier 3"). Put them in a Section above the Card body text.
- Use Heading for section titles (level h2 or h3).
- Use Text for paragraphs and labels.
- Use Link for outbound references (href="https://medicare.gov/...", variant="external"). Use Collection when you have 2+ links that share a heading.
- Never add className to any component.
- Sample beneficiary data is always clearly fictional ("Sample Beneficiary"). Do not claim it is real enrollment data.

WORKED EXAMPLES (CDN-first style — copy this shape, always use CDN components for their domains):

EXAMPLE 1 — "plans in my ZIP" (tool chain: resolve_location → search_medicare_plans). One MedicarePlanCard per plan — never Card+Badge+Text for plan results:
\`\`\`spec
{
  "root": "root",
  "elements": {
    "root": { "type": "Section", "props": {}, "children": ["status", "title", "intro", "plan-grid", "cta"] },
    "status": { "type": "Alert", "props": { "type": "success", "heading": "3 Medicare Advantage plans found in 97201", "text": "ZIP 97201 maps to Multnomah County, OR (FIPS 41051).", "headingLevel": "h3" } },
    "title": { "type": "Heading", "props": { "level": "h2", "text": "Medicare Advantage plans in 97201" } },
    "intro": { "type": "Text", "props": { "text": "Compare premium, star rating, max out-of-pocket, and included benefits. Confirm your doctors and drugs before enrolling." } },
    "plan-grid": { "type": "GridContainer", "props": {}, "children": ["plan-row"] },
    "plan-row": { "type": "Grid", "props": { "row": true }, "children": ["col-a", "col-b", "col-c"] },
    "col-a": { "type": "Grid", "props": { "col": 4 }, "children": ["plan-a"] },
    "plan-a": { "type": "MedicarePlanCard", "props": { "planName": "Pioneer Advantage Choice (PPO)", "planType": "PPO", "monthlyPremium": "$0/month", "starRating": "4.5 stars", "maxOutOfPocket": "$4,900", "benefits": "Dental, vision, hearing. $0 primary care copay.", "pharmacyNote": "Preferred pharmacies: CVS, Walgreens.", "detailsHref": "https://www.medicare.gov/plan-compare/", "detailsLabel": "View plan details" } },
    "col-b": { "type": "Grid", "props": { "col": 4 }, "children": ["plan-b"] },
    "plan-b": { "type": "MedicarePlanCard", "props": { "planName": "Pioneer Value HMO", "planType": "HMO", "monthlyPremium": "$19/month", "starRating": "4.0 stars", "maxOutOfPocket": "$3,900", "benefits": "Transportation, dental, vision, hearing.", "detailsHref": "https://www.medicare.gov/plan-compare/" } },
    "col-c": { "type": "Grid", "props": { "col": 4 }, "children": ["plan-c"] },
    "plan-c": { "type": "MedicarePlanCard", "props": { "planName": "Golden Eagle PPO 5-Star", "planType": "PPO", "monthlyPremium": "$42/month", "starRating": "5.0 stars", "maxOutOfPocket": "$5,500", "benefits": "Premium dental and vision allowance. Year-round SEP eligible.", "detailsHref": "https://www.medicare.gov/plan-compare/" } },
    "cta": { "type": "Link", "props": { "label": "Compare all plans on Medicare.gov", "href": "https://www.medicare.gov/plan-compare/", "variant": "external" } }
  }
}
\`\`\`

EXAMPLE 2 — knowledge answer with sources (tool: search_medicare_knowledge). MedicareFactPanel for key takeaways, Collection for source links — never SummaryBox+Card for knowledge answers:
\`\`\`spec
{
  "root": "root",
  "elements": {
    "root": { "type": "Section", "props": {}, "children": ["status", "title", "intro", "facts-panel", "sources"] },
    "status": { "type": "Alert", "props": { "type": "info", "heading": "Medicare coverage options", "text": "Here is how Original Medicare, Medicare Advantage, and Part D differ and how they fit together.", "headingLevel": "h3" } },
    "title": { "type": "Heading", "props": { "level": "h2", "text": "Original Medicare vs Medicare Advantage vs Part D" } },
    "intro": { "type": "Text", "props": { "text": "Original Medicare and Medicare Advantage are two different ways to receive Medicare health coverage. Part D is prescription drug coverage that can be added separately or included in a Medicare Advantage plan." } },
    "facts-panel": { "type": "MedicareFactPanel", "props": { "heading": "Quick summary", "facts": "Original Medicare = Part A (hospital) + Part B (medical) from the federal government.|Medicare Advantage = Part C, a private Medicare-approved plan that replaces how you receive Part A and Part B benefits.|Part D = prescription drug coverage from private Medicare-approved plans.|You cannot be enrolled in both Original Medicare and Medicare Advantage at the same time." } },
    "sources": { "type": "Collection", "props": { "items": [ { "heading": "Parts of Medicare", "href": "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/parts-of-medicare", "description": "Overview of Part A, B, C, and D on Medicare.gov." }, { "heading": "Drug coverage (Part D)", "href": "https://www.medicare.gov/drug-coverage-part-d/what-medicare-part-d-drug-plans-cover", "description": "What Part D drug plans cover." } ] } }
  }
}
\`\`\`
`;

function truncate(value: unknown, max = 240): string {
  try {
    const s = typeof value === "string" ? value : JSON.stringify(value);
    if (!s) return "";
    return s.length > max ? `${s.slice(0, max)}…(${s.length - max} more)` : s;
  } catch {
    return String(value);
  }
}

export async function makeAgent(requestId = "anon") {
  const [selection, cdnEntries] = await Promise.all([
    Promise.resolve(detectProvider()),
    fetchCdnCatalog(),
  ]);

  const { name, model, modelLabel, providerOptions } = selection;
  const reasoning =
    (providerOptions?.openai as { reasoningEffort?: string } | undefined)?.reasoningEffort ?? null;

  console.log(
    `[generate ${requestId}] provider selected`,
    JSON.stringify({ provider: name, model: modelLabel, reasoningEffort: reasoning, toolCount: 9 }),
  );
  console.log(`[generate ${requestId}] CDN entries fetched: ${cdnEntries.length}${cdnEntries.length ? ` (${cdnEntries.map((e) => e.key).join(", ")})` : " — CDN may be offline"}`);

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
    AGENT_INSTRUCTIONS_PREFIX +
    extendedCatalog.prompt({
      mode: "inline",
      customRules: [
        ...cdnCustomRules,
        "Text content MUST be passed via props, never as string children. Use Text(text='...'), Heading(text='...'), Badge(text='...'), Link(label='...'). children arrays hold element key references only — never inline strings.",
        "NEVER use these components — they do not exist in the catalog: Stack, Separator, Progress, Spinner, Tabs, Dialog, Drawer, Avatar, Carousel, Image, Skeleton, Switch, ToggleGroup, Toggle, Slider, Collapsible, Popover, DropdownMenu. Using any of them will produce 'Unknown component' errors.",
        "Table accepts only caption/striped/bordered props — it has no columns or rows API. For tabular data use GridContainer → Grid(row=true) → Grid(col=N) cells with Card + Text/Badge children.",
        "The catalog has NO sub-components. Do NOT emit CardHeader, CardTitle, CardContent, CardDescription, TableRow, TableCell, TableHead, TableBody — these are not registered.",
        "For ordered numbered steps use ProcessList(steps=[...]). For bulleted highlights use SummaryBox(heading, items=[...]) or IconList(items=[{iconName,text}]). For a list of outbound links with descriptions use Collection(items=[{heading, href, description}]). Do NOT emit raw <ul>, <li>, List, or ListItem.",
        "NEVER use viewport height classes (min-h-screen, h-screen) — the UI renders inside a chat message bubble.",
        "Keep the UI clean and information-dense. Prefer inline prop values over /state bindings for one-shot tool-result renders.",
        "Always include an Alert or Text summary before any grid or list of Cards.",
        "ALWAYS set root to exactly one element key. When the spec has multiple top-level components, set root='root' and add a Section element with children listing all top-level keys. NEVER set root to an element that is a child of another element.",
        "Alert body is a <p> tag — NEVER place child elements inside Alert. Use Alert(heading='...', text='...') only. No children array on Alert elements.",
        "Pre-flight before sending: every non-leaf element you emit has a non-empty children array, and every heading you emit has a sibling or child below it with real content. No empty sections.",
      ],
    }) +
    buildCdnSection(cdnEntries) +
    buildCdnRules(cdnEntries) +
    buildCdnScenarios(cdnEntries);

  return new ToolLoopAgent({
    model,
    instructions,
    ...(providerOptions ? { providerOptions } : {}),
    tools: {
      search_medicare_knowledge,
      check_eligibility_basics,
      resolve_location,
      search_medicare_plans,
      search_drugs_and_dosages,
      calculate_drug_costs,
      get_saved_health_preferences,
      get_beneficiary_profile,
      find_assistance_programs,
      // Legacy VA demo tools — disabled in CMS playground.
      // getVAAppointments,
      // getClaimStatus,
      // compareMedicarePlans,
      // getGIBillBenefits,
      // searchVAFacilities,
    },
    stopWhen: stepCountIs(6),
    onStepFinish: (step) => {
      const toolCalls = step.toolCalls.map((c) => ({
        name: (c as { toolName?: string }).toolName,
        input: truncate((c as { input?: unknown }).input),
      }));
      const toolResults = step.toolResults.map((r) => ({
        name: (r as { toolName?: string }).toolName,
        outputPreview: truncate((r as { output?: unknown }).output, 200),
      }));
      console.log(
        `[generate ${requestId}] step ${step.stepNumber} finished`,
        JSON.stringify({
          finishReason: step.finishReason,
          textLen: step.text?.length ?? 0,
          toolCallCount: toolCalls.length,
          toolCalls,
          toolResults,
          usage: step.usage,
          warnings: step.warnings?.length ? step.warnings : undefined,
        }),
      );
    },
    onFinish: (event) => {
      console.log(
        `[generate ${requestId}] run complete`,
        JSON.stringify({
          finishReason: event.finishReason,
          stepCount: event.steps.length,
          totalUsage: event.totalUsage,
          finalTextLen: event.text?.length ?? 0,
        }),
      );
    },
  });
}
