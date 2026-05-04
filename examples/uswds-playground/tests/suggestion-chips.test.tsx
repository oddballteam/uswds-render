import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestionChips, SUGGESTIONS } from "../components/suggestion-chips";

describe("SuggestionChips", () => {
  it("exposes exactly six CMS primary questions", () => {
    expect(SUGGESTIONS).toHaveLength(6);
    const text = SUGGESTIONS.join(" ").toLowerCase();
    expect(text).toContain("original medicare");
    expect(text).toContain("join, switch, or drop");
    expect(text).toContain("medicare advantage plans are available");
    expect(text).toContain("part d plans cover");
    expect(text).toContain("saved drugs");
    expect(text).toContain("afford");
  });

  it("renders every suggestion chip", () => {
    render(<SuggestionChips onSelect={() => {}} />);
    for (const s of SUGGESTIONS) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });

  it("calls onSelect with the chip text for each chip when clicked", () => {
    const onSelect = vi.fn();
    render(<SuggestionChips onSelect={onSelect} />);
    for (const s of SUGGESTIONS) {
      fireEvent.click(screen.getByText(s));
    }
    expect(onSelect).toHaveBeenCalledTimes(SUGGESTIONS.length);
    for (const s of SUGGESTIONS) {
      expect(onSelect).toHaveBeenCalledWith(s);
    }
  });
});
