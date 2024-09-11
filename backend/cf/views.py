from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from cf.models import AcademyProduct

from cf.serializers import (
    AcademyProductListSerializer,
    AcademyProductDetailSerializer,
    AcademyProductCRUDSerializer,
)


class AcademyProductListView(ListAPIView):
    queryset = AcademyProduct.objects.all()
    serializer_class = AcademyProductListSerializer


class AcademyProductDetailView(RetrieveAPIView):
    queryset = AcademyProduct.objects.prefetch_related("students")
    serializer_class = AcademyProductDetailSerializer


class AcademyProductCreateView(CreateAPIView):
    queryset = AcademyProduct.objects.all()
    serializer_class = AcademyProductCRUDSerializer


class AcademyProductRUDView(RetrieveUpdateDestroyAPIView):
    queryset = AcademyProduct.objects.all()
    serializer_class = AcademyProductCRUDSerializer
