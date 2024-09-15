from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError

from target.models import (
    School,
    ProgramCollection,
    Program,
    ProgramIteration,
    ApplicationRound,
    SchoolRanking,
    SchoolRankingEntry,
)


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"

    class RankingEntrySerializer(serializers.ModelSerializer):
        class Meta:
            model = SchoolRankingEntry
            fields = ["ranking_name", "year", "rank"]

        ranking_name = serializers.SerializerMethodField()
        year = serializers.SerializerMethodField()

        def get_ranking_name(self, ranking_entry):
            return ranking_entry.ranking.name

        def get_year(self, ranking_entry):
            return ranking_entry.ranking.year

    rankings = RankingEntrySerializer(many=True)


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


class ProgramCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramCollection
        fields = "__all__"

    programs = ProgramSerializer(many=True)
    creator_name = serializers.SerializerMethodField()

    def get_creator_name(self, obj):
        return obj.created_by.username


class ProgramCollectionCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramCollection
        fields = "__all__"

    def create(self, validated_data):
        # Prevent duplication of names already used by public collections
        name = self.validated_data.get("name")
        if ProgramCollection.objects.filter(is_public=True, name=name).exists():
            raise IntegrityError(f"Name already taken by a public collection: {name!r}")

        programs = validated_data.pop("programs", [])
        collection = ProgramCollection.objects.create(**validated_data)
        collection.programs.set(programs)
        return collection

    def update(self, instance, validated_data):
        # Prevent duplication of names already used by public collections
        name = self.validated_data.get("name")
        if (
            ProgramCollection.objects.exclude(id=instance.id)
            .filter(is_public=True, name=name)
            .exists()
        ):
            raise IntegrityError(f"Name already taken by a public collection: {name!r}")

        programs = validated_data.pop("programs", [])
        super().update(instance, validated_data)
        instance.programs.set(programs)
        return instance


class ApplicationRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationRound
        fields = "__all__"

    class ProgramIterationSerializer(serializers.ModelSerializer):
        class Meta:
            model = ProgramIteration
            fields = "__all__"

    program_iteration = ProgramIterationSerializer()
    applications_count = serializers.IntegerField()


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


class SchoolRankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolRanking
        fields = "__all__"


class SchoolRankingCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolRanking
        fields = "__all__"


class SchoolRankingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolRankingEntry
        fields = "__all__"

    class RankingSerializer(serializers.ModelSerializer):
        class Meta:
            model = SchoolRanking
            fields = ["id", "name", "year"]

    ranking = RankingSerializer()

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name"]

    school = SchoolSerializer()


class SchoolRankingEntryCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolRankingEntry
        fields = "__all__"
