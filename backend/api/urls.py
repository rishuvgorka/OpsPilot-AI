from django.urls import path
from .views import health_check, protected_view

urlpatterns = [
    path("health/", health_check),
    path("protected/", protected_view),
]
