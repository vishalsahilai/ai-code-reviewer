from backend.prompts.docs_prompt import DOCS_SYSTEM_PROMPT
from backend.services.llm import llm


def docs_agent(state: dict) -> dict:
    """
    Generate documentation for the refactored Python code.

    Args:
        state: Current LangGraph state containing refactored_code.

    Returns:
        Updated state containing documentation.
    """

    refactored_code = state.get("refactored_code", "").strip()

    if not refactored_code:
        raise ValueError("Refactored code is missing.")

    prompt = f"""
{DOCS_SYSTEM_PROMPT}

REFACTORED PYTHON CODE:

{refactored_code}
"""

    response = llm.invoke(prompt)

    content = response.content

    if isinstance(content, list):
        documentation = "".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in content
        ).strip()
    else:
        documentation = str(content).strip()

    if not documentation:
        raise ValueError("Documentation Agent returned empty documentation.")

    return {
        "documentation": documentation
    }