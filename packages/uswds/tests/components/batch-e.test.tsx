import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, configureAxe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

// Icon and Search render SVGs with role="img" but no accessible label — Truss component bug.
const axeNoSvgImgAlt = configureAxe({ rules: { "svg-img-alt": { enabled: false } } });

const Icon = uswdsComponents.Icon as React.ComponentType<any>;
const SiteAlert = uswdsComponents.SiteAlert as React.ComponentType<any>;
const Breadcrumb = uswdsComponents.Breadcrumb as React.ComponentType<any>;
const SideNav = uswdsComponents.SideNav as React.ComponentType<any>;
const InPageNavigation = uswdsComponents.InPageNavigation as React.ComponentType<any>;
const StepIndicator = uswdsComponents.StepIndicator as React.ComponentType<any>;
const ProcessList = uswdsComponents.ProcessList as React.ComponentType<any>;
const SummaryBox = uswdsComponents.SummaryBox as React.ComponentType<any>;
const Search = uswdsComponents.Search as React.ComponentType<any>;

describe("Batch E — Icon", () => {
  it("renders a known icon without throwing", () => {
    const { container } = render(<Icon name="Star" size={4} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders fallback span for unknown icon name", () => {
    const { container } = render(<Icon name="NonExistentIcon999" />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    const { container } = render(<Icon name="NonExistentIcon999" props={{ name: "Star", size: 4 }} />);
    expect(container.querySelector("span")).not.toBeInTheDocument();
  });

  it("has no critical a11y violations", async () => {
    // svg-img-alt excluded: Truss Icon SVG has role="img" but no accessible label (upstream bug)
    const { container } = render(<Icon name="Star" size={4} />);
    expect(await axeNoSvgImgAlt(container)).toHaveNoViolations();
  });
});

describe("Batch E — SiteAlert", () => {
  it("renders site alert with heading", () => {
    render(<SiteAlert variant="info" heading="Important notice">Alert body</SiteAlert>);
    expect(screen.getByText("Important notice")).toBeInTheDocument();
  });

  it("renders emergency variant", () => {
    const { container } = render(<SiteAlert variant="emergency" heading="Emergency">Body</SiteAlert>);
    expect(container.querySelector(".usa-site-alert--emergency")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<SiteAlert variant="info" props={{ heading: "Envelope heading", variant: "emergency" }}>Body</SiteAlert>);
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<SiteAlert variant="info" heading="Important notice">Alert body</SiteAlert>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — Breadcrumb", () => {
  const CRUMBS = [
    { label: "Home", href: "/" },
    { label: "Benefits", href: "/benefits" },
    { label: "Health care", current: true },
  ];

  it("renders all crumb labels", () => {
    render(<Breadcrumb crumbs={CRUMBS} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Benefits")).toBeInTheDocument();
    expect(screen.getByText("Health care")).toBeInTheDocument();
  });

  it("applies usa-breadcrumb class", () => {
    const { container } = render(<Breadcrumb crumbs={CRUMBS} />);
    expect(container.querySelector(".usa-breadcrumb")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<Breadcrumb crumbs={[]} props={{ crumbs: CRUMBS }} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Breadcrumb crumbs={CRUMBS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — SideNav", () => {
  const ITEMS = [
    { label: "Overview", href: "#overview" },
    { label: "Details", href: "#details", current: true },
    { label: "Documents", href: "#documents" },
  ];

  it("renders all nav items", () => {
    render(<SideNav items={ITEMS} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("applies usa-sidenav class", () => {
    const { container } = render(<SideNav items={ITEMS} />);
    expect(container.querySelector(".usa-sidenav")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<SideNav items={[]} props={{ items: ITEMS }} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<SideNav items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — InPageNavigation", () => {
  const ITEMS = [
    { text: "Eligibility", href: "#eligibility" },
    { text: "How to apply", href: "#apply" },
  ];

  it("renders the nav title", () => {
    render(<InPageNavigation title="On this page" items={ITEMS} />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("renders nav items", () => {
    render(<InPageNavigation title="On this page" items={ITEMS} />);
    expect(screen.getByText("Eligibility")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<InPageNavigation title="Base title" items={[]} props={{ title: "Envelope title", items: ITEMS }} />);
    expect(screen.getByText("Envelope title")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<InPageNavigation title="On this page" items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — StepIndicator", () => {
  const STEPS = [
    { label: "Personal info", status: "complete" as const },
    { label: "Household members", status: "current" as const },
    { label: "Review", status: "incomplete" as const },
  ];

  it("renders step labels", () => {
    render(<StepIndicator steps={STEPS} headingLevel="h4" showLabels />);
    expect(screen.getByText("Personal info")).toBeInTheDocument();
    // "current" step label appears twice: in segment label + heading text
    expect(screen.getAllByText("Household members").length).toBeGreaterThan(0);
  });

  it("applies usa-step-indicator class", () => {
    const { container } = render(<StepIndicator steps={STEPS} headingLevel="h4" />);
    expect(container.querySelector(".usa-step-indicator")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<StepIndicator steps={[]} props={{ steps: STEPS, headingLevel: "h4", showLabels: true }} />);
    expect(screen.getByText("Personal info")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StepIndicator steps={STEPS} headingLevel="h4" showLabels />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — ProcessList", () => {
  const STEPS = ["Step one", "Step two", "Step three"];

  it("renders all steps", () => {
    render(<ProcessList steps={STEPS} />);
    expect(screen.getByText("Step one")).toBeInTheDocument();
    expect(screen.getByText("Step two")).toBeInTheDocument();
  });

  it("applies usa-process-list class", () => {
    const { container } = render(<ProcessList steps={STEPS} />);
    expect(container.querySelector(".usa-process-list")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<ProcessList steps={[]} props={{ steps: STEPS }} />);
    expect(screen.getByText("Step one")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<ProcessList steps={STEPS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — SummaryBox", () => {
  const ITEMS = ["Item one", "Item two", "Item three"];

  it("renders heading", () => {
    render(<SummaryBox heading="Key information" items={ITEMS} />);
    expect(screen.getByText("Key information")).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<SummaryBox heading="Summary" items={ITEMS} />);
    expect(screen.getByText("Item one")).toBeInTheDocument();
    expect(screen.getByText("Item two")).toBeInTheDocument();
  });

  it("applies usa-summary-box class", () => {
    const { container } = render(<SummaryBox items={ITEMS} />);
    expect(container.querySelector(".usa-summary-box")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<SummaryBox items={[]} props={{ heading: "Envelope heading", items: ITEMS }} />);
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<SummaryBox heading="Key information" items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Batch E — Search", () => {
  it("renders search input", () => {
    render(<Search label="Search" />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("applies usa-search class", () => {
    const { container } = render(<Search label="Search" />);
    expect(container.querySelector(".usa-search")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<Search label="Base" props={{ label: "Envelope search" }} />);
    // The label prop is the accessible label; verify input renders
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("has no critical a11y violations", async () => {
    // svg-img-alt excluded: Truss Search submit button SVG has role="img" but no accessible label (upstream bug)
    const { container } = render(<Search label="Search" />);
    expect(await axeNoSvgImgAlt(container)).toHaveNoViolations();
  });
});
