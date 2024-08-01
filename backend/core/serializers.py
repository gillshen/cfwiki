from rest_framework import serializers
from core.models import CFUser, Student, Contract, Application, ApplicationLog
from target.models import School, Program, ProgramIteration, ApplicationRound


class CFUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CFUser
        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "department",
            "public_banner",
            "private_banner",
        ]


class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()

    class ContractSerializer(serializers.ModelSerializer):
        class Meta:
            model = Contract
            exclude = ["student"]

    # TODO fetch only the latest for the list
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
            fields = ["fullname", "gender", "citizenship"]

    student = StudentSerializer()

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["name", "country"]

    schools = SchoolSerializer(many=True)

    class ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            fields = ["display_name"]

        display_name = serializers.CharField()

    program = ProgramSerializer()

    class ProgramIterationSerializer(serializers.ModelSerializer):
        class Meta:
            model = ProgramIteration
            fields = ["year", "term"]

    program_iteration = ProgramIterationSerializer()

    class ApplicationRoundSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationRound
            fields = ["name", "due_date"]

    round = ApplicationRoundSerializer()

    class ApplicationLogSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationLog
            fields = ["status", "date"]

    latest_log = ApplicationLogSerializer()


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "student", "program", "year", "term", "round_name"]

    program = serializers.IntegerField(write_only=True)
    year = serializers.IntegerField(write_only=True)
    term = serializers.CharField(write_only=True)
    round_name = serializers.CharField(write_only=True)

    def create(self, validated_data):
        program = Program.objects.get(id=validated_data["program"])
        program_iteration, _ = ProgramIteration.objects.get_or_create(
            program=program,
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
