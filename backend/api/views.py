import os

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from graph.workflow import graph

from rag.ingest import ingest_pdf

from .models import (
    ChatSession,
    Message,
    UploadedDocument,
)

from .serializers import ChatSessionSerializer


UPLOAD_DIR = "uploads"


@api_view(["GET"])
def health_check(request):

    return Response({
        "message": "Backend running"
    })


# CREATE NEW CHAT SESSION
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_session(request):

    session = ChatSession.objects.create(
        user=request.user,
        title="New Chat",
    )

    return Response({
        "session_id": session.id,
    })


# GET ALL SESSIONS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sessions(request):

    sessions = ChatSession.objects.filter(
        user=request.user
    ).order_by("-created_at")

    serializer = ChatSessionSerializer(
        sessions,
        many=True,
    )

    return Response(serializer.data)


# GET SINGLE SESSION MESSAGES
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_session_messages(request, session_id):

    try:

        session = ChatSession.objects.get(
            id=session_id,
            user=request.user,
        )

    except ChatSession.DoesNotExist:

        return Response(
            {"error": "Session not found"},
            status=404,
        )

    messages = Message.objects.filter(
        session=session
    ).order_by("created_at")

    data = []

    for msg in messages:

        data.append({
            "role": msg.role,
            "content": msg.content,
            "agent": msg.agent,
        })

    return Response(data)


# UPLOAD DOCUMENT
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_document(request):

    uploaded_file = request.FILES.get("file")

    session_id = request.data.get("session_id")

    if not uploaded_file:

        return Response(
            {"error": "No file uploaded"},
            status=400,
        )

    if not session_id:

        return Response(
            {"error": "session_id required"},
            status=400,
        )

    try:

        session = ChatSession.objects.get(
            id=session_id,
            user=request.user,
        )

    except ChatSession.DoesNotExist:

        return Response(
            {"error": "Invalid session"},
            status=404,
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(
        UPLOAD_DIR,
        uploaded_file.name,
    )

    with open(file_path, "wb+") as destination:

        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    document_id = ingest_pdf(
        file_path,
        session.id,
    )

    UploadedDocument.objects.create(
        session=session,
        file_name=uploaded_file.name,
        qdrant_doc_id=document_id,
    )

    return Response({
        "message": "Document uploaded successfully",
        "document_id": document_id,
    })


# CHAT QUERY
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_query(request):

    query = request.data.get("query")

    session_id = request.data.get("session_id")

    if not query:

        return Response(
            {"error": "Query required"},
            status=400,
        )

    if not session_id:

        return Response(
            {"error": "session_id required"},
            status=400,
        )

    try:

        session = ChatSession.objects.get(
            id=session_id,
            user=request.user,
        )

    except ChatSession.DoesNotExist:

        return Response(
            {"error": "Invalid session"},
            status=404,
        )

    previous_messages = Message.objects.filter(
        session=session
    ).order_by("created_at")

    chat_history = [
        f"{msg.role}: {msg.content}"
        for msg in previous_messages
    ]

    Message.objects.create(
        session=session,
        role="user",
        content=query,
    )

    # AUTO SESSION TITLE
    if session.title == "New Chat":

        session.title = query[:50]

        session.save()

    result = graph.invoke({
        "query": query,
        "chat_history": chat_history,
        "session_id": str(session.id),
    })

    Message.objects.create(
        session=session,
        role="assistant",
        content=result["response"],
        agent=result["agent_type"],
    )

    return Response({
        "response": result["response"],
        "agent": result["agent_type"],
        "sources": result.get("sources", []),
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):

    return Response({
        "message": f"Hello {request.user.username}"
    })
