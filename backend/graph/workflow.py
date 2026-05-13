from langgraph.graph import StateGraph, END

from .state import AgentState

from .nodes import (
    router_node,
    rag_node,
    report_node,
    analytics_node,
)

workflow = StateGraph(AgentState)

workflow.add_node("router", router_node)

workflow.add_node("rag", rag_node)

workflow.add_node("report", report_node)

workflow.add_node("analytics", analytics_node)

workflow.set_entry_point("router")


def route_decision(state):

    if state["agent_type"] == "analytics":
        return "analytics"

    elif state["agent_type"] == "report":
        return "report"

    return "rag"


workflow.add_conditional_edges(
    "router",
    route_decision,
)

workflow.add_edge("rag", END)

workflow.add_edge("report", END)

workflow.add_edge("analytics", END)

graph = workflow.compile()
