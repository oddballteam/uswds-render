import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, configureAxe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

// Banner, Header, Footer, LanguageSelector render SVGs with role="img" but no accessible label (Truss upstream bug).
const axeNoSvgImgAlt = configureAxe({ rules: { "svg-img-alt": { enabled: false } } });

// LanguageSelector toggle button has aria-controls pointing to the collapsed panel (not in DOM in jsdom).
// Truss initializes the panel via JS — in static render the referenced element is absent.
const axeLanguageSelector = configureAxe({
  rules: {
    "svg-img-alt": { enabled: false },
    "aria-valid-attr-value": { enabled: false },
  },
});

// ── Collection ────────────────────────────────────────────────────────────────
describe("Collection", () => {
  const Collection = uswdsComponents.Collection;

  it("renders collection items with headings", () => {
    render(
      <Collection
        items={[
          { heading: "Benefit update", href: "#", description: "New rates effective January 1.", meta: ["Jan 1, 2026", "Benefits"] },
          { heading: "System maintenance", href: "#", description: "Scheduled downtime this weekend." },
        ]}
      />
    );
    expect(screen.getByText("Benefit update")).toBeInTheDocument();
    expect(screen.getByText("System maintenance")).toBeInTheDocument();
  });

  it("renders description and meta strings", () => {
    render(
      <Collection
        items={[
          { heading: "Update", description: "Details here.", meta: ["Tag1", "Tag2"] },
        ]}
      />
    );
    expect(screen.getByText("Details here.")).toBeInTheDocument();
    expect(screen.getByText("Tag1")).toBeInTheDocument();
    expect(screen.getByText("Tag2")).toBeInTheDocument();
  });

  it("renders linked headings when href provided", () => {
    render(
      <Collection
        items={[{ heading: "Linked item", href: "/somewhere" }]}
      />
    );
    expect(screen.getByRole("link", { name: "Linked item" })).toHaveAttribute("href", "/somewhere");
  });

  it("envelope merge works", () => {
    render(
      <Collection
        props={{ items: [{ heading: "Envelope heading" }] }}
        emit={() => {}}
      />
    );
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });

  it("has usa-collection CSS class on root", () => {
    const { container } = render(
      <Collection items={[{ heading: "Item" }]} />
    );
    expect(container.querySelector(".usa-collection")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Collection
        items={[
          { heading: "Benefit update", href: "#", description: "New rates effective January 1.", meta: ["Jan 1, 2026", "Benefits"] },
          { heading: "System maintenance", href: "#", description: "Scheduled downtime this weekend." },
        ]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Banner ────────────────────────────────────────────────────────────────────
describe("Banner", () => {
  const Banner = uswdsComponents.Banner;

  it("renders without throwing", () => {
    expect(() => render(<Banner language="english" tld="gov" />)).not.toThrow();
  });

  it("renders gov banner section", () => {
    const { container } = render(<Banner language="english" tld="gov" />);
    // GovBanner renders a section with aria-label
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("envelope merge works", () => {
    expect(() =>
      render(<Banner props={{ language: "english", tld: "gov" }} emit={() => {}} />)
    ).not.toThrow();
  });

  it("renders spanish variant without throwing", () => {
    expect(() => render(<Banner language="spanish" tld="gov" />)).not.toThrow();
  });

  it("has no critical a11y violations", async () => {
    // svg-img-alt excluded: Truss GovBanner SVG icons have role="img" but no accessible label (upstream bug)
    const { container } = render(<Banner language="english" tld="gov" />);
    expect(await axeNoSvgImgAlt(container)).toHaveNoViolations();
  });
});

// ── Identifier ────────────────────────────────────────────────────────────────
describe("Identifier", () => {
  const Identifier = uswdsComponents.Identifier;

  const baseProps = {
    identity: { domain: "agency.gov", disclaimerText: "Official website." },
    links: [
      { label: "About", href: "#about" },
      { label: "Accessibility statement", href: "#accessibility" },
    ],
  };

  it("renders domain text", () => {
    render(<Identifier {...baseProps} />);
    // domain appears in both the logo fallback span and IdentifierIdentity's domain paragraph
    expect(screen.getAllByText("agency.gov").length).toBeGreaterThanOrEqual(1);
  });

  it("renders disclaimer text", () => {
    render(<Identifier {...baseProps} />);
    expect(screen.getByText("Official website.")).toBeInTheDocument();
  });

  it("renders links", () => {
    render(<Identifier {...baseProps} />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Accessibility statement")).toBeInTheDocument();
  });

  it("envelope merge works", () => {
    render(
      <Identifier
        props={baseProps}
        emit={() => {}}
      />
    );
    expect(screen.getAllByText("agency.gov").length).toBeGreaterThanOrEqual(1);
  });

  it("has usa-identifier CSS class", () => {
    const { container } = render(<Identifier {...baseProps} />);
    expect(container.querySelector(".usa-identifier")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Identifier {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Header ────────────────────────────────────────────────────────────────────
describe("Header", () => {
  const Header = uswdsComponents.Header;

  it("renders site title", () => {
    render(<Header title="Agency Portal" />);
    expect(screen.getByText("Agency Portal")).toBeInTheDocument();
  });

  it("renders nav items", () => {
    render(
      <Header
        title="Agency Portal"
        navItems={[
          { label: "Home", href: "/", current: true },
          { label: "Benefits", href: "/benefits" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Benefits" })).toBeInTheDocument();
  });

  it("marks current nav item with usa-current class", () => {
    render(
      <Header
        title="Portal"
        navItems={[{ label: "Home", href: "/", current: true }]}
      />
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("usa-current");
  });

  it("envelope merge works", () => {
    render(
      <Header
        props={{ title: "Envelope Title", navItems: [{ label: "Nav Link", href: "/nav" }] }}
        emit={() => {}}
      />
    );
    expect(screen.getByText("Envelope Title")).toBeInTheDocument();
    expect(screen.getByText("Nav Link")).toBeInTheDocument();
  });

  it("has usa-header CSS class", () => {
    const { container } = render(<Header title="Test" />);
    expect(container.querySelector(".usa-header")).toBeInTheDocument();
  });

  it("has no critical a11y violations", async () => {
    // svg-img-alt excluded: Truss Header nav SVG icons have role="img" but no accessible label (upstream bug)
    const { container } = render(
      <Header
        title="Agency Portal"
        navItems={[
          { label: "Home", href: "/", current: true },
          { label: "Benefits", href: "/benefits" },
        ]}
      />
    );
    expect(await axeNoSvgImgAlt(container)).toHaveNoViolations();
  });
});

// ── Footer ────────────────────────────────────────────────────────────────────
describe("Footer", () => {
  const Footer = uswdsComponents.Footer;

  const baseProps = {
    size: "slim" as const,
    columns: [
      {
        heading: "About",
        links: [
          { label: "Mission & vision", href: "#mission" },
          { label: "Leadership", href: "#leadership" },
        ],
      },
    ],
  };

  it("renders footer links", () => {
    render(<Footer {...baseProps} />);
    expect(screen.getByText("Mission & vision")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
  });

  it("renders without throwing for slim size with no columns", () => {
    expect(() => render(<Footer size="slim" columns={[]} />)).not.toThrow();
  });

  it("envelope merge works", () => {
    render(<Footer props={baseProps} emit={() => {}} />);
    expect(screen.getByText("Mission & vision")).toBeInTheDocument();
  });

  it("has usa-footer CSS class", () => {
    const { container } = render(<Footer size="slim" columns={[]} />);
    expect(container.querySelector(".usa-footer")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Footer {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── LanguageSelector ──────────────────────────────────────────────────────────
describe("LanguageSelector", () => {
  const LanguageSelector = uswdsComponents.LanguageSelector;

  const baseProps = {
    langs: [
      { label: "English", lang: "en" },
      { label: "Español", lang: "es" },
    ],
  };

  it("renders first language in the toggle button", () => {
    // LanguageSelector renders the active/first language in a toggle button (collapsed state).
    // The full dropdown expands on interaction — not testable without JS events here.
    render(<LanguageSelector {...baseProps} />);
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("renders without throwing", () => {
    expect(() => render(<LanguageSelector {...baseProps} />)).not.toThrow();
  });

  it("envelope merge works (first lang visible)", () => {
    render(<LanguageSelector props={baseProps} emit={() => {}} />);
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("has usa-language-container class", () => {
    const { container } = render(<LanguageSelector {...baseProps} />);
    // Truss renders a div with usa-language-container
    expect(container.querySelector("[class*='usa-language']")).toBeInTheDocument();
  });

  it("has no critical a11y violations", async () => {
    // svg-img-alt excluded: Truss LanguageSelector SVG has role="img" but no accessible label (upstream bug)
    // aria-valid-attr-value excluded: toggle button has aria-controls="language-options" but panel is only rendered after JS init (absent in jsdom static render)
    const { container } = render(<LanguageSelector {...baseProps} />);
    expect(await axeLanguageSelector(container)).toHaveNoViolations();
  });
});

// ── IconList ──────────────────────────────────────────────────────────────────
describe("IconList", () => {
  const IconList = uswdsComponents.IconList;

  const baseProps = {
    items: [
      { iconName: "Check", text: "Direct deposit available" },
      { iconName: "Check", text: "Online application" },
      { iconName: "Close", text: "Paper forms discontinued" },
    ],
  };

  it("renders text content for each item", () => {
    render(<IconList {...baseProps} />);
    expect(screen.getByText("Direct deposit available")).toBeInTheDocument();
    expect(screen.getByText("Online application")).toBeInTheDocument();
    expect(screen.getByText("Paper forms discontinued")).toBeInTheDocument();
  });

  it("renders without throwing", () => {
    expect(() => render(<IconList {...baseProps} />)).not.toThrow();
  });

  it("envelope merge works", () => {
    render(<IconList props={baseProps} emit={() => {}} />);
    expect(screen.getByText("Direct deposit available")).toBeInTheDocument();
  });

  it("has usa-icon-list CSS class", () => {
    const { container } = render(<IconList {...baseProps} />);
    expect(container.querySelector(".usa-icon-list")).toBeInTheDocument();
  });

  it("has no critical a11y violations", async () => {
    // svg-img-alt excluded: Truss IconList item SVGs have role="img" but no accessible label (upstream bug)
    const { container } = render(<IconList {...baseProps} />);
    expect(await axeNoSvgImgAlt(container)).toHaveNoViolations();
  });
});

// ── MediaBlock ────────────────────────────────────────────────────────────────
describe("MediaBlock", () => {
  const MediaBlock = uswdsComponents.MediaBlock;

  const baseProps = {
    imgSrc: "https://designsystem.digital.gov/img/home/hero.png",
    imgAlt: "USWDS hero image",
    heading: "Design for impact",
    body: "Build accessible, mobile-friendly government websites faster with USWDS.",
  };

  it("renders heading text", () => {
    render(<MediaBlock {...baseProps} />);
    expect(screen.getByText("Design for impact")).toBeInTheDocument();
  });

  it("renders body text", () => {
    render(<MediaBlock {...baseProps} />);
    expect(screen.getByText(/Build accessible/)).toBeInTheDocument();
  });

  it("renders image with alt text", () => {
    render(<MediaBlock {...baseProps} />);
    expect(screen.getByAltText("USWDS hero image")).toBeInTheDocument();
  });

  it("envelope merge works", () => {
    render(<MediaBlock props={baseProps} emit={() => {}} />);
    expect(screen.getByText("Design for impact")).toBeInTheDocument();
  });

  it("has usa-media-block CSS class", () => {
    const { container } = render(<MediaBlock {...baseProps} />);
    expect(container.querySelector(".usa-media-block")).toBeInTheDocument();
  });

  it("reversed prop adds usa-media-block--reversed class", () => {
    const { container } = render(<MediaBlock {...baseProps} reversed={true} />);
    expect(container.querySelector(".usa-media-block--reversed")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<MediaBlock {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
