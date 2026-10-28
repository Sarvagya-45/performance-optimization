import { beforeEach, describe, expect, it, vi } from "vitest";

import { runPerformanceAnalysis } from "./analysisApi.js";

describe("runPerformanceAnalysis", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_ANALYSIS_API_URL", "");
  });

  it("returns local demo checks", async () => {
    const result = await runPerformanceAnalysis();

    expect(result.length).toBeGreaterThan(0);

    expect(result[0]).toHaveProperty("title");
  });

  it("reports the deliberate demo error", async () => {
    await expect(runPerformanceAnalysis("error")).rejects.toThrow(
      /Demo error requested/,
    );
  });
});
