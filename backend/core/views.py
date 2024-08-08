from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.models import CFUser, Student, Service, Contract, Application, ApplicationLog

from core.serializers import (
    CFUserSerializer,
    StudentListSerializer,
    StudentDetailSerializer,
    StudentCRUDSerializer,
    ContractDetailSerializer,
    ContractCRUDSerializer,
    ServiceCRUDSerializer,
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationCreateSerializer,
    ApplicationRUDSerializer,
    ApplicationLogCRUDSerializer,
)


class CFUserListView(ListAPIView):
    queryset = CFUser.objects.all()
    serializer_class = CFUserSerializer


class StudentListView(ListAPIView):
    queryset = Student.objects.all().prefetch_related("contracts")
    serializer_class = StudentListSerializer


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
            school=query_params.get("school"),
            program=query_params.get("program"),
            program_iteration=query_params.get("program_iteration"),
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
    serializer_class = ApplicationCreateSerializer


class ApplicationRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationRUDSerializer


class ApplicationLogCreateView(CreateAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogCRUDSerializer


class ApplicationLogRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ApplicationLog.objects.all()
    serializer_class = ApplicationLogCRUDSerializer
