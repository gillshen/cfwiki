from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.models import Student, Contract

from core.serializers import (
    StudentSerializer,
    StudentCRUDSerializer,
    ContractSerializer,
    ContractCRUDSerializer,
)


class StudentListView(ListAPIView):
    queryset = Student.objects.all()
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
