from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

from langchain_qdrant import QdrantVectorStore

from .gemini import embeddings


COLLECTION_NAME = "opspilot_docs"

client = QdrantClient(
    url="http://qdrant:6333"
)


# DELETE OLD COLLECTION IF EXISTS
collections = client.get_collections().collections
collection_names = [c.name for c in collections]

if COLLECTION_NAME in collection_names:
    client.delete_collection(COLLECTION_NAME)


# CREATE NEW COLLECTION
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
