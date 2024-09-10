from rest_framework import serializers

from cf.models import AcademyProduct


class AcademyProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProduct
        fields = "__all__"


class AcademyProductCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProduct
        fields = "__all__"
