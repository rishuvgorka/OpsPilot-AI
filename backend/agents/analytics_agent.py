from rag.gemini import llm


def analytics_agent(state):

    query = state["query"]

    prompt = f'''
    Perform an analytical evaluation for:

    {query}

    Include:
    - Trends
    - Insights
    - Recommendations
    - Risk factors
    '''

    response = llm.invoke(prompt)

    return {
        "response": response.content
    }
