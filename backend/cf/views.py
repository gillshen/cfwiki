from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from cf.models import AcademyProgram

from cf.serializers import (
    AcademyProgramListSerializer,
    AcademyProgramDetailSerializer,
    AcademyProgramCRUDSerializer,
)


class AcademyProgramListView(ListAPIView):
    queryset = AcademyProgram.objects.all()
    serializer_class = AcademyProgramListSerializer


class AcademyProgramDetailView(RetrieveAPIView):
    queryset = AcademyProgram.objects.prefetch_related("students")
    serializer_class = AcademyProgramDetailSerializer


class AcademyProgramCreateView(CreateAPIView):
    queryset = AcademyProgram.objects.all()
    serializer_class = AcademyProgramCRUDSerializer


class AcademyProgramRUDView(RetrieveUpdateDestroyAPIView):
    queryset = AcademyProgram.objects.all()
    serializer_class = AcademyProgramCRUDSerializer
