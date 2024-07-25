from django.urls import path

from core.views import (
    StudentListView,
    StudentDetailView,
    StudentCreateView,
    StudentRUDView,
)

urlpatterns = [
    path("students/", StudentListView.as_view()),
    path("students/<int:pk>/", StudentDetailView.as_view()),
    path("students/new/", StudentCreateView.as_view()),
    path("students/<int:pk>/update/", StudentRUDView.as_view()),
    path("students/<int:pk>/delete/", StudentRUDView.as_view()),
]
