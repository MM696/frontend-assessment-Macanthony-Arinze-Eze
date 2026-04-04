import { describe, expect, it } from "vitest";
import {
  PAGE_SIZE,
  pageFromSkip,
  paramsEqual,
  parseProductSearchParams,
  productListingHref,
  clearSearchHrefFromParams,
} from "@/lib/url-product-params";

describe("parseProductSearchParams", () => {
  it("parses q, category, and page from a record", () => {
    expect(
      parseProductSearchParams({
        q: "phone",
        category: "smartphones",
        page: "2",
      })
    ).toEqual({
      limit: PAGE_SIZE,
      skip: PAGE_SIZE,
      q: "phone",
      category: "smartphones",
    });
  });

  it("defaults page to 1 and omits empty q/category", () => {
    expect(parseProductSearchParams({})).toEqual({
      limit: PAGE_SIZE,
      skip: 0,
    });
  });

  it("uses first value when query param is an array", () => {
    expect(
      parseProductSearchParams({ q: ["a", "b"] })
    ).toEqual({
      limit: PAGE_SIZE,
      skip: 0,
      q: "a",
    });
  });
});

describe("paramsEqual", () => {
  it("returns true for equivalent params", () => {
    const a = { limit: PAGE_SIZE, skip: 0, q: "x" };
    const b = { limit: PAGE_SIZE, skip: 0, q: "x" };
    expect(paramsEqual(a, b)).toBe(true);
  });

  it("returns false when q differs", () => {
    expect(
      paramsEqual(
        { limit: PAGE_SIZE, skip: 0, q: "a" },
        { limit: PAGE_SIZE, skip: 0, q: "b" }
      )
    ).toBe(false);
  });
});

describe("productListingHref", () => {
  it("builds root with query string", () => {
    expect(productListingHref({ q: "phone", page: 2 })).toBe(
      "/?q=phone&page=2"
    );
  });

  it("omits page when 1", () => {
    expect(productListingHref({ category: "beauty", page: 1 })).toBe(
      "/?category=beauty"
    );
  });
});

describe("clearSearchHrefFromParams", () => {
  it("keeps category and drops q", () => {
    expect(
      clearSearchHrefFromParams({
        limit: PAGE_SIZE,
        skip: 0,
        q: "x",
        category: "c",
      })
    ).toBe("/?category=c");
  });
});

describe("pageFromSkip", () => {
  it("maps skip to 1-based page", () => {
    expect(pageFromSkip(0)).toBe(1);
    expect(pageFromSkip(PAGE_SIZE)).toBe(2);
  });
});
