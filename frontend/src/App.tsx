import { useState } from "react";

import AnalysisProgress from "./components/AnalysisProgress";

import {
  analyzeCode,
  analyzeFile,
  type AnalysisResponse,
} from "./services/api";

function App() {
  const [mode, setMode] = useState<"code" | "file">("code");
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedIn, setCompletedIn] = useState<number | null>(null);

  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    setCompletedIn(null);

    if (mode === "code" && !code.trim()) {
      setError("Please enter Python code.");
      return;
    }

    if (mode === "file" && !file) {
      setError("Please select a Python file.");
      return;
    }

    const startTime = Date.now();

    setStartedAt(startTime);
    setLoading(true);

    try {
      let response: AnalysisResponse;

      if (mode === "code") {
        response = await analyzeCode(code);
      } else {
        response = await analyzeFile(file as File);
      }

      const endTime = Date.now();

      setCompletedIn((endTime - startTime) / 1000);
      setResult(response);
    } catch (err) {
      const endTime = Date.now();

      setCompletedIn((endTime - startTime) / 1000);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (nextMode: "code" | "file") => {
    if (loading) {
      return;
    }

    setMode(nextMode);
    setError("");
    setResult(null);
    setCompletedIn(null);
    setStartedAt(null);
  };

  return (
    <main>
      <header>
        <h1>AI Code Reviewer</h1>

        <p>
          Analyze, refactor, and document Python code using AI agents.
        </p>
      </header>

      <section>
        <div>
          <button
            type="button"
            onClick={() => handleModeChange("code")}
            disabled={loading}
          >
            Paste Code
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("file")}
            disabled={loading}
          >
            Upload .py File
          </button>
        </div>

        {mode === "code" ? (
          <div>
            <h2>Python Code</h2>

            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Paste your Python code here..."
              rows={18}
              disabled={loading}
              spellCheck={false}
            />
          </div>
        ) : (
          <div>
            <h2>Upload Python File</h2>

            <input
              type="file"
              accept=".py"
              disabled={loading}
              onChange={(event) => {
                const selectedFile =
                  event.target.files?.[0] ?? null;

                setFile(selectedFile);
                setError("");
                setResult(null);
                setCompletedIn(null);
                setStartedAt(null);
              }}
            />

            {file && (
              <p>
                Selected file: <strong>{file.name}</strong>
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze & Optimize"}
        </button>

        <AnalysisProgress
          isAnalyzing={loading}
          estimatedSeconds={45}
          startedAt={startedAt}
          completedIn={completedIn}
        />
      </section>

      {error && (
        <section>
          <h3>Analysis Error</h3>
          <p>{error}</p>
        </section>
      )}

      {result && (
        <section>
          <h2>Analysis Complete</h2>

          <section>
            <h3>Code Quality Score</h3>
            <p>{result.audit_report.score}/100</p>
          </section>

          <section>
            <h3>Scores</h3>

            <p>
              Security: {result.audit_report.security_score}/100
            </p>

            <p>
              Performance:{" "}
              {result.audit_report.performance_score}/100
            </p>

            <p>
              Maintainability:{" "}
              {result.audit_report.maintainability_score}/100
            </p>

            <p>
              Style: {result.audit_report.style_score}/100
            </p>
          </section>

          <section>
            <h3>Summary</h3>
            <p>{result.audit_report.summary}</p>
          </section>

          <section>
            <h3>Issues</h3>

            {result.audit_report.issues.length === 0 ? (
              <p>No issues found.</p>
            ) : (
              result.audit_report.issues.map((issue, index) => (
                <article key={`${issue.title}-${index}`}>
                  <h4>
                    {issue.severity.toUpperCase()} —{" "}
                    {issue.title}
                  </h4>

                  <p>
                    <strong>Type:</strong> {issue.type}
                  </p>

                  {issue.line !== null && (
                    <p>
                      <strong>Line:</strong> {issue.line}
                    </p>
                  )}

                  <p>{issue.description}</p>

                  <p>
                    <strong>Recommendation:</strong>{" "}
                    {issue.recommendation}
                  </p>
                </article>
              ))
            )}
          </section>

          <section>
            <h3>Original Code</h3>

            <pre>
              <code>{result.original_code}</code>
            </pre>
          </section>

          <section>
            <h3>Refactored Code</h3>

            <pre>
              <code>{result.refactored_code}</code>
            </pre>
          </section>

          <section>
            <h3>Documentation</h3>

            <pre>{result.documentation}</pre>
          </section>
        </section>
      )}
    </main>
  );
}

export default App;