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

from core.models import CFUser, Student, Service, Contract, Application, ApplicationLog

from core.serializers import (
    CFUserSerializer,
    CFUserUpdateSerializer,
    CFUserPasswordResetSerializer,
    StudentListSerializer,
    StudentByUserSerializer,
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
    ApplicationLogCRUDSerializer,
)


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


class StudentByUserListView(ListAPIView):
    serializer_class = StudentByUserSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Student.filter(
            Student.q_related(),
            cfer=query_params.get("cfer"),
            contract_type=query_params.get("contract_type"),
            target_year=query_params.get("target_year"),
        )


class StudentDetailView(RetrieveAPIView):
    queryset = Student.objects.all().prefetch_related(
        "contracts",
        "enrollments",
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
    queryset = Student.objects.all().prefetch_related(
        "contracts",
        "contracts__services",
    )
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
            term=query_params.get("term"),
            application_round=query_params.get("application_round"),
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


class ApplicationLogCreateView(CreateAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogCRUDSerializer


class ApplicationLogRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogCRUDSerializer
