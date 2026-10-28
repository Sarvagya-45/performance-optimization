import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { runPerformanceAnalysis } from "./services/analysisApi";
import { sanitizeText } from "./utils/sanitizeText";

const optimizationChecks = [
  {
    id: 1,
    title: "Image delivery",
    category: "Loading Speed",
    summary: "Review image size, format, and loading behavior.",
    details: "Large images can increase page load time and data usage.",
    recommendation:
      "Use appropriately sized WebP or AVIF images, compress assets, and lazy-load images below the fold.",
    status: "Review",
  },
  {
    id: 2,
    title: "Caching strategy",
    category: "Network",
    summary: "Check whether reusable resources are cached effectively.",
    details: "A suitable caching policy can reduce repeated network requests.",
    recommendation:
      "Configure appropriate Cache-Control headers for static assets and use versioned filenames when assets change.",
    status: "Review",
  },
  {
    id: 3,
    title: "JavaScript delivery",
    category: "Loading Speed",
    summary: "Review JavaScript bundle size and execution cost.",
    details: "Large bundles can delay rendering and increase main-thread work.",
    recommendation:
      "Remove unused dependencies, split code by route, and defer non-critical scripts.",
    status: "Review",
  },
  {
    id: 4,
    title: "Render performance",
    category: "Rendering",
    summary: "Identify unnecessary rendering and layout work.",
    details:
      "Repeated layout calculations and avoidable component renders can affect responsiveness.",
    recommendation:
      "Profile rendering, avoid unnecessary state updates, and reserve space for dynamic content.",
    status: "Review",
  },
  {
    id: 5,
    title: "Network requests",
    category: "Network",
    summary: "Review request count, payload size, and request timing.",
    details: "Excessive or slow requests can delay the content users need.",
    recommendation:
      "Remove unnecessary requests, compress responses, and reduce critical request dependencies.",
    status: "Review",
  },
  {
    id: 6,
    title: "Accessibility and structure",
    category: "Frontend Quality",
    summary: "Check semantic structure and accessible controls.",
    details:
      "Clear document structure and accessible controls improve usability.",
    recommendation:
      "Use semantic HTML, associated form labels, visible focus states, and meaningful accessible names.",
    status: "Review",
  },
];

const categories = [
  "All Categories",
  "Loading Speed",
  "Rendering",
  "Network",
  "Frontend Quality",
];

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisQuery, setAnalysisQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedCheck, setExpandedCheck] = useState(null);

  const checksToDisplay = analysisResults ?? optimizationChecks;

  const filteredChecks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return checksToDisplay.filter((check) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        check.category === selectedCategory;

      const searchableText = [
        check.title,
        check.category,
        check.summary,
        check.details,
        check.recommendation,
        check.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [checksToDisplay, searchQuery, selectedCategory]);

  async function handleAnalysis(event) {
    event.preventDefault();

    const cleanedQuery = sanitizeText(analysisQuery).trim();

    if (!cleanedQuery) {
      setErrorMessage("Enter a website URL or performance issue first.");
      setSuccessMessage("");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const results = await runPerformanceAnalysis(cleanedQuery);

      setAnalysisResults(Array.isArray(results) ? results : []);
      setSearchQuery("");
      setSelectedCategory("All Categories");
      setSuccessMessage("Analysis completed successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Analysis could not be completed. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Performance Lab home">
          <span className="brand-mark">
            <Activity size={21} aria-hidden="true" />
          </span>
          <span>Performance Lab</span>
        </a>

        <span className="topbar-label">Optimization workspace</span>
      </header>

      <div className="page-content">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">
              <Zap size={15} aria-hidden="true" />
              WEB PERFORMANCE TOOLKIT
            </p>

            <h1>Performance Optimization</h1>

            <p className="hero-description">
              Review common performance issues, inspect optimization
              recommendations, and organize your next improvement.
            </p>
          </div>

          <div className="hero-status">
            <Gauge size={22} aria-hidden="true" />

            <div>
              <span className="status-label">Workspace</span>
              <strong>Ready to analyze</strong>
            </div>
          </div>
        </section>

        <section className="analysis-panel" aria-labelledby="analysis-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ANALYSIS</p>
              <h2 id="analysis-heading">Analyze a performance issue</h2>
            </div>

            <ShieldCheck size={24} aria-hidden="true" />
          </div>

          <form className="analysis-form" onSubmit={handleAnalysis}>
            <label htmlFor="analysis-query">
              Website URL or performance issue
            </label>

            <div className="analysis-input-row">
              <input
                id="analysis-query"
                name="analysisQuery"
                type="text"
                value={analysisQuery}
                onChange={(event) => {
                  setAnalysisQuery(event.target.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                placeholder="https://example.com or slow image loading"
              />

              <button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Run Analysis"}

                {!isAnalyzing && <ChevronRight size={17} aria-hidden="true" />}
              </button>
            </div>

            <p className="field-hint">
              Enter a URL or describe the performance issue you want to review.
            </p>

            {errorMessage && (
              <p className="error-message" role="alert">
                <AlertCircle size={17} aria-hidden="true" />
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="success-message" role="status">
                <CheckCircle2 size={17} aria-hidden="true" />
                {successMessage}
              </p>
            )}
          </form>
        </section>

        <section className="checks-section" aria-labelledby="checks-heading">
          <div className="checks-header">
            <div>
              <p className="eyebrow">REVIEW AND IMPROVE</p>
              <h2 id="checks-heading">Optimization Checks</h2>

              <p className="section-description">
                Explore the checks and review practical recommendations.
              </p>
            </div>

            <span className="checks-count">
              {filteredChecks.length}{" "}
              {filteredChecks.length === 1 ? "check" : "checks"}
            </span>
          </div>

          <div className="filter-bar">
            <div className="search-control">
              <Search size={18} aria-hidden="true" />

              <label className="visually-hidden" htmlFor="check-search">
                Search optimization checks
              </label>

              <input
                id="check-search"
                type="search"
                aria-label="Search optimization checks"
                placeholder="Search optimization checks"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="category-control">
              <label htmlFor="category-filter">Filter by category</label>

              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredChecks.length === 0 ? (
            <div className="empty-state">
              <Search size={25} aria-hidden="true" />

              <h3>No matching checks</h3>

              <p>Try another search term or choose a different category.</p>
            </div>
          ) : (
            <div className="checks-grid">
              {filteredChecks.map((check, index) => {
                const isExpanded = expandedCheck === check.id;

                return (
                  <article
                    className="check-card"
                    key={`${check.id}-${check.title}`}
                  >
                    <div className="check-card-top">
                      <span className="check-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="category-tag">{check.category}</span>
                    </div>

                    <h3>{check.title}</h3>

                    <p className="check-summary">
                      {check.summary || check.description}
                    </p>

                    <div className="check-status">
                      <span className="status-dot" aria-hidden="true" />
                      {check.status || "Review"}
                    </div>

                    <button
                      className="recommendation-toggle"
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedCheck(isExpanded ? null : check.id)
                      }
                    >
                      {isExpanded
                        ? "Hide recommendation"
                        : "View recommendation"}

                      <ChevronRight
                        size={16}
                        aria-hidden="true"
                        className={isExpanded ? "chevron-open" : ""}
                      />
                    </button>

                    {isExpanded && (
                      <div className="recommendation-content">
                        {check.details && <p>{check.details}</p>}

                        <h4>Recommended action</h4>

                        <p>
                          {check.recommendation ||
                            "Review this area and measure the effect of any changes."}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="page-footer">
          <CheckCircle2 size={16} aria-hidden="true" />

          <span>
            Review changes with real measurements before deploying them.
          </span>
        </footer>
      </div>
    </main>
  );
}

export default App;
