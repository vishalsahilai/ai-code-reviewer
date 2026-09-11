from typing import TypedDict


class AgentState(TypedDict):
    original_code: str
    audit_report: str
    refactored_code: str
    documentation: str