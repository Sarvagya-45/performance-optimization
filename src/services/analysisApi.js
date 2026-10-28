import { optimizationChecks } from "../data/optimizationChecks.js";

export async function runPerformanceAnalysis(query = "") {
  const cleanQuery = String(query).trim();
  const apiUrl = import.meta.env.VITE_ANALYSIS_API_URL;

  // Local demonstration mode.
  if (!apiUrl) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 350);
    });

    if (cleanQuery.toLowerCase() === "error") {
      throw new Error("Demo error requested. Clear the search and try again.");
    }

    return optimizationChecks.map((check) => ({
      ...check,
    }));
  }

  let response;

  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: cleanQuery,
      }),
    });
  } catch {
    throw new Error(
      "Network request failed. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected API response. Expected a list of checks.");
  }

  return data;
}
