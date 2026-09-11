from backend.prompts.refactor_prompt import REFACTOR_SYSTEM_PROMPT
from backend.services.llm import llm


def refactor_agent(state: dict) -> dict:
    """
    Refactor Python code using the Scanner Agent's audit report.

    Args:
        state: Current LangGraph state containing original_code
        and audit_report.

    Returns:
        Updated state containing refactored_code.
    """

    original_code = state.get("original_code", "").strip()
    audit_report = state.get("audit_report", "").strip()

    if not original_code:
        raise ValueError("No original Python code was provided.")

    if not audit_report:
        raise ValueError("Audit report is missing.")

    prompt = f"""
{REFACTOR_SYSTEM_PROMPT}

ORIGINAL PYTHON CODE:

{original_code}

SCANNER AUDIT REPORT:

{audit_report}
"""

    response = llm.invoke(prompt)

    content = response.content

    if isinstance(content, list):
        refactored_code = "".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in content
        ).strip()
    else:
        refactored_code = str(content).strip()

    # Remove accidental Markdown code fences.
    if refactored_code.startswith("```"):
        refactored_code = refactored_code.removeprefix("```python")
        refactored_code = refactored_code.removeprefix("```")
        refactored_code = refactored_code.removesuffix("```")
        refactored_code = refactored_code.strip()

    if not refactored_code:
        raise ValueError("Refactor Agent returned empty code.")

    return {
        "refactored_code": refactored_code
    }