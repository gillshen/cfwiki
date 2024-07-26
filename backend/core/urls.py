from django.urls import path

from core.views import (
    StudentListView,
    StudentDetailView,
    StudentCreateView,
    StudentRUDView,
    ContractDetailView,
    ContractCreateView,
    ContractRUDView,
)

urlpatterns = [
    # student
    path("students/", StudentListView.as_view()),
    path("students/<int:pk>/", StudentDetailView.as_view()),
    path("students/new/", StudentCreateView.as_view()),
    path("students/<int:pk>/update/", StudentRUDView.as_view()),
    path("students/<int:pk>/delete/", StudentRUDView.as_view()),
    # contract
    path("contracts/<int:pk>/", ContractDetailView.as_view()),
    path("contracts/new/", ContractCreateView.as_view()),
    path("contracts/<int:pk>/update/", ContractRUDView.as_view()),
]
