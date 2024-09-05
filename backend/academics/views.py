from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from academics.models import (
    Enrollment,
    Grade,
    TOEFLScore,
    IELTSScore,
    DuolingoScore,
    SATScore,
    ACTScore,
    APScore,
    IBGrade,
    ALevelGrade,
    GREScore,
    GMATScore,
    LSATScore,
)

from academics.serializers import (
    EnrollmentListSerializer,
    EnrollmentDetailSerializer,
    EnrollmentCRUDSerializer,
    GradeCRUDSerializer,
    TOEFLScoreCRUDSerializer,
    IELTSScoreCRUDSerializer,
    DuolingoScoreCRUDSerializer,
    SATScoreCRUDSerializer,
    ACTScoreCRUDSerializer,
    APScoreCRUDSerializer,
    IBGradeCRUDSerializer,
    ALevelGradeCRUDSerializer,
    GREScoreCRUDSerializer,
    GMATScoreCRUDSerializer,
    LSATScoreCRUDSerializer,
)


class EnrollmentListView(ListAPIView):
    serializer_class = EnrollmentListSerializer

    def get_queryset(self):
        query_params = self.request.query_params
        return Enrollment.filter(
            Enrollment.objects.select_related(
                "student",
                "school",
            ).prefetch_related("student__contracts"),
            school=query_params.get("school"),
        )


class EnrollmentDetailView(RetrieveAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentDetailSerializer


class EnrollmentCreateView(CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentCRUDSerializer


class EnrollmentRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentCRUDSerializer


class GradeCreateView(CreateAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeCRUDSerializer


class GradeRUDView(RetrieveUpdateDestroyAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeCRUDSerializer


class TOEFLScoreCreateView(CreateAPIView):
    queryset = TOEFLScore.objects.all()
    serializer_class = TOEFLScoreCRUDSerializer


class TOEFLScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = TOEFLScore.objects.all()
    serializer_class = TOEFLScoreCRUDSerializer


class IELTSScoreCreateView(CreateAPIView):
    queryset = IELTSScore.objects.all()
    serializer_class = IELTSScoreCRUDSerializer


class IELTSScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = IELTSScore.objects.all()
    serializer_class = IELTSScoreCRUDSerializer


class DuolingoScoreCreateView(CreateAPIView):
    queryset = DuolingoScore.objects.all()
    serializer_class = DuolingoScoreCRUDSerializer


class DuolingoScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = DuolingoScore.objects.all()
    serializer_class = DuolingoScoreCRUDSerializer


class SATScoreCreateView(CreateAPIView):
    queryset = SATScore.objects.all()
    serializer_class = SATScoreCRUDSerializer


class SATScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = SATScore.objects.all()
    serializer_class = SATScoreCRUDSerializer


class ACTScoreCreateView(CreateAPIView):
    queryset = ACTScore.objects.all()
    serializer_class = ACTScoreCRUDSerializer


class ACTScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ACTScore.objects.all()
    serializer_class = ACTScoreCRUDSerializer


class APScoreCreateView(CreateAPIView):
    queryset = APScore.objects.all()
    serializer_class = APScoreCRUDSerializer


class APScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = APScore.objects.all()
    serializer_class = APScoreCRUDSerializer


class IBGradeCreateView(CreateAPIView):
    queryset = IBGrade.objects.all()
    serializer_class = IBGradeCRUDSerializer


class IBGradeRUDView(RetrieveUpdateDestroyAPIView):
    queryset = IBGrade.objects.all()
    serializer_class = IBGradeCRUDSerializer


class ALevelGradeCreateView(CreateAPIView):
    queryset = ALevelGrade.objects.all()
    serializer_class = ALevelGradeCRUDSerializer


class ALevelGradeRUDView(RetrieveUpdateDestroyAPIView):
    queryset = ALevelGrade.objects.all()
    serializer_class = ALevelGradeCRUDSerializer


class GREScoreCreateView(CreateAPIView):
    queryset = GREScore.objects.all()
    serializer_class = GREScoreCRUDSerializer


class GREScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = GREScore.objects.all()
    serializer_class = GREScoreCRUDSerializer


class GMATScoreCreateView(CreateAPIView):
    queryset = GMATScore.objects.all()
    serializer_class = GMATScoreCRUDSerializer


class GMATScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = GMATScore.objects.all()
    serializer_class = GMATScoreCRUDSerializer


class LSATScoreCreateView(CreateAPIView):
    queryset = LSATScore.objects.all()
    serializer_class = LSATScoreCRUDSerializer


class LSATScoreRUDView(RetrieveUpdateDestroyAPIView):
    queryset = LSATScore.objects.all()
    serializer_class = LSATScoreCRUDSerializer
