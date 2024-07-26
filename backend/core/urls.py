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

from target.views import (
    SchoolListView,
    SchoolDetailView,
    SchoolCreateView,
    SchoolRUDView,
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
    path("contracts/<int:pk>/delete/", ContractRUDView.as_view()),
    # school
    path("schools/", SchoolListView.as_view()),
    path("schools/<int:pk>/", SchoolDetailView.as_view()),
    path("schools/new/", SchoolCreateView.as_view()),
    path("schools/<int:pk>/update/", SchoolRUDView.as_view()),
    path("schools/<int:pk>/delete/", SchoolRUDView.as_view()),
]
