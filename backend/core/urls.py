from django.urls import path

from core.views import StudentListView

urlpatterns = [
    path("students/", StudentListView.as_view()),
]
