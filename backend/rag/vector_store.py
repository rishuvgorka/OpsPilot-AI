from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
)

from langchain_qdrant import QdrantVectorStore

from .gemini import embeddings


client = QdrantClient(
    url="http://qdrant:6333"
)

COLLECTION_NAME = "opspilot_docs"


collections = client.get_collections().collections

collection_names = [
    c.name for c in collections
]


# CREATE COLLECTION ONLY IF NOT EXISTS
if COLLECTION_NAME not in collection_names:

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=3072,
            distance=Distance.COSINE,
        ),
    )


vector_store = QdrantVectorStore(
    client=client,
    collection_name=COLLECTION_NAME,
    embedding=embeddings,
)
