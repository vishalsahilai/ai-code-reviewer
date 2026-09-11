import json

from backend.prompts.scanner_prompt import SCANNER_SYSTEM_PROMPT
from backend.services.llm import llm


def scanner_agent(state: dict) -> dict:
    """
    Analyze the original Python code and generate a structured audit report.

    Args:
        state: Current LangGraph state containing original_code.

    Returns:
        Updated state containing audit_report.
    """

    code = state.get("original_code", "").strip()

    if not code:
        raise ValueError("No Python code was provided for analysis.")

    prompt = f"""
{SCANNER_SYSTEM_PROMPT}

PYTHON CODE TO ANALYZE:

{code}
"""

    response = llm.invoke(prompt)

    content = response.content

    if isinstance(content, list):
        raw_output = "".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in content
        ).strip()
    else:
        raw_output = str(content).strip()

    # Remove accidental Markdown code fences if the model adds them.
    if raw_output.startswith("```"):
        raw_output = raw_output.removeprefix("```json")
        raw_output = raw_output.removeprefix("```")
        raw_output = raw_output.removesuffix("```")
        raw_output = raw_output.strip()

    try:
        audit_data = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ValueError(
            "Scanner Agent returned invalid JSON."
        ) from exc

    return {
        "audit_report": json.dumps(
            audit_data,
            indent=2
        )
    }