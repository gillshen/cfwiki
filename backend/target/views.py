from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from target.models import School, Program, ProgramGroup, ApplicationRound

from target.serializers import (
    SchoolSerializer,
    SchoolCRUDSerializer,
    ProgramSerializer,
    ProgramCreateSerializer,
    ProgramCRUDSerializer,
    ProgramGroupSerializer,
    ApplicationRoundSerializer,
    ApplicationRoundRUDSerializer,
    ApplicationRoundCreateSerializer,
)


class SchoolListView(ListAPIView):
    serializer_class = SchoolSerializer

    def get_queryset(self):
        query_params = self.request.query_params
        return School.filter(School.objects.all(), school_type=query_params.get("type"))


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
    serializer_class = ProgramSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return Program.filter(
            Program.objects.prefetch_related("schools"),
            school=query_params.get("school"),
            program_type=query_params.get("type"),
        )


class ProgramDetailView(RetrieveAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ProgramCreateView(CreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramCreateSerializer


class ProgramRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramCRUDSerializer


class ProgramGroupListView(ListAPIView):
    queryset = ProgramGroup.objects.prefetch_related("programs").all()
    serializer_class = ProgramGroupSerializer


class ApplicationRoundListView(ListAPIView):
    serializer_class = ApplicationRoundSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return ApplicationRound.filter(
            program_type=query_params.get("program_type"),
            program=query_params.get("program"),
            year=query_params.get("year"),
            term=query_params.get("term"),
        )


class ApplicationRoundDetailView(RetrieveAPIView):
    queryset = ApplicationRound.objects.all()
    serializer_class = ApplicationRoundSerializer


class ApplicationRoundRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ApplicationRound.objects.all()
    serializer_class = ApplicationRoundRUDSerializer


class ApplicationRoundCreateView(CreateAPIView):
    queryset = ApplicationRound.objects.all()
    serializer_class = ApplicationRoundCreateSerializer
