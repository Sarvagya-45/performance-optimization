import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import App from "./App.jsx";

vi.mock("./services/analysisApi.js", () => ({
  runPerformanceAnalysis: vi.fn(async () => [
    {
      id: "images",
      title: "Image delivery",
      category: "Assets",
      summary: "Review images",
      details: "Use suitable formats.",
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

    await user.type(
      screen.getByRole("searchbox", {
        name: /search optimization checks/i,
      }),
      "not-a-match",
    );

    expect(screen.getByText(/no matching checks/i)).toBeInTheDocument();
  });

  it("runs the analysis action", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: /run analysis/i,
      }),
    );

    expect(await screen.findByText(/image delivery/i)).toBeInTheDocument();
  });

  it("filters checks by category", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.selectOptions(
      screen.getByLabelText(/filter by category/i),
      "Network",
    );

    expect(screen.getByText(/caching strategy/i)).toBeInTheDocument();

    expect(screen.queryByText(/image delivery/i)).not.toBeInTheDocument();
  });
});
