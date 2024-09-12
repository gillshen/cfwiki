from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from target.models import School, Program, ProgramCollection, ApplicationRound

from target.serializers import (
    SchoolSerializer,
    SchoolCRUDSerializer,
    ProgramSerializer,
    ProgramCreateSerializer,
    ProgramCRUDSerializer,
    ProgramCollectionSerializer,
    ProgramCollectionCRUDSerializer,
    ApplicationRoundSerializer,
    ApplicationRoundRUDSerializer,
    ApplicationRoundCreateSerializer,
)


class SchoolListView(ListAPIView):
    serializer_class = SchoolSerializer

    def get_queryset(self):
        query_params = self.request.query_params

        return School.filter(
            School.objects.prefetch_related("rankings__ranking"),
            school_type=query_params.get("type"),
        )


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


class ProgramCollectionListView(ListAPIView):
    queryset = ProgramCollection.objects.prefetch_related(
        "created_by",
        "programs__schools",
    )
    serializer_class = ProgramCollectionSerializer


class ProgramCollectionDetailView(RetrieveAPIView):
    queryset = ProgramCollection.objects.all()
    serializer_class = ProgramCollectionSerializer


class ProgramCollectionCreateView(CreateAPIView):
    queryset = ProgramCollection.objects.all()
    serializer_class = ProgramCollectionCRUDSerializer


class ProgramCollectionRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ProgramCollection.objects.all()
    serializer_class = ProgramCollectionCRUDSerializer


class ApplicationRoundListView(ListAPIView):
    serializer_class = ApplicationRoundSerializer

    def get_queryset(self):
        q = ApplicationRound.objects.select_related(
            "program_iteration__program"
        ).prefetch_related(
            "program_iteration__program__schools",
            "applications",
        )

        query_params = self.request.query_params

        return ApplicationRound.filter(
            q,
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
