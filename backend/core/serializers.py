from rest_framework import serializers
from core.models import CFUser, Student, Contract, Service, Application, ApplicationLog
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

        class ServiceSerializer(serializers.ModelSerializer):
            class Meta:
                model = Service
                exclude = ["contract"]

            cf_username = serializers.CharField()

        services = ServiceSerializer(many=True)

    # TODO fetch only the latest for the list
    contracts_sorted = ContractSerializer(many=True)


class StudentCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class ServiceCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class ContractDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    student_name = serializers.CharField()

    class ServiceSerializer(serializers.ModelSerializer):
        class Meta:
            model = Service
            exclude = ["contract"]

        cf_username = serializers.CharField()

    services = ServiceSerializer(many=True)


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

    class ServiceSerializer(serializers.ModelSerializer):
        class Meta:
            model = Service
            fields = ["cf_username", "role"]

    services = ServiceSerializer(many=True)

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["name", "country"]

    schools = SchoolSerializer(many=True)

    class ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            fields = ["display_name"]

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


class ApplicationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "fullname"]

    student = StudentSerializer()

    class ServiceSerializer(serializers.ModelSerializer):
        class Meta:
            model = Service
            fields = ["cf_username", "role"]

    services = ServiceSerializer(many=True)

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name", "country"]

    schools = SchoolSerializer(many=True)

    class ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            fields = ["id", "type", "display_name"]

    program = ProgramSerializer()

    class ProgramIterationSerializer(serializers.ModelSerializer):
        class Meta:
            model = ProgramIteration
            fields = ["id", "year", "term"]

    program_iteration = ProgramIterationSerializer()

    class ApplicationRoundSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationRound
            exclude = ["program_iteration"]

    round = ApplicationRoundSerializer()

    class ApplicationLogSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationLog
            exclude = ["application"]

    logs = ApplicationLogSerializer(many=True)


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "contract", "program", "year", "term", "round_name"]

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
            contract=validated_data["contract"],
            round=application_round,
        )
        return application


class ApplicationRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"


class ApplicationLogCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationLog
        fields = "__all__"
