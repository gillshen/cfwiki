from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from cf.models import AcademyProduct
from cf.serializers import AcademyProductListSerializer, AcademyProductCRUDSerializer


class AcademyProductListView(ListAPIView):
    queryset = AcademyProduct.objects.all()
    serializer_class = AcademyProductListSerializer


class AcademyProductCreateView(CreateAPIView):
    queryset = AcademyProduct.objects.all()
    serializer_class = AcademyProductCRUDSerializer


class AcademyProductRUDView(RetrieveUpdateDestroyAPIView):
    queryset = AcademyProduct.objects.all()
    serializer_class = AcademyProductCRUDSerializer
