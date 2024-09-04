from collections import defaultdict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from core.models import CFUser, Student, Contract, Service, Application, ApplicationLog

from target.models import School, Program, ProgramIteration, ApplicationRound
import academics.models
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


# for nesting within StudentPerUserSerializer and StudentDetailSerializer
class ContractPerStudentSerializer(serializers.ModelSerializer):
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

    class ContractSerializer(serializers.ModelSerializer):
        class Meta:
            model = Contract
            fields = ["type", "target_year", "status", "services"]

        class ServiceSerializer(serializers.ModelSerializer):
            class Meta:
                model = Service
                fields = ["cf_username", "role"]

        services = ServiceSerializer(many=True)

    contracts = ContractSerializer(many=True)

    scores = serializers.SerializerMethodField()
    ap_summary = serializers.SerializerMethodField()
    ib_summary = serializers.SerializerMethodField()
    alevel_summary = serializers.SerializerMethodField()

    def get_scores(self, student):
        scores = {}

        def get_max(lst):
            return max(filter(None, lst), default=None)

        scores["best_toefl"] = get_max([s.total for s in student.toefl.all()])
        scores["best_ielts"] = get_max([s.overall for s in student.ielts.all()])
        scores["best_duolingo"] = get_max([s.overall for s in student.duolingo.all()])

        best_sat_subscores = [
            get_max([s.ebrw for s in student.sat.all()]),
            get_max([s.math for s in student.sat.all()]),
        ]
        try:
            scores["super_sat"] = sum(best_sat_subscores)
        except TypeError:
            pass

        best_act_subscores = [
            get_max([s.math for s in student.act.all()]),
            get_max([s.science for s in student.act.all()]),
            get_max([s.english for s in student.act.all()]),
            get_max([s.reading for s in student.act.all()]),
        ]
        try:
            act_total = sum(best_act_subscores)
            scores["super_act"] = round((act_total / 4) + 0.1)
        except TypeError:
            pass

        scores["best_gre"] = get_max([s.total for s in student.gre.all()])
        scores["best_gmat"] = get_max([s.total for s in student.gmat.all()])
        scores["best_lsat"] = get_max([s.score for s in student.lsat.all()])

        scores = {k: v for (k, v) in scores.items() if v is not None}
        return scores

    def get_ap_summary(self, student):
        summary = defaultdict(int)
        for score in filter(None, [s.score for s in student.ap.all()]):
            summary[score] += 1
        return summary

    def get_ib_summary(self, student):
        summary = defaultdict(lambda: defaultdict(int))

        for ib in student.ib.all():
            if ib.grade is None:
                continue
            if ib.subject in {"Extended Essay", "Theory of Knowledge"}:
                scale = 3
            else:
                scale = 7
            summary[ib.type]["total"] += ib.grade
            summary[ib.type]["scale"] += scale

        return summary

    def get_alevel_summary(self, student):
        summary = defaultdict(lambda: defaultdict(int))
        for alevel in [a for a in student.alevel.all() if a.grade is not None]:
            summary[alevel.type][alevel.grade] += 1
        return summary


class StudentPerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    contracts = ContractPerStudentSerializer(many=True)


class StudentDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    contracts = ContractPerStudentSerializer(many=True)

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
        exclude = [
            "contract",
            "round",
            "major_1",
            "major_2",
            "major_3",
            "track",
            "double_application",
            "comments",
        ]

    class StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id"]

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
    latest_log = serializers.SerializerMethodField()
    majors_or_track = serializers.CharField()

    def get_latest_log(self, application):
        logs = list(application.logs.all())
        if not logs:
            return
        ordered = sorted(logs, key=lambda log: (log.date, log.updated), reverse=True)
        latest_log = ordered[0]
        return {
            "status": latest_log.status,
            "date": latest_log.date,
        }


# for use in conjunction with ApplicationListSerializer
class ApplicantListSerializer(StudentListSerializer):
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


class ApplicationPerProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["program_id", "applied", "pending", "accepted", "denied", "neutral"]

    program_id = serializers.IntegerField()
    applied = serializers.IntegerField()
    pending = serializers.IntegerField()
    accepted = serializers.IntegerField()
    denied = serializers.IntegerField()
    neutral = serializers.IntegerField()


class ApplicationPerSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "school_id",
            "ug_applied",
            "ug_pending",
            "ug_accepted",
            "ug_denied",
            "ug_neutral",
            "grad_applied",
            "grad_pending",
            "grad_accepted",
            "grad_denied",
            "grad_neutral",
        ]

    school_id = serializers.IntegerField()

    ug_applied = serializers.IntegerField()
    ug_pending = serializers.IntegerField()
    ug_accepted = serializers.IntegerField()
    ug_denied = serializers.IntegerField()
    ug_neutral = serializers.IntegerField()

    grad_applied = serializers.IntegerField()
    grad_pending = serializers.IntegerField()
    grad_accepted = serializers.IntegerField()
    grad_denied = serializers.IntegerField()
    grad_neutral = serializers.IntegerField()


class ApplicationLogCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationLog
        fields = "__all__"
