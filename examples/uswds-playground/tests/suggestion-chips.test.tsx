import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestionChips, SUGGESTIONS } from "../components/suggestion-chips";

describe("SuggestionChips", () => {
  it("renders all gov scenarios", () => {
    render(<SuggestionChips onSelect={() => {}} />);
    for (const s of SUGGESTIONS) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });

  it("calls onSelect with the chip text when clicked", () => {
    const onSelect = vi.fn();
    render(<SuggestionChips onSelect={onSelect} />);
    fireEvent.click(screen.getByText(SUGGESTIONS[0]));
    expect(onSelect).toHaveBeenCalledWith(SUGGESTIONS[0]);
  });
});
