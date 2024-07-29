from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.models import Student, Contract, Application

from core.serializers import (
    StudentSerializer,
    StudentCRUDSerializer,
    ContractSerializer,
    ContractCRUDSerializer,
    ApplicationListSerializer,
    ApplicationCreateSerializer,
    ApplicationRUDSerializer,
)


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


class ApplicationListView(ListAPIView):
    queryset = (
        Application.objects.all()
        .select_related(
            "student",
            "round",
            "round__program_iteration",
            "round__program_iteration__program",
        )
        .prefetch_related("round__program_iteration__program__schools", "logs")
    )
    serializer_class = ApplicationListSerializer


class ApplicationDetailView(RetrieveAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationListSerializer


class ApplicationCreateView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer


class ApplicationRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationRUDSerializer
