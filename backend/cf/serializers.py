from rest_framework import serializers

from cf.models import AcademyProgram
from core.models import Student


class AcademyProgramListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProgram
        fields = "__all__"


class AcademyProgramDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProgram
        fields = "__all__"

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "fullname"]

        fullname = serializers.CharField()

    students = StudentSerializer(many=True)


class AcademyProgramCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyProgram
        fields = "__all__"
