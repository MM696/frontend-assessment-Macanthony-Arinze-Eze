import { describe, expect, it } from "vitest";
import { getPaginationItems } from "@/lib/pagination";

describe("getPaginationItems", () => {
  it("returns a single page when totalPages is 1", () => {
    expect(getPaginationItems(1, 1)).toEqual([{ kind: "page", page: 1 }]);
  });

  it("lists all pages when total is small", () => {
    expect(getPaginationItems(2, 5)).toEqual([
      { kind: "page", page: 1 },
      { kind: "page", page: 2 },
      { kind: "page", page: 3 },
      { kind: "page", page: 4 },
      { kind: "page", page: 5 },
    ]);
  });

  it("inserts ellipses for large page counts", () => {
    const items = getPaginationItems(8, 20);
    expect(items.some((i) => i.kind === "ellipsis")).toBe(true);
    expect(items.filter((i) => i.kind === "page").map((i) => i.page)).toContain(
      1
    );
    expect(items.filter((i) => i.kind === "page").map((i) => i.page)).toContain(
      20
    );
    expect(items.filter((i) => i.kind === "page").map((i) => i.page)).toContain(
      8
    );
  });
});
