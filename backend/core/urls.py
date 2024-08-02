from django.urls import path

from core.views import (
    CFUserListView,
    StudentListView,
    StudentDetailView,
    StudentCreateView,
    StudentRUDView,
    ContractDetailView,
    ContractCreateView,
    ContractRUDView,
    ServiceCreateView,
    ServiceRUDView,
    ApplicationListView,
    ApplicationDetailView,
    ApplicationCreateView,
    ApplicationRUDView,
)

from target.views import (
    SchoolListView,
    SchoolDetailView,
    SchoolCreateView,
    SchoolRUDView,
    ProgramListView,
    ProgramDetailView,
    ProgramCreateView,
    ProgramRUDView,
)

urlpatterns = [
    # user
    path("users/", CFUserListView.as_view()),
    # student
    path("students/", StudentListView.as_view()),
    path("students/<int:pk>/", StudentDetailView.as_view()),
    path("students/new/", StudentCreateView.as_view()),
    path("students/<int:pk>/update/", StudentRUDView.as_view()),
    # contract
    path("contracts/<int:pk>/", ContractDetailView.as_view()),
    path("contracts/new/", ContractCreateView.as_view()),
    path("contracts/<int:pk>/update/", ContractRUDView.as_view()),
    # service
    path("services/new/", ServiceCreateView.as_view()),
    path("services/<int:pk>/update/", ServiceRUDView.as_view()),
    # school
    path("schools/", SchoolListView.as_view()),
    path("schools/<int:pk>/", SchoolDetailView.as_view()),
    path("schools/new/", SchoolCreateView.as_view()),
    path("schools/<int:pk>/update/", SchoolRUDView.as_view()),
    # program
    path("programs/", ProgramListView.as_view()),
    path("programs/<int:pk>/", ProgramDetailView.as_view()),
    path("programs/new/", ProgramCreateView.as_view()),
    path("programs/<int:pk>/update/", ProgramRUDView.as_view()),
    # application
    path("applications/", ApplicationListView.as_view()),
    path("applications/<int:pk>/", ApplicationDetailView.as_view()),
    path("applications/new/", ApplicationCreateView.as_view()),
    path("applications/<int:pk>/update/", ApplicationRUDView.as_view()),
]
