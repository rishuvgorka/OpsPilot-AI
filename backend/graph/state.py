from typing import TypedDict, List


class AgentState(TypedDict):

    query: str

    session_id: int

    agent_type: str

    response: str

    chat_history: List[str]

    sources: List[str]
