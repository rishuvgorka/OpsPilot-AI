from typing import TypedDict


class AgentState(TypedDict):
    query: str
    agent_type: str
    response: str
