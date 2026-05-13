from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
)

from langchain_qdrant import QdrantVectorStore

from .gemini import embeddings

COLLECTION_NAME = "opspilot_docs"

client = QdrantClient(
    url="http://qdrant:6333"
)

collections = client.get_collections().collections

collection_names = [
    collection.name
    for collection in collections
]

if COLLECTION_NAME not in collection_names:

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=768,
            distance=Distance.COSINE,
        ),
    )

vector_store = QdrantVectorStore(
    client=client,
    collection_name=COLLECTION_NAME,
    embedding=embeddings,
)
