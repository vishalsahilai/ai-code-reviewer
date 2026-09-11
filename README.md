# AI Code Reviewer & Optimizer

An AI-powered development tool that automatically analyzes Python code, detects problems, refactors the code, and generates documentation using a sequential multi-agent workflow.

The system is designed to help developers improve code quality, security, readability, maintainability, and documentation without manually reviewing every part of the code.

---

# 1. Project Overview

Developers often write code quickly while building features or testing ideas.

Because of this, code may contain:

* Security vulnerabilities
* SQL injection risks
* Hardcoded credentials
* Poor error handling
* Unnecessary or duplicated code
* PEP8 violations
* Performance issues
* Bad naming practices
* Missing documentation
* Maintainability problems

Manual code review can take significant time and small issues can easily be missed.

This project solves that problem by using multiple specialized AI agents that review the code sequentially.

Instead of asking one AI model to perform every task in a single prompt, each agent is responsible for one specific task.

---

# 2. Main Goal

The main goal is to build a system where a user can:

1. Paste Python code

or

2. Upload a `.py` file

The system will then automatically:

```text
Receive Python Code
        ↓
Analyze Code
        ↓
Detect Problems
        ↓
Generate Audit Report
        ↓
Refactor Code
        ↓
Generate Documentation
        ↓
Return Final Results
```

The user will be able to compare the original code with the improved version and understand what problems were found.

---

# 3. Core Architecture

The application will use a sequential multi-agent architecture.

The main workflow will be:

```text
User
  ↓
Frontend
  ↓
FastAPI Backend
  ↓
LangGraph Workflow
  ↓
Scanner Agent
  ↓
Refactor Agent
  ↓
Documentation Agent
  ↓
Final Result
  ↓
Frontend
```

Each agent receives information from the previous stage and updates the shared application state.

---

# 4. Technology Stack

## Frontend

The frontend will be built separately using a modern frontend framework such as:

```text
React
or
Next.js
```

The frontend will communicate with the backend through REST APIs.

Its main responsibilities will be:

* Code input
* `.py` file upload
* Displaying analysis progress
* Showing audit results
* Showing optimized code
* Showing generated documentation
* Downloading results

---

## Backend

Backend technology:

```text
FastAPI
```

FastAPI will handle:

* API requests
* File uploads
* Code validation
* Calling the LangGraph workflow
* Returning results to the frontend
* Error handling

---

## AI Orchestration

The multi-agent workflow will be managed using:

```text
LangGraph
```

LangGraph will determine which agent runs first, what information is passed between agents, and when the workflow finishes.

---

## LLM Integration

The AI agents will use:

```text
LangChain
+
Google Gemini
```

LangChain will provide the integration between our Python application and the Gemini model.

---

## Main Language

```text
Python
```

The first version of this project will analyze Python code only.

Support for JavaScript, TypeScript, Java, or other languages can be added later.

---

# 5. Multi-Agent Workflow

The first version contains three main agents.

```text
Scanner Agent
     ↓
Refactor Agent
     ↓
Documentation Agent
```

Each agent has a separate responsibility.

---

# 6. Scanner Agent

The Scanner Agent is the first agent in the workflow.

Its responsibility is to analyze the original code.

It should not modify the code.

The Scanner Agent will check for:

* Syntax problems
* Possible logical bugs
* Security vulnerabilities
* SQL injection
* Hardcoded passwords
* Hardcoded API keys
* Poor exception handling
* Unused imports
* Duplicate logic
* Poor variable names
* Poor function names
* PEP8 violations
* Performance problems
* Maintainability issues
* Unsafe coding practices

Example input:

```python
password = "admin123"

user = input("Username: ")

query = f"SELECT * FROM users WHERE username = '{user}'"
```

Possible Scanner Agent output:

```text
Issue 1

Type: Security
Severity: High
Problem: SQL Injection
Location: SQL query
Reason: User input is directly inserted into the SQL query.
Recommendation: Use parameterized SQL queries.

Issue 2

Type: Security
Severity: High
Problem: Hardcoded password
Location: password variable
Recommendation: Store secrets in environment variables.
```

The Scanner Agent will create an audit report that will be passed to the next agent.

---

# 7. Structured Audit Report

Instead of returning only unstructured text, the scanner should eventually return structured information.

Example:

```json
{
  "score": 60,
  "issues": [
    {
      "type": "security",
      "severity": "high",
      "line": 5,
      "title": "SQL Injection",
      "description": "User input is directly inserted into the SQL query.",
      "recommendation": "Use parameterized queries."
    }
  ]
}
```

This makes it easier for the frontend to display reports professionally.

For example:

```text
Code Quality Score

60 / 100

Security         45 / 100
Performance      80 / 100
Maintainability  65 / 100
Code Style       75 / 100
```

---

# 8. Refactor Agent

The Refactor Agent runs after the Scanner Agent.

It receives:

```text
Original Code
+
Audit Report
```

Its responsibility is to improve the code based on the detected problems.

The Refactor Agent should:

* Fix security problems
* Fix possible bugs
* Improve readability
* Follow PEP8
* Improve naming
* Remove unnecessary code
* Reduce duplication
* Improve error handling
* Improve maintainability
* Improve performance when appropriate

The most important rule is:

```text
Do not unnecessarily change the original functionality.
```

The refactored program should behave like the original program unless the original behavior itself contains a bug.

---

# 9. Documentation Agent

The Documentation Agent runs after the Refactor Agent.

It receives the improved code.

Its responsibilities include generating:

* Function docstrings
* Class docstrings
* Code explanations
* Project description
* Installation instructions
* Usage instructions
* Dependencies
* README documentation
* Important implementation notes

Example:

```python
def get_user(user_id: int):
    """
    Retrieve a user from the database.

    Args:
        user_id: Unique identifier of the user.

    Returns:
        User information if the user exists.
    """
```

The Documentation Agent may also generate a README file for the analyzed project.

---

# 10. LangGraph State Management

All agents need to share information.

For this purpose, LangGraph will use a shared state.

The state will initially contain:

```python
class AgentState(TypedDict):
    original_code: str
    audit_report: str
    refactored_code: str
    documentation: str
```

The data moves through the workflow like this:

```text
original_code
      ↓
Scanner Agent
      ↓
audit_report
      ↓
Refactor Agent
      ↓
refactored_code
      ↓
Documentation Agent
      ↓
documentation
```

---

# 11. LangGraph Workflow

The LangGraph pipeline will look like this:

```text
START
  ↓
Scanner Agent
  ↓
Refactor Agent
  ↓
Documentation Agent
  ↓
END
```

Internally:

```text
START
  |
  v
scanner_agent
  |
  v
refactor_agent
  |
  v
docs_agent
  |
  v
END
```

The graph will execute each agent in sequence.

---

# 12. User Input

The application will support two main input methods.

## Method 1 — Paste Code

The user can directly paste Python code into the frontend code editor.

Example:

```python
def calculate(a,b):
 return a+b
```

---

## Method 2 — Upload Python File

The user can upload a file such as:

```text
main.py
```

The frontend sends the file to FastAPI.

FastAPI reads the file content and passes it to LangGraph.

---

# 13. Backend API Flow

The frontend may send requests to an endpoint such as:

```text
POST /api/analyze
```

Example request concept:

```json
{
  "code": "def hello(): ..."
}
```

Or the API may accept a `.py` file.

FastAPI will then call the LangGraph workflow.

---

# 14. Backend Processing

The internal backend process will be:

```text
Request received
      ↓
Validate input
      ↓
Extract Python code
      ↓
Create AgentState
      ↓
Run LangGraph
      ↓
Scanner Agent
      ↓
Refactor Agent
      ↓
Documentation Agent
      ↓
Collect Results
      ↓
Return JSON Response
```

---

# 15. Example Final API Response

The backend may return:

```json
{
  "success": true,
  "original_code": "...",
  "audit_report": {
    "score": 72,
    "issues": []
  },
  "refactored_code": "...",
  "documentation": "..."
}
```

---

# 16. Frontend Results

The frontend can show four main sections.

```text
Original Code

Audit Report

Optimized Code

Documentation
```

A tab-based interface could look like:

```text
------------------------------------------------

Original | Audit | Optimized | Documentation

------------------------------------------------
```

---

# 17. Agent Progress Tracking

The frontend should also show which agent is currently running.

Example:

```text
Analyzing your code...

✓ File received

✓ Scanner Agent completed

● Refactor Agent running

○ Documentation Agent waiting
```

Later, real-time updates can be implemented using:

```text
WebSocket
or
Server-Sent Events
```

For the first version, normal API responses are enough.

---

# 18. Downloadable Results

The application should eventually allow users to download:

```text
optimized.py

audit-report.json

README.md
```

Later, all outputs can be packaged into:

```text
optimized-project.zip
```

---

# 19. Proposed Project Structure

```text
ai-code-reviewer/
│
├── backend/
│   │
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── scanner.py
│   │   ├── refactor.py
│   │   └── docs.py
│   │
│   ├── graph/
│   │   ├── __init__.py
│   │   ├── state.py
│   │   └── workflow.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── llm.py
│   │
│   ├── prompts/
│   │   ├── __init__.py
│   │   ├── scanner_prompt.py
│   │   ├── refactor_prompt.py
│   │   └── docs_prompt.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── analysis.py
│   │
│   └── utils/
│       ├── __init__.py
│       └── file_handler.py
│
├── frontend/
│
├── .gitignore
└── README.md
```

---

# 20. Folder Responsibilities

## `agents/`

Contains the AI agents.

```text
scanner.py
refactor.py
docs.py
```

Each file contains one specialized agent.

---

## `graph/`

Contains LangGraph-related code.

```text
state.py
workflow.py
```

`state.py` defines the shared state.

`workflow.py` connects all the agents.

---

## `services/`

Contains external service integrations.

For example:

```text
llm.py
```

This file initializes the Gemini model.

All agents can reuse the same LLM configuration.

---

## `prompts/`

Contains agent prompts.

This keeps prompts separate from application logic.

Example:

```text
scanner_prompt.py
refactor_prompt.py
docs_prompt.py
```

---

## `schemas/`

Contains Pydantic models used by FastAPI and structured AI responses.

For example:

```text
AnalysisRequest
AnalysisResponse
Issue
AuditReport
```

---

## `utils/`

Contains helper functions.

For example:

```text
Reading uploaded Python files
Validating file extensions
Cleaning model output
```

---

# 21. Development Order

The project should be built step by step.

We will not create everything at once.

The recommended order is:

```text
README.md
      ↓
graph/state.py
      ↓
services/llm.py
      ↓
prompts/scanner_prompt.py
      ↓
agents/scanner.py
      ↓
Test Scanner
      ↓
prompts/refactor_prompt.py
      ↓
agents/refactor.py
      ↓
Test Scanner + Refactor
      ↓
prompts/docs_prompt.py
      ↓
agents/docs.py
      ↓
graph/workflow.py
      ↓
Test Full LangGraph
      ↓
FastAPI Schemas
      ↓
FastAPI Routes
      ↓
File Upload Support
      ↓
Frontend
```

---

# 22. Git Workflow

We will use:

```text
One File = One Commit
```

For example:

```bash
git add README.md
git commit -m "docs: add project architecture and workflow"
git push
```

Then:

```bash
git add backend/graph/state.py
git commit -m "feat: add LangGraph agent state"
git push
```

Then the next file.

This will keep the GitHub history clean and easy to understand.

---

# 23. First Version Scope

The first version should stay simple.

It will support:

* Python only
* One `.py` file at a time
* Pasted Python code
* Scanner Agent
* Refactor Agent
* Documentation Agent
* Gemini
* LangChain
* LangGraph
* FastAPI
* React/Next.js frontend
* Audit report
* Refactored code
* Documentation

---

# 24. Future Features

After the first version works, more advanced features can be added.

Possible additions include:

* Multi-file projects
* ZIP uploads
* GitHub repository scanning
* JavaScript support
* TypeScript support
* Java support
* Automatic tests
* Code execution sandbox
* Ruff integration
* Bandit security scanning
* Pytest integration
* Before/after diff viewer
* Security score
* Performance score
* Code-quality score
* Agent retries
* Multiple Gemini API keys
* Automatic model fallback
* GitHub pull-request generation
* Downloadable optimized project
* Database history
* User authentication
* Previous scan history

---

# 25. Important Safety Rule

Uploaded code must initially be treated as text.

The backend should not automatically execute arbitrary user code.

The first version will:

```text
Read Code
Analyze Code
Refactor Code
Document Code
```

but it will not execute uploaded Python programs directly.

If automatic execution or testing is added later, it should use a secure isolated sandbox.

---

# 26. Final System Flow

The complete first-version workflow will be:

```text
                    USER
                      |
                      v
           Paste Code / Upload .py
                      |
                      v
                  FRONTEND
                      |
                      v
                 FASTAPI
                      |
                      v
               Input Validation
                      |
                      v
                 LANGGRAPH
                      |
                      v
              SCANNER AGENT
                      |
                      v
                Audit Report
                      |
                      v
              REFACTOR AGENT
                      |
                      v
               Optimized Code
                      |
                      v
                DOCS AGENT
                      |
                      v
                Documentation
                      |
                      v
                 FASTAPI
                      |
                      v
                  FRONTEND
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        Audit      Optimized     README
        Report       Code
```

---

# 27. Project Objective

The final objective is to create a developer tool that can take raw Python code and transform it into a cleaner, safer, more maintainable, and better documented version using specialized AI agents.

Instead of functioning as a simple AI chatbot, the application behaves like an automated software engineering pipeline.

Each agent has one responsibility, LangGraph controls the workflow, FastAPI provides the backend API, and the frontend provides the developer interface.
