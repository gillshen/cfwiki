from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from target.models import School, Program

from target.serializers import (
    SchoolSerializer,
    SchoolCRUDSerializer,
    ProgramSerializer,
    ProgramCreateSerializer,
    ProgramCRUDSerializer,
)


class SchoolListView(ListAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer


class SchoolDetailView(RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer


class SchoolCreateView(CreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolCRUDSerializer


class SchoolRUDView(RetrieveUpdateDestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolCRUDSerializer


class ProgramListView(ListAPIView):
    queryset = Program.objects.all().prefetch_related("schools")
    serializer_class = ProgramSerializer


class ProgramDetailView(RetrieveAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ProgramCreateView(CreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramCreateSerializer


class ProgramRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramCRUDSerializer
