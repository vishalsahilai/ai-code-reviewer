import { useEffect, useState } from "react";

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  estimatedSeconds?: number;
  startedAt: number | null;
  completedIn: number | null;
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function AnalysisProgress({
  isAnalyzing,
  estimatedSeconds = 45,
  startedAt,
  completedIn,
}: AnalysisProgressProps) {
  const [remainingSeconds, setRemainingSeconds] =
    useState(estimatedSeconds);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isAnalyzing || startedAt === null) {
      return;
    }

    setRemainingSeconds(estimatedSeconds);
    setElapsedSeconds(0);

    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;

      setElapsedSeconds(elapsed);

      setRemainingSeconds(
        Math.max(estimatedSeconds - elapsed, 0),
      );
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [isAnalyzing, startedAt, estimatedSeconds]);

  const progress =
    estimatedSeconds > 0
      ? Math.min(
          (elapsedSeconds / estimatedSeconds) * 100,
          100,
        )
      : 0;

  if (!isAnalyzing && completedIn === null) {
    return null;
  }

  return (
    <section className="analysis-progress">
      <div className="analysis-progress-header">
        <div>
          <span className="analysis-status-label">
            {isAnalyzing
              ? "Analysis in progress"
              : "Analysis complete"}
          </span>

          <h2>
            {isAnalyzing
              ? "AI agents are reviewing your code"
              : "Your analysis is ready"}
          </h2>
        </div>

        <div
          className={`analysis-status ${
            isAnalyzing ? "running" : "complete"
          }`}
        >
          {isAnalyzing ? "Running" : "Complete"}
        </div>
      </div>

      <div className="agent-progress-list">
        <div className="agent-progress-item">
          <span>Scanner Agent</span>
          <span>{isAnalyzing ? "Running" : "Complete"}</span>
        </div>

        <div className="agent-progress-item">
          <span>Refactor Agent</span>
          <span>
            {isAnalyzing ? "Processing" : "Complete"}
          </span>
        </div>

        <div className="agent-progress-item">
          <span>Documentation Agent</span>
          <span>
            {isAnalyzing ? "Waiting / Processing" : "Complete"}
          </span>
        </div>
      </div>

      <div className="analysis-timers">
        <div className="timer-card">
          <span className="timer-label">
            Estimated time
          </span>

          <strong>
            ~{formatTime(estimatedSeconds)}
          </strong>
        </div>

        <div className="timer-card">
          <span className="timer-label">
            {isAnalyzing
              ? "Time remaining"
              : "Completed in"}
          </span>

          <strong>
            {isAnalyzing
              ? formatTime(remainingSeconds)
              : completedIn !== null
                ? `${completedIn.toFixed(1)} sec`
                : "--"}
          </strong>
        </div>
      </div>

      {isAnalyzing && (
        <div className="analysis-progress-track">
          <div
            className="analysis-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}

      {isAnalyzing && remainingSeconds <= 0 && (
        <p className="analysis-delay-message">
          Analysis is taking longer than expected. The AI
          agents are still working.
        </p>
      )}
    </section>
  );
}

export default AnalysisProgress;