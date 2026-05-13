from agents.router_agent import router_agent
from agents.rag_agent import rag_agent
from agents.report_agent import report_agent
from agents.analytics_agent import analytics_agent


def router_node(state):
    return router_agent(state)


def rag_node(state):
    return rag_agent(state)


def report_node(state):
    return report_agent(state)


def analytics_node(state):
    return analytics_agent(state)
