from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.services.analyzer import analyze_python_code
from backend.utils.file_handler import read_python_file


app = FastAPI(
    title="AI Code Reviewer API",
    description="AI-powered Python code analysis, refactoring, and documentation API.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
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
        result = analyze_python_code(request.code)

        return AnalysisResponse(
            success=True,
            original_code=result["original_code"],
            audit_report=result["audit_report"],
            refactored_code=result["refactored_code"],
            documentation=result["documentation"],
        )

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


@app.post("/api/analyze-file", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    try:
        code = await read_python_file(file)

        result = analyze_python_code(code)

        return AnalysisResponse(
            success=True,
            original_code=result["original_code"],
            audit_report=result["audit_report"],
            refactored_code=result["refactored_code"],
            documentation=result["documentation"],
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"File analysis failed: {str(exc)}",
        ) from exc