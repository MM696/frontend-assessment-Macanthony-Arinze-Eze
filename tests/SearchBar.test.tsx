import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("handles input changes", () => {
    const onDebouncedQuery = vi.fn();
    render(
      <SearchBar urlQuery="" onDebouncedQuery={onDebouncedQuery} debounceMs={300} />
    );

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "phone" } });

    expect(input).toHaveValue("phone");
  });

  it("debounces before notifying parent", () => {
    const onDebouncedQuery = vi.fn();
    render(
      <SearchBar urlQuery="" onDebouncedQuery={onDebouncedQuery} debounceMs={300} />
    );

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "ab" } });

    expect(onDebouncedQuery).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onDebouncedQuery).toHaveBeenCalledTimes(1);
    expect(onDebouncedQuery).toHaveBeenCalledWith("ab");
  });

  it("syncs local input when urlQuery changes from outside (e.g. back/forward)", () => {
    const onDebouncedQuery = vi.fn();
    const { rerender } = render(
      <SearchBar
        urlQuery="phones"
        onDebouncedQuery={onDebouncedQuery}
        debounceMs={300}
      />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("phones");

    rerender(
      <SearchBar urlQuery="" onDebouncedQuery={onDebouncedQuery} debounceMs={300} />
    );

    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
});
