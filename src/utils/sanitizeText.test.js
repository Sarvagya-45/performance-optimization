import { describe, expect, it } from "vitest";

import { sanitizeText } from "./sanitizeText.js";

describe("sanitizeText", () => {
  it("removes markup while retaining ordinary text", () => {
    expect(sanitizeText("<script>alert(1)</script>Hello")).toBe(
      "alert(1)Hello",
    );
  });

  it("handles non-string input", () => {
    expect(sanitizeText(null)).toBe("");
  });

  it("limits very long input", () => {
    expect(sanitizeText("a".repeat(200))).toHaveLength(120);
  });
});
