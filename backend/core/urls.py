from django.urls import path

from core.views import StudentListView, StudentDetailView, StudentCreateView

urlpatterns = [
    path("students/", StudentListView.as_view()),
    path("students/<int:pk>/", StudentDetailView.as_view()),
    path("students/new/", StudentCreateView.as_view()),
]
