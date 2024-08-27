from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from target.models import (
    School,
    ProgramGroup,
    Program,
    ProgramIteration,
    ApplicationRound,
)


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class SchoolStatsSerializer(SchoolSerializer):
    application_stats = serializers.SerializerMethodField()

    def get_application_stats(self, obj):
        return obj.application_stats


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


class ProgramStatsSerializer(ProgramSerializer):
    application_stats = serializers.SerializerMethodField()

    def get_application_stats(self, obj):
        return obj.application_stats


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


class ProgramGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramGroup
        fields = "__all__"

    programs = ProgramSerializer(many=True)


class ApplicationRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationRound
        fields = "__all__"

    class ProgramIterationSerializer(serializers.ModelSerializer):
        class Meta:
            model = ProgramIteration
            fields = "__all__"

    program_iteration = ProgramIterationSerializer()


class ApplicationRoundCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationRound
        fields = [
            "program",
            "year",
            "term",
            "name",
            "due_date",
            "due_time",
            "timezone",
            "decision_date",
        ]

    program = serializers.IntegerField(write_only=True)
    year = serializers.IntegerField(write_only=True)
    term = serializers.CharField(write_only=True)

    def create(self, validated_data):
        program = Program.objects.get(id=validated_data["program"])
        program_iteration, _ = ProgramIteration.objects.get_or_create(
            program=program,
            year=validated_data["year"],
            term=validated_data["term"],
        )
        try:
            application_round = ApplicationRound.objects.create(
                program_iteration=program_iteration,
                name=validated_data["name"],
                due_date=validated_data["due_date"],
                due_time=validated_data["due_time"],
                timezone=validated_data["timezone"],
                decision_date=validated_data["decision_date"],
            )
        except IntegrityError:
            raise ValidationError({"detail": "Application round already exists"})

        return application_round


class ApplicationRoundRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationRound
        fields = "__all__"
