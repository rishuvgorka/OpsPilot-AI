from django.db import models
from django.contrib.auth.models import User


class ChatSession(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    title = models.CharField(
        max_length=255,
        default="New Chat",
    )

    def __str__(self):
        return self.title


class UploadedDocument(models.Model):

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="documents",
    )

    file_name = models.CharField(
        max_length=255
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    qdrant_doc_id = models.CharField(
        max_length=255
    )

    def __str__(self):
        return self.file_name


class Message(models.Model):

    ROLE_CHOICES = (
        ("user", "User"),
        ("assistant", "Assistant"),
    )

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
    )

    content = models.TextField()

    agent = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.role} - {self.session.id}"
