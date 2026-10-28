import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function CheckCard({ check }) {
  return (
    <article className="check-card">
      <div className="card-topline">
        <span className="category-label">{check.category}</span>

        <span className="status-label">
          <CheckCircle2 size={15} aria-hidden="true" />
          {check.status}
        </span>
      </div>

      <h3>{check.title}</h3>

      <p>{check.summary}</p>

      <details>
        <summary>
          View recommendation
          <ArrowUpRight size={15} aria-hidden="true" />
        </summary>

        <p className="recommendation">{check.details}</p>
      </details>
    </article>
  );
}
