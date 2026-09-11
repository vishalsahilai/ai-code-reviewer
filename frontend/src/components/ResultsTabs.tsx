import { useState } from "react";

import type { AnalysisResponse } from "../services/api";

interface ResultsTabsProps {
  result: AnalysisResponse;
}

type ResultTab =
  | "issues"
  | "original"
  | "refactored"
  | "documentation";

function ResultsTabs({
  result,
}: ResultsTabsProps) {
  const [activeTab, setActiveTab] =
    useState<ResultTab>("issues");

  const tabs: {
    key: ResultTab;
    label: string;
  }[] = [
    {
      key: "issues",
      label: `Issues (${result.audit_report.issues.length})`,
    },
    {
      key: "original",
      label: "Original",
    },
    {
      key: "refactored",
      label: "Refactored",
    },
    {
      key: "documentation",
      label: "Documentation",
    },
  ];

  const copyText = async (
    text: string,
  ) => {
    await navigator.clipboard.writeText(
      text,
    );
  };

  return (
    <section className="results-card">
      <div className="results-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            className={
              activeTab === tab.key
                ? "results-tab active"
                : "results-tab"
            }
            onClick={() =>
              setActiveTab(tab.key)
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="results-content">
        {activeTab === "issues" && (
          <div className="issues-list">
            {result.audit_report.issues
              .length === 0 ? (
              <div className="empty-state">
                <div>✓</div>

                <h4>No issues detected</h4>

                <p>
                  The Scanner Agent did not
                  identify any significant
                  issues.
                </p>
              </div>
            ) : (
              result.audit_report.issues.map(
                (issue, index) => (
                  <article
                    className="issue-card"
                    key={`${issue.title}-${index}`}
                  >
                    <div className="issue-card-header">
                      <div>
                        <span
                          className={`severity severity-${issue.severity}`}
                        >
                          {issue.severity}
                        </span>

                        <span className="issue-type">
                          {issue.type}
                        </span>
                      </div>

                      {issue.line !== null && (
                        <span className="issue-line">
                          Line {issue.line}
                        </span>
                      )}
                    </div>

                    <h4>
                      {issue.title}
                    </h4>

                    <p>
                      {issue.description}
                    </p>

                    <div className="recommendation-box">
                      <strong>
                        Recommendation
                      </strong>

                      <p>
                        {
                          issue.recommendation
                        }
                      </p>
                    </div>
                  </article>
                ),
              )
            )}
          </div>
        )}

        {activeTab === "original" && (
          <CodePanel
            title="Original Python Code"
            code={result.original_code}
            onCopy={() =>
              copyText(
                result.original_code,
              )
            }
          />
        )}

        {activeTab === "refactored" && (
          <CodePanel
            title="AI Refactored Code"
            code={
              result.refactored_code
            }
            onCopy={() =>
              copyText(
                result.refactored_code,
              )
            }
          />
        )}

        {activeTab ===
          "documentation" && (
          <div className="documentation-panel">
            <div className="panel-toolbar">
              <span>
                Generated Documentation
              </span>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    result.documentation,
                  )
                }
              >
                Copy
              </button>
            </div>

            <pre>
              {result.documentation}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}

interface CodePanelProps {
  title: string;
  code: string;
  onCopy: () => void;
}

function CodePanel({
  title,
  code,
  onCopy,
}: CodePanelProps) {
  return (
    <div className="code-panel">
      <div className="panel-toolbar">
        <div className="window-controls">
          <span />
          <span />
          <span />
        </div>

        <span>{title}</span>

        <button
          type="button"
          onClick={onCopy}
        >
          Copy
        </button>
      </div>

      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default ResultsTabs;