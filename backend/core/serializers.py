from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from core.models import CFUser, Student, Contract, Service, Application, ApplicationLog

from target.models import School, Program, ProgramIteration, ApplicationRound
import academics.serializers


class CFUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CFUser
        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "is_staff",
            "department",
            "public_banner",
            "private_banner",
        ]


class CFUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CFUser
        fields = ["public_banner"]


class CFUserPasswordResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CFUser
        fields = ["password"]

    password = serializers.CharField(write_only=True, required=True)

    def update(self, instance, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        return instance


# for nesting within student list and detail serializers
class ContractByStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    class ServiceSerializer(serializers.ModelSerializer):
        class Meta:
            model = Service
            exclude = ["contract"]

        cf_username = serializers.CharField()

    services = ServiceSerializer(many=True)


class StudentListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    latest_contract = ContractByStudentSerializer()
    scores = serializers.SerializerMethodField()
    ap_summary = serializers.SerializerMethodField()
    ib_summary = serializers.SerializerMethodField()
    alevel_summary = serializers.SerializerMethodField()

    def get_scores(self, instance):
        return instance.scores

    def get_ap_summary(self, instance):
        return instance.ap_summary

    def get_ib_summary(self, instance):
        return instance.ib_summary

    def get_alevel_summary(self, instance):
        return instance.alevel_summary


class StudentByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    contracts_sorted = ContractByStudentSerializer(many=True)


class StudentDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    contracts_sorted = ContractByStudentSerializer(many=True)

    enrollments = academics.serializers.EnrollmentByStudentSerializer(many=True)
    toefl = academics.serializers.TOEFLScoreCRUDSerializer(many=True)
    ielts = academics.serializers.IELTSScoreCRUDSerializer(many=True)
    duolingo = academics.serializers.DuolingoScoreCRUDSerializer(many=True)
    sat = academics.serializers.SATScoreCRUDSerializer(many=True)
    act = academics.serializers.ACTScoreCRUDSerializer(many=True)
    ap = academics.serializers.APScoreCRUDSerializer(many=True)
    ib = academics.serializers.IBGradeCRUDSerializer(many=True)
    alevel = academics.serializers.ALevelGradeCRUDSerializer(many=True)
    gre = academics.serializers.GREScoreCRUDSerializer(many=True)
    gmat = academics.serializers.GMATScoreCRUDSerializer(many=True)
    lsat = academics.serializers.LSATScoreCRUDSerializer(many=True)


class StudentStaffListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["staff_names"]

    staff_names = serializers.ListField()


class StudentCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class ServiceCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise ValidationError({"detail": "Service already exists"})


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

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise ValidationError({"detail": "Contract already exists"})


class ApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        exclude = ["major_1", "major_2", "major_3", "track", "comments"]

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = [
                "id",
                "fullname",
                "gender",
                "citizenship",
                "scores",
                "ap_summary",
                "ib_summary",
                "alevel_summary",
            ]

        scores = serializers.SerializerMethodField()
        ap_summary = serializers.SerializerMethodField()
        ib_summary = serializers.SerializerMethodField()
        alevel_summary = serializers.SerializerMethodField()

        def get_scores(self, instance):
            return instance.scores

        def get_ap_summary(self, instance):
            return instance.ap_summary

        def get_ib_summary(self, instance):
            return instance.ib_summary

        def get_alevel_summary(self, instance):
            return instance.alevel_summary

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
            fields = ["type", "display_name"]

    program = ProgramSerializer()
    year = serializers.IntegerField()
    term = serializers.CharField()
    round_name = serializers.CharField()
    due_date = serializers.DateField()
    l_status = serializers.CharField()
    l_status_date = serializers.DateField()
    majors_or_track = serializers.CharField()


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


class ApplicationCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"


class ApplicationLogCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationLog
        fields = "__all__"
