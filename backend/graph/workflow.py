from langgraph.graph import END, START, StateGraph

from backend.agents.docs import docs_agent
from backend.agents.refactor import refactor_agent
from backend.agents.scanner import scanner_agent
from backend.graph.state import AgentState


def build_workflow():
    """
    Build and compile the sequential LangGraph workflow.

    Flow:
        START
          ↓
        Scanner
          ↓
        Refactor
          ↓
        Documentation
          ↓
        END
    """

    workflow = StateGraph(AgentState)

    workflow.add_node("scanner", scanner_agent)
    workflow.add_node("refactor", refactor_agent)
    workflow.add_node("docs", docs_agent)

    workflow.add_edge(START, "scanner")
    workflow.add_edge("scanner", "refactor")
    workflow.add_edge("refactor", "docs")
    workflow.add_edge("docs", END)

    return workflow.compile()


graph = build_workflow()