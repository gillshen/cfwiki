from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from target.models import School, Program, ApplicationRound

from target.serializers import (
    SchoolSerializer,
    SchoolStatsSerializer,
    SchoolCRUDSerializer,
    ProgramSerializer,
    ProgramStatsSerializer,
    ProgramCreateSerializer,
    ProgramCRUDSerializer,
    ApplicationRoundListSerializer,
    ApplicationRoundRUDSerializer,
    ApplicationRoundCreateSerializer,
)


class SchoolListView(ListAPIView):
    serializer_class = SchoolSerializer

    def get_queryset(self):
        query_params = self.request.query_params
        return School.filter(school_type=query_params.get("type"))


class SchoolStatsListView(SchoolListView):
    serializer_class = SchoolStatsSerializer


class SchoolDetailView(RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolStatsSerializer


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
        return Program.filter(program_type=query_params.get("type"))


class ProgramStatsListView(ProgramListView):
    serializer_class = ProgramStatsSerializer


class ProgramDetailView(RetrieveAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramStatsSerializer


class ProgramCreateView(CreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramCreateSerializer


class ProgramRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramCRUDSerializer


class ApplicationRoundListView(ListAPIView):
    serializer_class = ApplicationRoundListSerializer

    def get_queryset(self):
        q = ApplicationRound.objects.all().select_related("program_iteration")
        program_id = self.request.query_params.get("program")
        if program_id is not None:
            q = q.filter(program_iteration__program=program_id)
        return q


class ApplicationRoundRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ApplicationRound.objects.all()
    serializer_class = ApplicationRoundRUDSerializer


class ApplicationRoundCreateView(CreateAPIView):
    queryset = ApplicationRound.objects.all()
    serializer_class = ApplicationRoundCreateSerializer
