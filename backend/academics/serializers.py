from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError

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

from core.models import Student, Contract
from target.models import School


class EnrollmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "fullname", "gender", "citizenship", "contracts"]

        fullname = serializers.CharField()

        class ContractByStudentSerializer(serializers.ModelSerializer):
            class Meta:
                model = Contract
                fields = ["status"]

        contracts = ContractByStudentSerializer(many=True)

    student = StudentSerializer()

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = "__all__"

    school = SchoolSerializer()


# for nesting within the student detail serializer
class EnrollmentByStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = "__all__"

    school = SchoolSerializer()

    class GradeSerializer(serializers.ModelSerializer):
        class Meta:
            model = Grade
            fields = "__all__"

    grades = GradeSerializer(many=True)


class EnrollmentDetailSerializer(EnrollmentByStudentSerializer):
    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "fullname"]

        fullname = serializers.CharField()

    student = StudentSerializer()


class EnrollmentCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise ValidationError({"detail": "Educational experience already exists"})


class GradeCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"


class TOEFLScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = TOEFLScore
        fields = "__all__"


class IELTSScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = IELTSScore
        fields = "__all__"


class DuolingoScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = DuolingoScore
        fields = "__all__"


class SATScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = SATScore
        fields = "__all__"


class ACTScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ACTScore
        fields = "__all__"


class APScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = APScore
        fields = "__all__"


class IBGradeCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = IBGrade
        fields = "__all__"


class ALevelGradeCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ALevelGrade
        fields = "__all__"


class GREScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GREScore
        fields = "__all__"


class GMATScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GMATScore
        fields = "__all__"


class LSATScoreCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = LSATScore
        fields = "__all__"
