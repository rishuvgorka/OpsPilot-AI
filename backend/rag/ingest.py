import uuid

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .vector_store import vector_store


def ingest_pdf(file_path, session_id):

    loader = PyPDFLoader(file_path)

    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_documents(documents)

    document_id = str(uuid.uuid4())

    for chunk in chunks:

        chunk.metadata["session_id"] = str(session_id)

        chunk.metadata["document_id"] = document_id

    vector_store.add_documents(chunks)

    return document_id
