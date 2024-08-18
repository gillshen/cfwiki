from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    get_object_or_404,
)
from rest_framework.response import Response
from rest_framework import status

from core.models import CFUser, Student, Service, Contract, Application, ApplicationLog

from core.serializers import (
    CFUserSerializer,
    StudentListSerializer,
    StudentByUserSerializer,
    StudentDetailSerializer,
    StudentCRUDSerializer,
    ContractDetailSerializer,
    ContractCRUDSerializer,
    ServiceCRUDSerializer,
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationCreateUpdateSerializer,
    ApplicationRUDSerializer,
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


class StudentListView(ListAPIView):
    queryset = Student.objects.all().prefetch_related(
        "contracts",
        "contracts__services",
    )
    serializer_class = StudentListSerializer


class StudentByUserListView(ListAPIView):
    serializer_class = StudentByUserSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Student.filter(
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
            student=query_params.get("student"),
            cfer=query_params.get("cfer"),
            school=query_params.get("school"),
            program=query_params.get("program"),
            program_iteration=query_params.get("program_iteration"),
            year=query_params.get("year"),
            term=query_params.get("term"),
            application_round=query_params.get("application_round"),
        )


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
    serializer_class = ApplicationCreateUpdateSerializer


class ApplicationUpdateRoundView(RetrieveUpdateDestroyAPIView):
    # for updating `round` only
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateUpdateSerializer


class ApplicationRUDView(RetrieveUpdateDestroyAPIView):
    # for general update and delete
    queryset = Application.objects.all()
    serializer_class = ApplicationRUDSerializer

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
