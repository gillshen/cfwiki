from rest_framework import serializers
from core.models import Student, Contract, Application
from target.models import School, Program, ProgramIteration, ApplicationRound


class StudentSerializer(serializers.ModelSerializer):
    class ContractSerializer(serializers.ModelSerializer):
        class Meta:
            model = Contract
            exclude = ["student"]

    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    contracts_sorted = ContractSerializer(many=True)


class StudentCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    student_name = serializers.CharField()


class ContractCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"


class ApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "fullname", "gender", "citizenship"]

    student = StudentSerializer()

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name", "alt_name", "country"]

    schools = SchoolSerializer(many=True)

    class ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            fields = ["id", "display_name"]

        display_name = serializers.CharField()

    program = ProgramSerializer()

    class ProgramIterationSerializer(serializers.ModelSerializer):
        class Meta:
            model = ProgramIteration
            exclude = ["program"]

    program_iteration = ProgramIterationSerializer()

    class ApplicationRoundSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationRound
            exclude = ["program_iteration"]

    round = ApplicationRoundSerializer()


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "student", "program_id", "year", "term", "round_name"]

    program_id = serializers.IntegerField()
    year = serializers.IntegerField()
    term = serializers.CharField()
    round_name = serializers.CharField()

    def create(self, validated_data):
        program_iteration, _ = ProgramIteration.objects.get_or_create(
            program=validated_data["program_id"],
            year=validated_data["year"],
            term=validated_data["term"],
        )
        application_round, _ = ApplicationRound.objects.get_or_create(
            program_iteration=program_iteration,
            name=validated_data["round_name"],
        )
        application = Application.objects.create(
            student=validated_data["student"],
            round=application_round,
        )
        return application


class ApplicationRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"
