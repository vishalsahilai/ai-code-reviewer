import json

from backend.graph.workflow import graph


def analyze_python_code(code: str) -> dict:
    """
    Run the full AI analysis workflow for Python source code.

    Args:
        code: Python source code to analyze.

    Returns:
        Dictionary containing original code, audit report,
        refactored code, and documentation.
    """

    if not code or not code.strip():
        raise ValueError("Python code cannot be empty.")

    initial_state = {
        "original_code": code,
        "audit_report": "",
        "refactored_code": "",
        "documentation": "",
    }

    result = graph.invoke(initial_state)

    try:
        audit_report = json.loads(result["audit_report"])
    except json.JSONDecodeError as exc:
        raise ValueError(
            "Scanner Agent returned an invalid audit report."
        ) from exc

    return {
        "original_code": result["original_code"],
        "audit_report": audit_report,
        "refactored_code": result["refactored_code"],
        "documentation": result["documentation"],
    }