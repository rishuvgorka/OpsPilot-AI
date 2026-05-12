from django.urls import path

from .views import (
    health_check,
    protected_view,
    upload_document,
    chat_query,
)

urlpatterns = [
    path("health/", health_check),
    path("protected/", protected_view),
    path("upload/", upload_document),
    path("chat/", chat_query),
]
