from qdrant_client.models import (
    Filter,
    FieldCondition,
    MatchValue,
)

from rag.vector_store import vector_store
from rag.gemini import llm


def rag_agent(state):

    query = state["query"]

    session_id = state["session_id"]

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 4,
            "filter": Filter(
                must=[
                    FieldCondition(
                        key="metadata.session_id",
                        match=MatchValue(
                            value=str(session_id)
                        ),
                    )
                ]
            ),
        }
    )

    docs = retriever.invoke(query)

    if not docs:

        return {
            "response": (
                "No relevant documents found "
                "for this chat session."
            ),
            "sources": [],
        }

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
    You are OpsPilot AI.

    IMPORTANT:
    - Answer ONLY from provided context.
    - Do NOT hallucinate.
    - Do NOT use external knowledge.
    - If answer is not present, say:
      'The uploaded documents do not contain this information.'

    Context:
    {context}

    Chat History:
    {state.get('chat_history', [])}

    User Question:
    {query}
    """

    response = llm.invoke(prompt)

    sources = [
        doc.page_content[:200]
        for doc in docs
    ]

    return {
        "response": response.content,
        "sources": sources,
    }
