import { tool } from "ai";
import { z } from "zod";

type Article = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  body: string;
  url: string;
  relatedTerms: string[];
};

const KB: Article[] = [
  {
    id: "kb-parts-overview",
    title: "The Parts of Medicare",
    topic: "basics",
    summary:
      "Original Medicare (Part A + Part B), Medicare Advantage (Part C), and Part D prescription drug coverage — how they differ.",
    body:
      "Original Medicare is the federal fee-for-service program: Part A covers hospital stays and Part B covers outpatient care. Medicare Advantage (Part C) is an all-in-one plan from a private insurer that bundles Parts A and B (and usually Part D) with network rules. Part D is standalone prescription drug coverage offered by private plans. You can pair Original Medicare with a standalone Part D plan, or choose a Medicare Advantage plan that includes drug coverage (MA-PD).",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/parts-of-medicare",
    relatedTerms: ["Part A", "Part B", "Part C", "Part D", "MA-PD", "Original Medicare"],
  },
  {
    id: "kb-enrollment-periods",
    title: "When You Can Join, Switch, or Drop a Medicare Advantage or Part D Plan",
    topic: "enrollment",
    summary:
      "Initial Enrollment Period (IEP), Annual Enrollment Period (AEP), Medicare Advantage Open Enrollment (MA-OEP), and Special Enrollment Periods (SEPs).",
    body:
      "IEP is the 7-month window around your 65th birthday (3 months before, your birthday month, and 3 months after). AEP runs October 15 through December 7 each year and lets anyone with Medicare change Part C or Part D plans for the following year. MA-OEP runs January 1 through March 31 and lets Medicare Advantage members switch to a different MA plan or back to Original Medicare once. SEPs are triggered by life events such as moving, losing employer coverage, or qualifying for Extra Help.",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start",
    relatedTerms: ["IEP", "AEP", "MA-OEP", "SEP", "enrollment"],
  },
  {
    id: "kb-formulary",
    title: "What Is a Formulary?",
    topic: "drugs",
    summary: "A formulary is the list of prescription drugs covered by a Part D or MA-PD plan.",
    body:
      "A formulary is the list of prescription drugs covered by a Medicare drug plan. Plans place covered drugs on pricing tiers (typically Tier 1 generics through Tier 5 specialty) and may require prior authorization, step therapy, or quantity limits. Plans must cover at least two drugs in most classes, but specific brand names and tier placements vary by plan.",
    url: "https://www.medicare.gov/drug-coverage-part-d/what-medicare-part-d-drug-plans-cover",
    relatedTerms: ["formulary", "tier", "Part D", "MA-PD"],
  },
  {
    id: "kb-prior-auth",
    title: "Prior Authorization",
    topic: "drugs",
    summary:
      "Prior authorization means your prescriber must get the plan's approval before the drug is covered.",
    body:
      "Prior authorization (PA) is a coverage requirement where your prescriber must submit clinical justification for a specific drug before the plan will pay for it. PA is common for high-cost specialty drugs, off-label uses, or drugs with lower-cost alternatives. Related utilization management tools include step therapy (try a preferred drug first) and quantity limits.",
    url: "https://www.medicare.gov/drug-coverage-part-d/what-medicare-part-d-drug-plans-cover",
    relatedTerms: ["prior authorization", "PA", "step therapy", "quantity limits"],
  },
  {
    id: "kb-hmo-vs-ppo",
    title: "HMO vs PPO Medicare Advantage Plans",
    topic: "plans",
    summary:
      "HMO plans require in-network care and referrals; PPO plans allow out-of-network care at higher cost.",
    body:
      "An HMO (Health Maintenance Organization) Medicare Advantage plan generally requires you to use in-network providers and get a referral from your primary care doctor to see a specialist. A PPO (Preferred Provider Organization) plan lets you see any provider, in or out of network, though you pay less in-network. PPOs typically cost more in premium but offer more flexibility.",
    url: "https://www.medicare.gov/health-drug-plans/health-plans/your-coverage-options/medicare-advantage-plans",
    relatedTerms: ["HMO", "PPO", "network", "referral"],
  },
  {
    id: "kb-coverage-gap",
    title: "The Coverage Gap (Donut Hole)",
    topic: "drugs",
    summary:
      "Part D has four payment phases: deductible, initial coverage, coverage gap, and catastrophic.",
    body:
      "After you and your plan have spent a set amount on covered drugs, you enter the coverage gap (often called the donut hole). In the gap you pay 25% of the cost of covered drugs until your total out-of-pocket costs reach the catastrophic threshold. Starting in 2025, catastrophic coverage caps your annual out-of-pocket drug spending at $2,000.",
    url: "https://www.medicare.gov/drug-coverage-part-d/costs-for-medicare-drug-coverage/costs-in-the-coverage-gap",
    relatedTerms: ["coverage gap", "donut hole", "catastrophic", "out-of-pocket"],
  },
  {
    id: "kb-medigap",
    title: "Medigap (Medicare Supplement) Plans",
    topic: "supplements",
    summary:
      "Medigap policies help pay Original Medicare's out-of-pocket costs; they do not work with Medicare Advantage.",
    body:
      "Medigap (Medicare Supplement Insurance) is sold by private insurers to help pay some of the costs that Original Medicare does not cover, such as coinsurance, copays, and deductibles. Plans are standardized by letter (A, B, C, D, F, G, K, L, M, N). You cannot use Medigap with a Medicare Advantage plan. The best time to buy Medigap is during your 6-month Medigap Open Enrollment Period, when insurers cannot deny you coverage or charge more for health reasons.",
    url: "https://www.medicare.gov/health-drug-plans/medigap",
    relatedTerms: ["Medigap", "Supplement", "Plan G", "Plan N"],
  },
  {
    id: "kb-extra-help",
    title: "Extra Help (Low Income Subsidy)",
    topic: "assistance",
    summary:
      "Extra Help pays Part D premiums, deductibles, and copays for people with limited income and resources.",
    body:
      "Extra Help, also called the Low Income Subsidy (LIS), is a federal program that helps pay for Part D prescription drug costs. Eligibility is based on income and resources. In 2025, drug copays for full-benefit LIS are capped at $4.50 for generics and $11.20 for brand-name drugs. Apply through the Social Security Administration or your state Medicaid office.",
    url: "https://www.medicare.gov/basics/costs/help/drug-costs",
    relatedTerms: ["Extra Help", "LIS", "low income subsidy", "assistance"],
  },
];

function scoreArticle(article: Article, query: string, topic?: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (topic && article.topic === topic) score += 5;
  if (article.title.toLowerCase().includes(q)) score += 4;
  if (article.summary.toLowerCase().includes(q)) score += 3;
  if (article.body.toLowerCase().includes(q)) score += 1;
  for (const term of article.relatedTerms) {
    if (q.includes(term.toLowerCase()) || term.toLowerCase().includes(q)) score += 2;
  }
  return score;
}

export const search_medicare_knowledge = tool({
  description:
    "Search the static Medicare.gov knowledge base for explanatory content on Medicare parts, enrollment periods, drug coverage rules, plan types, and assistance programs. Use for general 'what is X' or 'how does X work' questions. Returns ranked articles with summaries and source URLs.",
  inputSchema: z.object({
    query: z.string().describe("Natural-language search phrase, e.g. 'donut hole' or 'enrollment periods'."),
    topic: z
      .enum(["basics", "enrollment", "plans", "drugs", "supplements", "assistance"])
      .nullish()
      .describe("Optional topic filter to narrow results."),
  }),
  execute: async ({ query, topic }) => {
    const ranked = KB.map((a) => ({ article: a, score: scoreArticle(a, query, topic ?? undefined) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    const results = ranked.length > 0 ? ranked.map((x) => x.article) : KB.filter((a) => !topic || a.topic === topic).slice(0, 3);
    return {
      query,
      topic: topic ?? null,
      resultCount: results.length,
      articles: results,
      disclaimer: "Summaries drawn from Medicare.gov public guidance. Always verify eligibility details on Medicare.gov.",
    };
  },
});
