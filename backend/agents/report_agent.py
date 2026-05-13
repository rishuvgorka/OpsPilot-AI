from rag.gemini import llm


def report_agent(state):

    query = state["query"]

    prompt = f'''
    Generate a professional report for:

    {query}

    Include:
    - Summary
    - Key insights
    - Recommendations
    '''

    response = llm.invoke(prompt)

    return {
        "response": response.content
    }
