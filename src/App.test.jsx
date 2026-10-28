import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";

vi.mock("./services/analysisApi", () => ({
  runPerformanceAnalysis: vi.fn(async () => [
    {
      id: "images",
      title: "Image delivery",
      category: "Loading Speed",
      summary: "Review images",
      details: "Use suitable formats.",
      recommendation: "Use modern image formats and compress images.",
      status: "Review",
    },
  ]),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Performance Optimization interface", () => {
  it("renders the page heading and checklist", () => {
    render(<App />);

expect(
  screen.getByRole("heading", {
    name: /performance optimization/i,
  }),
).toBeInTheDocument();

expect(
  screen.getByRole("heading", {
    name: /optimization checks/i,
  }),
).toBeInTheDocument();

expect(screen.getByText(/image delivery/i)).toBeInTheDocument();
  });

  it("shows an empty state when no search matches", async () => {
    const user = userEvent.setup();

render(<App />);

const searchBox = screen.getByRole("searchbox", {
  name: /search optimization checks/i,
});

await user.type(searchBox, "not-a-match");

expect(screen.getByText(/no matching checks/i)).toBeInTheDocument();
  });

  it("runs the analysis action successfully", async () => {
    const user = userEvent.setup();

render(<App />);

const input = screen.getByLabelText(
  /website url or performance issue/i,
);

await user.type(input, "https://example.com");

await user.click(
  screen.getByRole("button", {
    name: /run analysis/i,
  }),
);

const { runPerformanceAnalysis } = await import(
  "./services/analysisApi"
);

expect(runPerformanceAnalysis).toHaveBeenCalledWith(
  "https://example.com",
);

expect(
  await screen.findByRole("status"),
).toHaveTextContent(/analysis completed successfully/i);

expect(screen.getByText("Image delivery")).toBeInTheDocument();
  });

  it("filters checks by category", async () => {
    const user = userEvent.setup();

render(<App />);

const categoryFilter = screen.getByRole("combobox", {
  name: /filter by category/i,
});

await user.selectOptions(categoryFilter, "Network");

expect(screen.getByText(/caching strategy/i)).toBeInTheDocument();
expect(screen.queryByText(/image delivery/i)).not.toBeInTheDocument();
  });
});
