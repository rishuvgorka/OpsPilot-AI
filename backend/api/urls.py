from django.urls import path

from .views import (
    health_check,
    protected_view,
    upload_document,
    chat_query,
    get_sessions,
    create_session,
    get_session_messages,
)

urlpatterns = [
    path("health/", health_check),

    path("protected/", protected_view),

    path("sessions/", get_sessions),

    path(
        "sessions/create/",
        create_session,
    ),

    path(
        "sessions/<int:session_id>/",
        get_session_messages,
    ),

    path("upload/", upload_document),

    path("chat/", chat_query),
]
