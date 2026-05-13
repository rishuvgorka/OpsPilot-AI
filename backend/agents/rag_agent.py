from rag.rag_chain import qa_chain


def rag_agent(state):

    query = state["query"]

    response = qa_chain.invoke({
        "query": query
    })

    return {
        "response": response["result"]
    }
