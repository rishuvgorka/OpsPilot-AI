import os

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from rag.ingest import ingest_pdf
from rag.rag_chain import qa_chain


UPLOAD_DIR = "uploads"


@api_view(["GET"])
def health_check(request):
    return Response({"message": "Backend running"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_document(request):

    uploaded_file = request.FILES.get("file")

    if not uploaded_file:
        return Response(
            {"error": "No file uploaded"},
            status=400,
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(
        UPLOAD_DIR,
        uploaded_file.name,
    )

    with open(file_path, "wb+") as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    ingest_pdf(file_path)

    return Response({
        "message": "Document uploaded successfully"
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_query(request):

    query = request.data.get("query")

    if not query:
        return Response(
            {"error": "Query required"},
            status=400,
        )

    response = qa_chain.invoke({
        "query": query
    })

    return Response({
        "response": response["result"]
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "message": f"Hello {request.user.username}"
    })
