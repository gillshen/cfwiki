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
    ApplicationLogCreateView,
    ApplicationLogRUDView,
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
    ApplicationRoundRUDView,
)

from academics.views import (
    EnrollmentDetailView,
    EnrollmentCreateView,
    EnrollmentRUDView,
    GradeCreateView,
    GradeRUDView,
    TOEFLScoreCreateView,
    TOEFLScoreRUDView,
    IELTSScoreCreateView,
    IELTSScoreRUDView,
    DuolingoScoreCreateView,
    DuolingoScoreRUDView,
    SATScoreCreateView,
    SATScoreRUDView,
    ACTScoreCreateView,
    ACTScoreRUDView,
    APScoreCreateView,
    APScoreRUDView,
    IBGradeCreateView,
    IBGradeRUDView,
    ALevelGradeCreateView,
    ALevelGradeRUDView,
    GREScoreCreateView,
    GREScoreRUDView,
    GMATScoreCreateView,
    GMATScoreRUDView,
    LSATScoreCreateView,
    LSATScoreRUDView,
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
    # application round
    path("application-rounds/<int:pk>/update/", ApplicationRoundRUDView.as_view()),
    # application
    path("applications/", ApplicationListView.as_view()),
    path("applications/<int:pk>/", ApplicationDetailView.as_view()),
    path("applications/new/", ApplicationCreateView.as_view()),
    path("applications/<int:pk>/update/", ApplicationRUDView.as_view()),
    # application log
    path("application-logs/new/", ApplicationLogCreateView.as_view()),
    path("application-logs/<int:pk>/update/", ApplicationLogRUDView.as_view()),
    # enrollment
    path("enrollments/new/", EnrollmentCreateView.as_view()),
    path("enrollments/<int:pk>/", EnrollmentDetailView.as_view()),
    path("enrollments/<int:pk>/update/", EnrollmentRUDView.as_view()),
    # grade
    path("grades/new/", GradeCreateView.as_view()),
    path("grades/<int:pk>/update/", GradeRUDView.as_view()),
    # TOEFL
    path("toefl/new/", TOEFLScoreCreateView.as_view()),
    path("toefl/<int:pk>/update/", TOEFLScoreRUDView.as_view()),
    # IELTS
    path("ielts/new/", IELTSScoreCreateView.as_view()),
    path("ielts/<int:pk>/update/", IELTSScoreRUDView.as_view()),
    # Duolingo
    path("duolingo/new/", DuolingoScoreCreateView.as_view()),
    path("duolingo/<int:pk>/update/", DuolingoScoreRUDView.as_view()),
    # SAT
    path("sat-scores/new/", SATScoreCreateView.as_view()),
    path("sat-scores/<int:pk>/update/", SATScoreRUDView.as_view()),
    # ACT
    path("act-scores/new/", ACTScoreCreateView.as_view()),
    path("act-scores/<int:pk>/update/", ACTScoreRUDView.as_view()),
    # AP
    path("ap-scores/new/", APScoreCreateView.as_view()),
    path("ap-scores/<int:pk>/update/", APScoreRUDView.as_view()),
    # IB
    path("ib-grades/new/", IBGradeCreateView.as_view()),
    path("ib-grades/<int:pk>/update/", IBGradeRUDView.as_view()),
    # A-level
    path("alevel-grades/new/", ALevelGradeCreateView.as_view()),
    path("alevel-grades/<int:pk>/update/", ALevelGradeRUDView.as_view()),
    # GRE
    path("gre-scores/new/", GREScoreCreateView.as_view()),
    path("gre-scores/<int:pk>/update/", GREScoreRUDView.as_view()),
    # GMAT
    path("gmat-scores/new/", GMATScoreCreateView.as_view()),
    path("gmat-scores/<int:pk>/update/", GMATScoreRUDView.as_view()),
    # LSAT
    path("lsat-scores/new/", LSATScoreCreateView.as_view()),
    path("lsat-scores/<int:pk>/update/", LSATScoreRUDView.as_view()),
]
