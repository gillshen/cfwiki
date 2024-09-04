from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    RetrieveUpdateDestroyAPIView,
    get_object_or_404,
)
from rest_framework.response import Response
from rest_framework import status

from django.db.models import OuterRef, Subquery, Count, F, Q

from core.models import CFUser, Student, Service, Contract, Application, ApplicationLog
from target.models import School

from core.serializers import (
    CFUserSerializer,
    CFUserUpdateSerializer,
    CFUserPasswordResetSerializer,
    StudentListSerializer,
    StudentPerUserSerializer,
    StudentDetailSerializer,
    StudentStaffListSerializer,
    StudentCRUDSerializer,
    ContractDetailSerializer,
    ContractCRUDSerializer,
    ServiceCRUDSerializer,
    ApplicationListSerializer,
    ApplicantListSerializer,
    ApplicationDetailSerializer,
    ApplicationCRUDSerializer,
    ApplicationPerProgramSerializer,
    ApplicationPerSchoolSerializer,
    ApplicationLogCRUDSerializer,
)

_PENDING = ["Started", "Submitted", "Under Review", "Deferred", "On Waitlist"]
_ACCEPTED = ["Accepted", "Enrolled"]
_DENIED = ["Rejected", "Pres. Rejected", "Offer Rescinded"]
_NEUTRAL = ["Cancelled", "Withdrawn", "Untracked"]


class CFUserListView(ListAPIView):
    queryset = CFUser.objects.all()
    serializer_class = CFUserSerializer


class CFUserDetailView(RetrieveAPIView):
    queryset = CFUser.objects.all()
    serializer_class = CFUserSerializer

    def get_object(self):
        username = self.kwargs["username"]
        user = get_object_or_404(CFUser, username=username)
        self.check_object_permissions(self.request, user)
        return user


class CFUserUpdateView(UpdateAPIView):
    queryset = CFUser.objects.all()
    serializer_class = CFUserUpdateSerializer


class CFUserPasswordUpdateView(UpdateAPIView):
    queryset = CFUser.objects.all()
    serializer_class = CFUserPasswordResetSerializer


class StudentListView(ListAPIView):

    serializer_class = StudentListSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Student.filter(
            Student.q_related(),
            target_year=query_params.get("target_year"),
            contract_type=query_params.get("contract_type"),
            contract_status=query_params.get("contract_status"),
        )


class StudentPerUserListView(ListAPIView):
    serializer_class = StudentPerUserSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Student.filter(
            Student.objects.all().prefetch_related("contracts__services__cfer"),
            cfer=query_params.get("cfer"),
            contract_type=query_params.get("contract_type"),
            target_year=query_params.get("target_year"),
        )


class StudentDetailView(RetrieveAPIView):
    queryset = Student.objects.all().prefetch_related(
        "contracts",
        "toefl",
        "ielts",
        "duolingo",
        "sat",
        "act",
        "ap",
        "ib",
        "alevel",
        "gre",
        "gmat",
        "lsat",
        "enrollments__school",
        "enrollments__grades",
    )
    serializer_class = StudentDetailSerializer


class StudentStaffListView(RetrieveAPIView):
    queryset = Student.objects.all().prefetch_related("contracts__services")
    serializer_class = StudentStaffListSerializer


class StudentCreateView(CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentCRUDSerializer


class StudentRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentCRUDSerializer


class ContractDetailView(RetrieveAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractDetailSerializer


class ContractCreateView(CreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractCRUDSerializer


class ContractRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractCRUDSerializer


class ServiceCreateView(CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceCRUDSerializer


class ServiceRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceCRUDSerializer


class ApplicationListView(ListAPIView):
    serializer_class = ApplicationListSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Application.filter(
            Application.q_related(),
            student=query_params.get("student"),
            cfer=query_params.get("cfer"),
            school=query_params.get("school"),
            program=query_params.get("program"),
            program_iteration=query_params.get("program_iteration"),
            year=query_params.get("year"),
            application_type=query_params.get("application_type"),
            status=query_params.get("status"),
        )


class ApplicantListView(ListAPIView):
    serializer_class = ApplicantListSerializer

    def get_queryset(self):
        q = Student.objects.prefetch_related(
            "toefl",
            "ielts",
            "duolingo",
            "sat",
            "act",
            "gre",
            "gmat",
            "lsat",
            "ap",
            "ib",
            "alevel",
        )
        student_id = self.request.query_params.get("id")
        if student_id is not None:
            q = q.filter(id=student_id)
        return q


class ApplicationDetailView(RetrieveAPIView):
    queryset = (
        Application.objects.all()
        .select_related(
            "round",
            "round__program_iteration",
            "round__program_iteration__program",
        )
        .prefetch_related(
            "contract__student",
            "contract__services",
            "round__program_iteration__program",
            "logs",
        )
    )
    serializer_class = ApplicationDetailSerializer


class ApplicationCreateView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCRUDSerializer


class ApplicationRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCRUDSerializer

    def destroy(self, request, *args, **kwargs):
        """Return the student after deletion"""
        instance = self.get_object()
        student = instance.student
        instance.delete()
        student_serializer = StudentCRUDSerializer(student)
        return Response(student_serializer.data, status=status.HTTP_200_OK)


class ApplicationPerProgramListView(ListAPIView):
    serializer_class = ApplicationPerProgramSerializer

    def get_queryset(self):
        params = self.request.query_params
        program_id = params.get("program_id")
        application_type = params.get("application_type")

        q = Application.objects.select_related("round__program_iteration__program")
        if program_id is not None:
            q = q.filter(round__program_iteration__program=program_id)
        if application_type is not None:
            q = Application.filter_by_type(q, application_type)

        status_subquery = (
            ApplicationLog.objects.filter(application=OuterRef("pk"))
            .order_by("-date", "-updated")
            .values("status")[:1]
        )

        return (
            q.prefetch_related("logs")
            .annotate(latest_status=Subquery(status_subquery))
            .values("round__program_iteration__program")
            .annotate(
                program_id=F("round__program_iteration__program"),
                applied=Count("id"),
                pending=Count(
                    "id",
                    filter=Q(latest_status__isnull=True)
                    | Q(latest_status__in=_PENDING),
                ),
                accepted=Count("id", filter=Q(latest_status__in=_ACCEPTED)),
                denied=Count("id", filter=Q(latest_status__in=_DENIED)),
                neutral=Count("id", filter=Q(latest_status__in=_NEUTRAL)),
            )
        )


class ApplicationPerSchoolListView(ListAPIView):
    serializer_class = ApplicationPerSchoolSerializer

    def get_queryset(self):
        school_id = self.request.query_params.get("school_id")

        q = (
            Application.objects.select_related("round__program_iteration__program")
            .prefetch_related("round__program_iteration__program__schools")
            .filter(
                round__program_iteration__program__schools__type__in=[
                    School.Type.UNIVERSITY,
                    School.Type.OTHER,
                ]
            )
        )
        if school_id is not None:
            q = q.filter(round__program_iteration__program__schools=school_id)

        status_subquery = (
            ApplicationLog.objects.filter(application=OuterRef("pk"))
            .order_by("-date", "-updated")
            .values("status")[:1]
        )

        is_ug = Q(
            round__program_iteration__program__type__in=["UG Freshman", "UG Transfer"]
        )
        is_grad = Q(
            round__program_iteration__program__type__in=["Master's", "Doctorate"]
        )
        no_status = Q(latest_status__isnull=True)
        pending = Q(latest_status__in=_PENDING)
        accepted = Q(latest_status__in=_ACCEPTED)
        denied = Q(latest_status__in=_DENIED)
        neutral = Q(latest_status__in=_NEUTRAL)

        return (
            q.prefetch_related("logs")
            .annotate(latest_status=Subquery(status_subquery))
            .values("round__program_iteration__program__schools")
            .annotate(
                school_id=F("round__program_iteration__program__schools"),
                ug_applied=Count("id", filter=is_ug),
                ug_pending=Count("id", filter=is_ug & (no_status | pending)),
                ug_accepted=Count("id", filter=is_ug & accepted),
                ug_denied=Count("id", filter=is_ug & denied),
                ug_neutral=Count("id", filter=is_ug & neutral),
                grad_applied=Count("id", filter=is_grad),
                grad_pending=Count("id", filter=is_grad & (no_status | pending)),
                grad_accepted=Count("id", filter=is_grad & accepted),
                grad_denied=Count("id", filter=is_grad & denied),
                grad_neutral=Count("id", filter=is_grad & neutral),
            )
        )


class ApplicationLogCreateView(CreateAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogCRUDSerializer


class ApplicationLogRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogCRUDSerializer
