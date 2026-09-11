const API_BASE_URL = "http://127.0.0.1:8000";

export interface AuditIssue {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  line: number | null;
  title: string;
  description: string;
  recommendation: string;
}

export interface AuditReport {
  score: number;
  security_score: number;
  performance_score: number;
  maintainability_score: number;
  style_score: number;
  summary: string;
  issues: AuditIssue[];
}

export interface AnalysisResponse {
  success: boolean;
  original_code: string;
  audit_report: AuditReport;
  refactored_code: string;
  documentation: string;
}

async function handleResponse(
  response: Response,
): Promise<AnalysisResponse> {
  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const error = await response.json();

      if (error.detail) {
        message =
          typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail);
      }
    } catch {
      message = `Request failed with status ${response.status}.`;
    }

    throw new Error(message);
  }

  return response.json();
}

export async function analyzeCode(
  code: string,
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return handleResponse(response);
}

export async function analyzeFile(
  file: File,
): Promise<AnalysisResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/analyze-file`,
    {
      method: "POST",
      body: formData,
    },
  );

  return handleResponse(response);
}

