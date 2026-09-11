from typing import Any

from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    code: str = Field(
        ...,
        min_length=1,
        description="Python source code to analyze.",
    )


class AnalysisResponse(BaseModel):
    success: bool
    original_code: str
    audit_report: dict[str, Any]
    refactored_code: str
    documentation: str