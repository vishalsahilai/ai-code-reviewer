import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.graph.workflow import graph
from backend.schemas.analysis import AnalysisRequest, AnalysisResponse


app = FastAPI(
    title="AI Code Reviewer API",
    description="AI-powered Python code analysis, refactoring, and documentation API.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Code Reviewer API is running."
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_code(request: AnalysisRequest):
    try:
        initial_state = {
            "original_code": request.code,
            "audit_report": "",
            "refactored_code": "",
            "documentation": "",
        }

        result = graph.invoke(initial_state)

        audit_report = json.loads(result["audit_report"])

        return AnalysisResponse(
            success=True,
            original_code=result["original_code"],
            audit_report=audit_report,
            refactored_code=result["refactored_code"],
            documentation=result["documentation"],
        )

    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=500,
            detail="Scanner returned an invalid audit report.",
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(exc)}",
        ) from exc