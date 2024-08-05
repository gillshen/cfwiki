from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.models import CFUser, Student, Service, Contract, Application

from core.serializers import (
    CFUserSerializer,
    StudentSerializer,
    StudentCRUDSerializer,
    ContractSerializer,
    ContractCRUDSerializer,
    ServiceCRUDSerializer,
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationCreateSerializer,
    ApplicationRUDSerializer,
)


class CFUserListView(ListAPIView):
    queryset = CFUser.objects.all()
    serializer_class = CFUserSerializer


class StudentListView(ListAPIView):
    queryset = Student.objects.all().prefetch_related("contracts")
    serializer_class = StudentSerializer


class StudentDetailView(RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentCreateView(CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentCRUDSerializer


class StudentRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentCRUDSerializer


class ContractDetailView(RetrieveAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


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
    queryset = Application.objects.all()
    serializer_class = ApplicationDetailSerializer


class ApplicationCreateView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer


class ApplicationRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationRUDSerializer
