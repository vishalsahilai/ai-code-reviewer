import { useState } from "react";

import "./App.css";

import AnalysisProgress from "./components/AnalysisProgress";
import ResultsTabs from "./components/ResultsTabs";
import ScoreCards from "./components/ScoreCards";

import {
  analyzeCode,
  analyzeFile,
  type AnalysisResponse,
} from "./services/api";

type InputMode = "code" | "file";

function App() {
  const [mode, setMode] = useState<InputMode>("code");

  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [result, setResult] =
    useState<AnalysisResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [startedAt, setStartedAt] =
    useState<number | null>(null);

  const [completedIn, setCompletedIn] =
    useState<number | null>(null);

  const resetAnalysis = () => {
    setResult(null);
    setError("");
    setStartedAt(null);
    setCompletedIn(null);
  };

  const handleModeChange = (nextMode: InputMode) => {
    if (loading) {
      return;
    }

    setMode(nextMode);
    resetAnalysis();
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    setCompletedIn(null);

    if (mode === "code" && !code.trim()) {
      setError("Paste some Python code before starting the analysis.");
      return;
    }

    if (mode === "file" && !file) {
      setError("Choose a Python file before starting the analysis.");
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
          : "Something went wrong while analyzing your code.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <span>{"</>"}</span>
          </div>

          <div>
            <h1>CodeLens AI</h1>
            <p>Multi-Agent Code Intelligence</p>
          </div>
        </div>

        <div className="topbar-status">
          <span className="status-dot" />
          AI Engine Online
        </div>
      </header>

      <main className="page-container">
        <section className="hero">
          <div className="hero-badge">
            AI-Powered Developer Tool
          </div>

          <h2>
            Review. Refactor.
            <span> Ship better code.</span>
          </h2>

          <p>
            A multi-agent Python code reviewer that audits security,
            improves code quality, refactors implementation, and
            automatically generates documentation.
          </p>

          <div className="hero-pipeline">
            <div>
              <span>01</span>
              Scanner
            </div>

            <div className="pipeline-line" />

            <div>
              <span>02</span>
              Refactor
            </div>

            <div className="pipeline-line" />

            <div>
              <span>03</span>
              Documentation
            </div>
          </div>
        </section>

        <section className="workspace-card">
          <div className="workspace-header">
            <div>
              <p className="eyebrow">INPUT</p>
              <h3>Analyze your Python code</h3>
            </div>

            <div className="mode-switch">
              <button
                type="button"
                className={
                  mode === "code" ? "mode-button active" : "mode-button"
                }
                onClick={() => handleModeChange("code")}
                disabled={loading}
              >
                Paste Code
              </button>

              <button
                type="button"
                className={
                  mode === "file" ? "mode-button active" : "mode-button"
                }
                onClick={() => handleModeChange("file")}
                disabled={loading}
              >
                Upload .py
              </button>
            </div>
          </div>

          {mode === "code" ? (
            <div className="editor-wrapper">
              <div className="editor-toolbar">
                <div className="window-controls">
                  <span />
                  <span />
                  <span />
                </div>

                <span className="editor-filename">
                  main.py
                </span>

                <span className="editor-language">
                  Python
                </span>
              </div>

              <textarea
                className="code-editor"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError("");
                }}
                placeholder={`# Paste your Python code here

def example():
    print("Hello world")`}
                disabled={loading}
                spellCheck={false}
              />

              <div className="editor-footer">
                <span>
                  {code.split("\n").length} lines
                </span>

                <span>
                  {code.length.toLocaleString()} characters
                </span>
              </div>
            </div>
          ) : (
            <label
              className={`upload-zone ${
                file ? "has-file" : ""
              }`}
            >
              <input
                type="file"
                accept=".py"
                disabled={loading}
                onChange={(event) => {
                  const selectedFile =
                    event.target.files?.[0] ?? null;

                  setFile(selectedFile);
                  resetAnalysis();
                }}
              />

              <div className="upload-icon">
                {file ? "✓" : "↑"}
              </div>

              {file ? (
                <>
                  <h4>{file.name}</h4>

                  <p>
                    {(file.size / 1024).toFixed(1)} KB
                    · Python source file
                  </p>

                  <span className="upload-change">
                    Click to choose another file
                  </span>
                </>
              ) : (
                <>
                  <h4>Drop your Python file here</h4>

                  <p>
                    or click to browse your computer
                  </p>

                  <span className="upload-requirement">
                    .py files only · Max 1 MB
                  </span>
                </>
              )}
            </label>
          )}

          {error && (
            <div className="error-banner">
              <div className="error-icon">!</div>

              <div>
                <strong>Analysis failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="analyze-action">
            <button
              type="button"
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Analyzing your code...
                </>
              ) : (
                <>
                  <span className="button-icon">✦</span>
                  Analyze & Optimize
                </>
              )}
            </button>

            <p>
              Your code is analyzed as text and is never executed.
            </p>
          </div>
        </section>

        <AnalysisProgress
          isAnalyzing={loading}
          estimatedSeconds={45}
          startedAt={startedAt}
          completedIn={completedIn}
        />

        {result && (
          <>
            <section className="analysis-heading">
              <div>
                <p className="eyebrow">
                  ANALYSIS COMPLETE
                </p>

                <h3>
                  Code Intelligence Report
                </h3>

                <p>
                  AI agents completed security, quality,
                  performance, and maintainability review.
                </p>
              </div>

              {completedIn !== null && (
                <div className="completed-chip">
                  Completed in {completedIn.toFixed(1)}s
                </div>
              )}
            </section>

            <ScoreCards report={result.audit_report} />

            <section className="summary-card">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">
                    AI SUMMARY
                  </p>

                  <h3>
                    Overall assessment
                  </h3>
                </div>
              </div>

              <p className="summary-text">
                {result.audit_report.summary}
              </p>
            </section>

            <ResultsTabs result={result} />
          </>
        )}
      </main>

      <footer>
        <span>CodeLens AI</span>
        <span>
          Scanner → Refactor → Documentation
        </span>
      </footer>
    </div>
  );
}

export default App;