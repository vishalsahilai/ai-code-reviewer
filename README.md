# AI Code Reviewer & Optimizer

An AI-powered developer tool that analyzes Python code, identifies security and quality issues, refactors the code, and generates technical documentation through a sequential multi-agent workflow.

The application combines a **React + TypeScript frontend**, **FastAPI backend**, **LangGraph orchestration**, **LangChain**, and **Google Gemini** to provide an automated code-review pipeline.

---

## 1. Project Overview

Developers often write code quickly while building features, testing ideas, or working under deadlines. This can introduce issues such as:

- Security vulnerabilities
- SQL injection risks
- Hardcoded credentials
- Poor exception handling
- Unused or duplicated code
- PEP8 violations
- Maintainability problems
- Performance issues
- Missing documentation
- Poor naming or structure

Manual code review can take time and smaller issues may be overlooked.

This project addresses that problem using a **sequential multi-agent pipeline**, where each AI agent performs one specialized task instead of relying on one large general-purpose prompt.

---

## 2. Main Goal

The application allows a user to either:

1. Paste Python code directly into the web interface
2. Upload a `.py` file

The system then processes the code through the following pipeline:

```text
Python Code
    ↓
Scanner Agent
    ↓
Structured Audit Report
    ↓
Refactor Agent
    ↓
Improved Python Code
    ↓
Documentation Agent
    ↓
Generated Documentation
    ↓
Frontend Results
```

The user can then review:

- Overall code-quality score
- Security score
- Performance score
- Maintainability score
- Style score
- Detected issues
- Recommendations
- Original code
- Refactored code
- Generated documentation

---

## 3. Current Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Oxlint
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- python-multipart

### AI / Orchestration

- LangGraph
- LangChain
- Google Gemini
- `langchain-google-genai`

### Environment

- Python virtual environment
- `.env` configuration
- Git / GitHub

---

## 4. Current Architecture

```text
                        USER
                          |
                          v
              React + TypeScript Frontend
                          |
              +-----------+-----------+
              |                       |
              v                       v
        Paste Python Code        Upload .py File
              |                       |
              v                       v
       POST /api/analyze      POST /api/analyze-file
              |                       |
              +-----------+-----------+
                          |
                          v
                    FastAPI Backend
                          |
                          v
                  Input Validation
                          |
                          v
                   Analyzer Service
                          |
                          v
                    LangGraph Flow
                          |
                          v
                    Scanner Agent
                          |
                          v
                    Audit Report
                          |
                          v
                   Refactor Agent
                          |
                          v
                   Refactored Code
                          |
                          v
                 Documentation Agent
                          |
                          v
                    Final Response
                          |
                          v
                       Frontend
```

---

## 5. Multi-Agent Workflow

The current pipeline contains three agents.

### Scanner Agent

The Scanner Agent reviews the original Python code without modifying it.

It checks for issues such as:

- Security vulnerabilities
- SQL injection
- Hardcoded passwords or API keys
- Unsafe coding patterns
- Logical bugs
- Runtime risks
- Poor exception handling
- PEP8 issues
- Unused imports or variables
- Duplicate code
- Maintainability problems
- Performance concerns

The Scanner Agent returns a structured JSON audit report.

Example:

```json
{
  "score": 85,
  "security_score": 80,
  "performance_score": 90,
  "maintainability_score": 88,
  "style_score": 92,
  "summary": "The code is generally well structured but contains security and maintainability concerns.",
  "issues": [
    {
      "type": "security",
      "severity": "high",
      "line": 12,
      "title": "SQL Injection",
      "description": "User input is directly interpolated into a SQL query.",
      "recommendation": "Use parameterized queries."
    }
  ]
}
```

### Refactor Agent

The Refactor Agent receives:

```text
Original Code
+
Scanner Audit Report
```

Its job is to:

- Fix real security problems
- Fix code-quality issues
- Improve readability
- Improve maintainability
- Follow PEP8
- Reduce unnecessary duplication
- Improve error handling
- Improve naming
- Improve performance where appropriate
- Preserve intended behavior whenever possible

The Refactor Agent returns improved Python source code.

### Documentation Agent

The Documentation Agent receives the refactored code and generates developer-focused documentation including:

- Project overview
- Features
- Requirements
- Installation instructions
- Usage instructions
- Code structure
- Function descriptions
- Class descriptions
- Security notes
- Maintenance notes

---

## 6. LangGraph State

The workflow shares data through a TypedDict state.

```python
class AgentState(TypedDict):
    original_code: str
    audit_report: str
    refactored_code: str
    documentation: str
```

The state moves through the graph in this order:

```text
START
  ↓
scanner_agent
  ↓
refactor_agent
  ↓
docs_agent
  ↓
END
```

---

## 7. Backend API

The FastAPI backend currently exposes four endpoints.

### Root

```http
GET /
```

Returns a simple API status message.

### Health Check

```http
GET /health
```

Returns:

```json
{
  "status": "healthy"
}
```

### Analyze Pasted Code

```http
POST /api/analyze
```

Example request:

```json
{
  "code": "def add(a, b):\n    return a + b"
}
```

### Analyze Uploaded Python File

```http
POST /api/analyze-file
```

Content type:

```text
multipart/form-data
```

The uploaded file is validated before analysis.

Current file rules:

- `.py` files only
- Maximum file size: 1 MB
- UTF-8 text
- Empty files are rejected

---

## 8. Example API Response

```json
{
  "success": true,
  "original_code": "...",
  "audit_report": {
    "score": 82,
    "security_score": 75,
    "performance_score": 95,
    "maintainability_score": 85,
    "style_score": 90,
    "summary": "...",
    "issues": []
  },
  "refactored_code": "...",
  "documentation": "..."
}
```

---

## 9. Frontend

The frontend is built with **React + TypeScript + Vite**.

Current functionality includes:

- Paste-code mode
- `.py` upload mode
- Large Python code editor
- File-selection interface
- Analyze & Optimize button
- Loading state
- Error handling
- Estimated analysis time
- Countdown timer
- Actual completion time
- AI pipeline progress section
- Code-quality score cards
- Security / performance / maintainability / style scores
- Audit summary
- Issue cards
- Severity badges
- Original-code tab
- Refactored-code tab
- Documentation tab
- Copy-to-clipboard controls
- Responsive dark developer-tool UI

The frontend communicates with the backend through:

```text
POST /api/analyze
POST /api/analyze-file
```

---

## 10. Analysis Timer

When the user clicks **Analyze & Optimize**, the frontend records the start time.

During analysis it displays:

```text
Estimated time
~00:45

Time remaining
00:44
00:43
00:42
...
```

When the backend returns the final response, the timer stops and the UI displays the actual completion duration.

Example:

```text
Completed in 37.4 sec
```

If the estimated countdown reaches zero before the backend finishes, the request continues and the UI informs the user that the analysis is taking longer than expected.

> Note: the timer is a frontend estimate. Actual response time depends on model latency, code size, network conditions, and API availability.

---

## 11. Agent Progress Tracking

The frontend currently displays the three pipeline stages:

```text
Scanner Agent
Refactor Agent
Documentation Agent
```

At the moment, the backend returns the final response only after the complete LangGraph workflow finishes.

Because of this, the frontend cannot yet know the exact real-time status of each individual agent.

Current progress labels are therefore UI-level approximations.

True real-time agent progress can later be implemented using:

- Server-Sent Events (SSE), or
- WebSockets

A future version could display:

```text
✓ Scanner Agent completed
● Refactor Agent running
○ Documentation Agent waiting
```

based on actual backend events.

---

## 12. Error Handling

The frontend displays backend errors in a dedicated error panel.

Common errors include:

### Gemini Rate Limit / Quota

Example:

```text
429 RESOURCE_EXHAUSTED
```

This means the configured Gemini API key or model has reached its current quota or rate limit.

Since one full analysis currently runs three agents, one user analysis normally requires approximately three model calls:

```text
Scanner Agent       → 1 request
Refactor Agent      → 1 request
Documentation Agent → 1 request
```

Future improvements can include:

- Model fallback
- Gemini API-key rotation
- Retry logic
- Better quota-aware error messages

### Temporary Gemini Availability

The model may sometimes return:

```text
503 UNAVAILABLE
```

This usually means the model is temporarily experiencing high demand.

---

## 13. Important Security Rule

Uploaded code is treated as **text only**.

The application currently does not automatically execute user-provided Python code.

The first version only performs:

```text
Read Code
Analyze Code
Refactor Code
Generate Documentation
```

If code execution or automatic testing is introduced later, it should run inside a secure isolated sandbox.

---

## 14. Environment Variables

The backend environment file is located at:

```text
backend/.env
```

Example:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Never commit the real `.env` file to GitHub.

An example file can be committed instead:

```text
backend/.env.example
```

Example:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 15. Project Structure

```text
ai-code-reviewer/
│
├── backend/
│   ├── agents/
│   │   ├── scanner.py
│   │   ├── refactor.py
│   │   └── docs.py
│   │
│   ├── graph/
│   │   ├── state.py
│   │   └── workflow.py
│   │
│   ├── prompts/
│   │   ├── scanner_prompt.py
│   │   ├── refactor_prompt.py
│   │   └── docs_prompt.py
│   │
│   ├── schemas/
│   │   └── analysis.py
│   │
│   ├── services/
│   │   ├── llm.py
│   │   └── analyzer.py
│   │
│   ├── utils/
│   │   └── file_handler.py
│   │
│   ├── .env
│   ├── .env.example
│   ├── main.py
│   └── test_workflow.py
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisProgress.tsx
│   │   │   ├── ScoreCards.tsx
│   │   │   └── ResultsTabs.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .oxlintrc.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md
├── requirement.txt
└── venv/
```

---

## 16. Backend Dependencies

The root dependency file currently contains the Python backend dependencies.

```txt
fastapi[standard]
uvicorn[standard]
langgraph
langchain
langchain-google-genai
python-dotenv
pydantic
python-multipart
```

Install them with:

```bash
pip install -r requirement.txt
```

> If you rename the file to the more conventional `requirements.txt`, use `pip install -r requirements.txt` instead.

---

## 17. Frontend Installation

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

## 18. Backend Installation

Create a virtual environment from the project root:

```bash
python -m venv venv
```

Activate it on macOS / Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirement.txt
```

Create:

```text
backend/.env
```

and add your Gemini API key.

Start the FastAPI backend from the project root:

```bash
uvicorn backend.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 19. Running the Full Application

Open two terminals.

### Terminal 1 — Backend

From the project root:

```bash
source venv/bin/activate
uvicorn backend.main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## 20. Testing the LangGraph Workflow

A backend workflow test file is available:

```text
backend/test_workflow.py
```

Run it from the project root:

```bash
python -m backend.test_workflow
```

This directly tests:

```text
Scanner
   ↓
Refactor
   ↓
Documentation
```

without using the frontend.

---

## 21. Git Workflow

The project has been developed using a clean incremental Git workflow.

General rule:

```text
One File = One Commit
```

Example:

```bash
git add backend/agents/scanner.py
git commit -m "feat: add scanner agent"
git push
```

For generated scaffolding such as the initial Vite frontend, one setup commit is acceptable.

---

## 22. Current First-Version Features

Implemented:

- Python code input
- `.py` file upload
- Input validation
- Scanner Agent
- Structured audit report
- Refactor Agent
- Documentation Agent
- LangGraph sequential workflow
- Shared LangGraph state
- Gemini integration
- FastAPI backend
- Pydantic request/response schemas
- Reusable analyzer service
- React + TypeScript frontend
- Vite development environment
- Oxlint
- Dark developer-dashboard interface
- Analysis timer
- Estimated completion time
- Actual completion duration
- Score cards
- Issue severity display
- Result tabs
- File-size validation
- `.py` extension validation
- CORS configuration
- Swagger documentation
- Error display
- Copy controls

---

## 23. Current Limitations

The current version has several known limitations:

- Python only
- One file per analysis
- No multi-file repository analysis
- No GitHub repository import
- No real-time backend agent event streaming yet
- No user authentication
- No saved analysis history
- No database
- No automatic unit testing
- No sandboxed code execution
- No Ruff / Bandit / Pytest integration yet
- Gemini quota can interrupt an analysis
- Automatic model fallback is not yet implemented
- Automatic API-key rotation is not yet implemented
- The frontend timer is an estimate, not a backend prediction
- Agent stage indicators are not yet driven by real backend events

---

## 24. Planned Improvements

Possible future additions:

- Real-time SSE agent status
- WebSocket progress updates
- Multiple Gemini API keys
- Automatic Gemini API-key rotation
- Automatic model fallback
- Retry logic for `429` and `503`
- Better rate-limit messages
- Multi-file project analysis
- ZIP project upload
- GitHub repository scanning
- JavaScript support
- TypeScript support
- Java support
- Ruff integration
- Bandit security scanning
- Pytest integration
- Sandboxed code execution
- Before/after diff viewer
- Download optimized `.py` file
- Download audit report
- Download generated README
- Download optimized project ZIP
- User authentication
- Scan history
- Database persistence
- GitHub pull-request generation
- Configurable production CORS origins

---

## 25. Final System Flow

```text
                         USER
                           |
                           v
                React + TypeScript UI
                           |
                +----------+----------+
                |                     |
                v                     v
           Paste Code            Upload .py
                |                     |
                +----------+----------+
                           |
                           v
                       FastAPI
                           |
                           v
                  Input Validation
                           |
                           v
                   Analyzer Service
                           |
                           v
                       LangGraph
                           |
                           v
                    Scanner Agent
                           |
                           v
                     Audit Report
                           |
                           v
                    Refactor Agent
                           |
                           v
                   Refactored Code
                           |
                           v
                 Documentation Agent
                           |
                           v
                  Final API Response
                           |
                           v
                Developer Dashboard
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       Scores            Issues          Results
                                     Original Code
                                     Refactored Code
                                     Documentation
```

---

## 26. Project Objective

The objective of this project is to build a practical AI-powered software engineering tool that can transform raw Python code into a cleaner, safer, more maintainable, and better documented version.

Instead of acting as a simple chatbot, the application behaves like an automated software engineering pipeline.

Each agent has a focused responsibility, LangGraph controls the execution order, FastAPI provides the backend API, and the React frontend provides an interactive developer experience.
