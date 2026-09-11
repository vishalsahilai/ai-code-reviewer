import type { AuditReport } from "../services/api";

interface ScoreCardsProps {
  report: AuditReport;
}

function ScoreCards({
  report,
}: ScoreCardsProps) {
  const scores = [
    {
      label: "Overall",
      value: report.score,
      description: "Code quality",
    },
    {
      label: "Security",
      value: report.security_score,
      description: "Risk assessment",
    },
    {
      label: "Performance",
      value: report.performance_score,
      description: "Efficiency",
    },
    {
      label: "Maintainability",
      value: report.maintainability_score,
      description: "Code health",
    },
    {
      label: "Style",
      value: report.style_score,
      description: "Standards",
    },
  ];

  const getRating = (value: number) => {
    if (value >= 90) {
      return "Excellent";
    }

    if (value >= 75) {
      return "Good";
    }

    if (value >= 60) {
      return "Fair";
    }

    return "Needs work";
  };

  return (
    <section className="score-grid">
      {scores.map((score) => (
        <article
          className="score-card"
          key={score.label}
        >
          <div className="score-card-header">
            <span>{score.label}</span>

            <span className="score-rating">
              {getRating(score.value)}
            </span>
          </div>

          <div className="score-value">
            {score.value}
            <small>/100</small>
          </div>

          <div className="score-bar">
            <span
              style={{
                width: `${score.value}%`,
              }}
            />
          </div>

          <p>{score.description}</p>
        </article>
      ))}
    </section>
  );
}

export default ScoreCards;