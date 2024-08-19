from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from target.models import School, Program, ApplicationRound


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class SchoolCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise ValidationError({"detail": "School already exists"})


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name", "alt_name"]

    schools = SchoolSerializer(many=True)
    display_name = serializers.CharField()


class ProgramCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ["id", "type", "name", "degree", "school_1", "school_2"]

    school_1 = serializers.IntegerField(write_only=True, required=True)
    school_2 = serializers.IntegerField(write_only=True)

    def create(self, validated_data):
        school_1 = validated_data.pop("school_1")
        school_2 = validated_data.pop("school_2")
        program = Program.objects.create(**validated_data)
        program.schools.add(school_1)
        if school_2:
            program.schools.add(school_2)
        return program


class ProgramCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"


class ApplicationRoundCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationRound
        fields = "__all__"
