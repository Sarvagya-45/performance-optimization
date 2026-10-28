export const optimizationChecks = [
  {
    id: "images",
    title: "Image delivery",
    category: "Assets",
    summary:
      "Review image dimensions, modern formats, and responsive delivery.",
    details:
      "Prefer appropriately sized AVIF or WebP images and provide width and height attributes to reduce layout shifts.",
    status: "Review",
  },
  {
    id: "javascript",
    title: "JavaScript payload",
    category: "Code",
    summary:
      "Check bundle size and remove code that is not needed on the initial route.",
    details:
      "Use route-level splitting where useful, remove unused dependencies, and inspect production bundle output.",
    status: "Review",
  },
  {
    id: "caching",
    title: "Caching strategy",
    category: "Network",
    summary: "Review cache headers for static assets and API responses.",
    details:
      "Use long-lived immutable caching for fingerprinted assets and deliberate freshness rules for changing content.",
    status: "Review",
  },
  {
    id: "layout",
    title: "Layout stability",
    category: "Rendering",
    summary: "Look for unexpected movement while content loads.",
    details:
      "Reserve space for images, embeds, and asynchronous content. Avoid inserting content above the current viewport.",
    status: "Review",
  },
  {
    id: "requests",
    title: "Request waterfall",
    category: "Network",
    summary: "Identify critical requests and avoid unnecessary request chains.",
    details:
      "Inspect the browser network panel, reduce avoidable redirects, and prioritize genuinely critical resources.",
    status: "Review",
  },
  {
    id: "rendering",
    title: "Rendering work",
    category: "Rendering",
    summary: "Check expensive repeated rendering and long main-thread tasks.",
    details:
      "Profile before optimizing, memoize only where it helps, and break up long tasks when practical.",
    status: "Review",
  },
];

export const categories = [
  "All",
  ...new Set(optimizationChecks.map((item) => item.category)),
];
