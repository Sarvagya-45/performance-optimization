import { useCallback, useMemo, useState } from "react";

import {
  Activity,
  Search,
  RotateCw,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";

import CheckCard from "./components/CheckCard.jsx";

import { categories, optimizationChecks } from "./data/optimizationChecks.js";

import { runPerformanceAnalysis } from "./services/analysisApi.js";

import { sanitizeText } from "./utils/sanitizeText.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [checks, setChecks] = useState(optimizationChecks);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [notice, setNotice] = useState(
    "Showing the local demonstration checklist.",
  );

  const filteredChecks = useMemo(() => {
    const needle = query.toLowerCase();

    return checks.filter((check) => {
      const matchesCategory = category === "All" || check.category === category;

      const searchable =
        `${check.title} ${check.summary} ${check.category}`.toLowerCase();

      return matchesCategory && searchable.includes(needle);
    });
  }, [checks, category, query]);

  const handleQueryChange = useCallback((event) => {
    setQuery(sanitizeText(event.target.value));
  }, []);

  const handleAnalyze = useCallback(
    async (event) => {
      event?.preventDefault();

      setError("");
      setIsLoading(true);

      try {
        const result = await runPerformanceAnalysis(query);

        setChecks(result);

        setNotice(
          "Analysis finished. Results shown are from the configured demo or API.",
        );

        console.info(
          "[Analytics] User interacted with Performance Optimization",
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong. Please try again.",
        );

        setNotice("");
      } finally {
        setIsLoading(false);
      }
    },
    [query],
  );

  const handleReset = useCallback(() => {
    setQuery("");
    setCategory("All");
    setChecks(optimizationChecks);
    setError("");

    setNotice("Showing the local demonstration checklist.");
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#main"
          aria-label="Performance Optimization home"
        >
          <span className="brand-mark">
            <Activity size={20} aria-hidden="true" />
          </span>

          <span>
            Performance
            <span className="brand-light"> / Optimization</span>
          </span>
        </a>

        <span className="topbar-note">
          <ShieldCheck size={16} aria-hidden="true" />
          Practical review checklist
        </span>
      </header>

      <main id="main" className="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">FRONTEND QUALITY WORKSPACE</p>

          <h1 id="page-title">Performance optimization</h1>

          <p className="intro-copy">
            Review common opportunities that can make a web experience faster,
            more stable, and easier to maintain.
          </p>
        </section>

        <section
          className="control-panel"
          aria-label="Search and filter checks"
        >
          <form className="search-form" onSubmit={handleAnalyze}>
            <label htmlFor="search-query">Search optimization checks</label>

            <div className="search-row">
              <div className="input-wrap">
                <Search size={18} aria-hidden="true" />

                <input
                  id="search-query"
                  name="query"
                  type="search"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Search images, caching, rendering..."
                  maxLength={120}
                />
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RotateCw className="spin" size={16} aria-hidden="true" />
                    Analyzing
                  </>
                ) : (
                  "Run analysis"
                )}
              </button>
            </div>
          </form>

          <div className="filter-row">
            <label htmlFor="category-filter">
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filter by category
            </label>

            <select
              id="category-filter"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </section>

        {isLoading && (
          <div className="state-message" role="status">
            <span className="loading-dot" />
            Checking optimization items. This may take a moment.
          </div>
        )}

        {error && (
          <div className="state-message error-message" role="alert">
            <strong>Analysis could not be completed.</strong>

            <span>{error}</span>

            <button type="button" onClick={() => handleAnalyze()}>
              Try again
            </button>
          </div>
        )}

        {!error && !isLoading && (
          <p className="screen-reader-only" role="status">
            {notice}
          </p>
        )}

        <section className="results-section" aria-labelledby="results-heading">
          <div className="results-heading">
            <div>
              <p className="eyebrow">REVIEW ITEMS</p>

              <h2 id="results-heading">Optimization checks</h2>
            </div>

            <span className="results-count">
              {filteredChecks.length}{" "}
              {filteredChecks.length === 1 ? "item" : "items"}
            </span>
          </div>

          {!isLoading && !error && filteredChecks.length > 0 && (
            <div className="checks-grid">
              {filteredChecks.map((check) => (
                <CheckCard key={check.id} check={check} />
              ))}
            </div>
          )}

          {!isLoading && !error && filteredChecks.length === 0 && (
            <div className="empty-state">
              <Search size={24} aria-hidden="true" />

              <h3>No matching checks</h3>

              <p>Try a different search term or choose another category.</p>

              <button
                type="button"
                className="secondary-button"
                onClick={handleReset}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <aside className="demo-note">
          <strong>Demo mode</strong>

          <p>
            This dashboard displays a sample checklist. It does not measure a
            live site unless you connect and verify your own API endpoint.
          </p>
        </aside>
      </main>

      <footer className="footer">
        <span>Performance Optimization</span>
        <span>Accessible by design. Measured before optimized.</span>
      </footer>
    </div>
  );
}
