from rest_framework import serializers

from cf.models import AcademyProduct
from core.models import Student


class AcademyProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProduct
        fields = "__all__"


class AcademyProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProduct
        fields = "__all__"

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "fullname"]

        fullname = serializers.CharField()

    students = StudentSerializer(many=True)


class AcademyProductCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProduct
        fields = "__all__"
