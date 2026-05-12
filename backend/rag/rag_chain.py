from langchain_classic.chains.retrieval_qa.base import RetrievalQA

from .gemini import llm
from .vector_store import vector_store


retriever = vector_store.as_retriever(
    search_kwargs={"k": 4}
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff",
)
