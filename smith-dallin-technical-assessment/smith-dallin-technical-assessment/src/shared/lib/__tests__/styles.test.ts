import { describe, it, expect } from "vitest";
import { cn } from "../styles";

describe("cn (className utility)", () => {
  describe("basic class merging", () => {
    it("merges multiple class strings", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles single class", () => {
      expect(cn("foo")).toBe("foo");
    });

    it("returns empty string for no arguments", () => {
      expect(cn()).toBe("");
    });
  });

  describe("conditional classes", () => {
    it("filters out falsy values", () => {
      expect(cn("foo", false, "bar", null, undefined, 0, "")).toBe("foo bar");
    });

    it("handles conditional object syntax", () => {
      expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });

    it("handles array of classes", () => {
      expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });
  });

  describe("tailwind conflict resolution", () => {
    it("resolves conflicting padding classes (last wins)", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });

    it("resolves conflicting margin classes", () => {
      expect(cn("mt-4", "mt-8")).toBe("mt-8");
    });

    it("resolves conflicting text colors", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("resolves conflicting background colors", () => {
      expect(cn("bg-white", "bg-black")).toBe("bg-black");
    });

    it("keeps non-conflicting classes", () => {
      expect(cn("p-4", "m-2", "text-red-500")).toBe("p-4 m-2 text-red-500");
    });

    it("resolves complex conflicts while preserving others", () => {
      expect(cn("px-4 py-2 bg-white", "px-6 bg-black")).toBe(
        "py-2 px-6 bg-black",
      );
    });
  });

  describe("edge cases", () => {
    it("handles deeply nested arrays", () => {
      expect(cn([["foo", "bar"], ["baz"]])).toBe("foo bar baz");
    });

    it("handles mixed types", () => {
      expect(
        cn("base", ["array-class"], { conditional: true }, undefined),
      ).toBe("base array-class conditional");
    });

    it("handles whitespace in class names", () => {
      expect(cn("  foo  ", "bar")).toBe("foo bar");
    });
  });
});
