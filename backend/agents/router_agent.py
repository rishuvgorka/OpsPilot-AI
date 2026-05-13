def router_agent(state):

    query = state["query"].lower()

    if any(word in query for word in [
        "analyze",
        "csv",
        "trend",
        "statistics",
        "graph",
    ]):

        return {
            "agent_type": "analytics"
        }

    elif any(word in query for word in [
        "summary",
        "report",
        "summarize",
        "action items",
    ]):

        return {
            "agent_type": "report"
        }

    return {
        "agent_type": "rag"
    }
