from decimal import Decimal
from collections import defaultdict

from django.db import models
from django.db.models import Case, When, Value, OuterRef, Subquery, Q, F, Max, Count
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from .managers import CFUserManager
from target.models import ApplicationRound


class CFUser(AbstractUser):
    # Additional fields
    department = models.CharField(max_length=100)
    public_banner = models.CharField(max_length=100, blank=True)
    private_banner = models.CharField(max_length=100, blank=True)

    objects = CFUserManager()

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.email:
            raise ValueError(_("Email address required"))

        self.email = self.__class__.objects.normalize_email(self.email)

        if not self.email.endswith("@choicefree.com.cn"):
            raise ValueError(_("Email address not permitted"))

        super().save(*args, **kwargs)


class Student(models.Model):
    surname = models.CharField(max_length=100)
    given_name = models.CharField(max_length=100)
    surname_first = models.BooleanField(default=True)
    preferred_name = models.CharField(max_length=50, blank=True)

    gender = models.CharField(max_length=20)
    citizenship = models.CharField(max_length=100)
    date_of_birth = models.DateField(blank=True, null=True)

    base_country = models.CharField(max_length=100)
    base_subnational = models.CharField(max_length=50, blank=True)
    base_city = models.CharField(max_length=100, blank=True)

    comments = models.TextField(max_length=5000, blank=True)

    def __str__(self) -> str:
        return self.fullname

    @staticmethod
    def filter(
        q,
        cfer: int = None,
        contract_type: str = None,
        target_year: int = None,
        contract_status: str = None,
    ):
        if cfer is not None:
            q = q.filter(contracts__services__cfer=cfer)

        if contract_type is not None and target_year is not None:
            q = q.filter(
                contracts__type=contract_type,
                contracts__target_year=target_year,
            )
        if contract_type is not None:
            q = q.filter(contracts__type=contract_type)
        if target_year is not None:
            q = q.filter(contracts__target_year=target_year)

        if contract_status is not None:
            q = q.filter(contracts__status=contract_status)

        return q.distinct()

    @property
    def fullname(self):
        if self.surname_first:
            return f"{self.surname}{self.given_name}"
        else:
            return f"{self.given_name} {self.surname}"

    @property
    def staff_names(self) -> list[str]:
        q = Service.objects.filter(contract__student=self)
        names = q.values_list("cfer_id__username").distinct()
        return [item[0] for item in names]


class Contract(models.Model):

    class Status(models.TextChoices):
        IN_EFFECT = "In effect", _("In effect")
        FULFILED = "Fulfilled", _("Fulfilled")
        TERMINATED = "Terminated", _("Terminated")

    student = models.ForeignKey(
        Student,
        related_name="contracts",
        on_delete=models.CASCADE,
    )
    type = models.CharField(max_length=100)
    target_year = models.IntegerField()
    date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=Status.choices)
    student_progression_when_signed = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = [
            # Contracts in effect before those not in effect
            # Otherwise order by target year desc, then by date desc
            # Order null dates as prior to non-null dates
            Case(
                When(status="In effect", then=Value(0)),
                default=Value(1),
                output_field=models.IntegerField(),
            ),
            "-target_year",
            Case(
                When(date__isnull=True, then=Value(1)),
                default=Value(0),
                output_field=models.IntegerField(),
            ),
            "-date",
        ]

        constraints = [
            models.UniqueConstraint(
                "student",
                "type",
                "target_year",
                name="contract_unique_student_type_targetyear",
            )
        ]

    def __str__(self) -> str:
        return f"{self.student} >> {self.type}"

    @property
    def student_name(self) -> str:
        return self.student.fullname


class Service(models.Model):

    contract = models.ForeignKey(
        Contract,
        related_name="services",
        on_delete=models.CASCADE,
    )
    cfer = models.ForeignKey(
        CFUser,
        related_name="services",
        on_delete=models.CASCADE,
    )
    role = models.CharField(max_length=50)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "contract",
                "cfer",
                "role",
                name="service_unique_contract_cfer_role",
            )
        ]

    def __str__(self) -> str:
        return f"{self.contract} | {self.role} {self.cfer}"

    @property
    def cf_username(self) -> str:
        return self.cfer.username


class Application(models.Model):

    contract = models.ForeignKey(
        Contract,
        related_name="applications",
        on_delete=models.CASCADE,
    )
    round = models.ForeignKey(
        ApplicationRound,
        related_name="applications",
        on_delete=models.CASCADE,
    )

    # Undergraduate majors
    major_1 = models.CharField(max_length=100, blank=True)
    major_2 = models.CharField(max_length=100, blank=True)
    major_3 = models.CharField(max_length=100, blank=True)

    # Track/concentration/pathway/certificate of a graduate program
    track = models.CharField(max_length=100, blank=True)

    comments = models.CharField(max_length=1000, blank=True)
    double_application = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "contract",
                "round",
                name="application_unique_contract_round",
                condition=Q(double_application=False),
            )
        ]

    def __str__(self) -> str:
        return f"{self.contract} > {self.round}"

    @classmethod
    def filter(
        cls,
        q,
        student: int = None,
        cfer: int = None,
        school: int = None,
        program: int = None,
        program_iteration: int = None,
        year: int = None,
        application_type: str = None,
        status: str = None,
    ):
        if student is not None:
            q = q.filter(contract__student=student)
        if cfer is not None:
            q = q.filter(contract__services__cfer=cfer)
        if school is not None:
            q = q.filter(round__program_iteration__program__schools=school)
        if program is not None:
            q = q.filter(round__program_iteration__program=program)
        if program_iteration is not None:
            q = q.filter(round__program_iteration=program_iteration)
        if year is not None:
            q = q.filter(round__program_iteration__year=year)
        if application_type is not None:
            q = cls.filter_by_type(q, application_type)
        if status is not None:
            q = cls.filter_by_status(q, status)

        return q.distinct()

    @staticmethod
    def filter_by_type(q, application_type: str):
        if application_type == "freshman":
            return q.filter(round__program_iteration__program__type="UG Freshman")
        if application_type == "transfer":
            return q.filter(round__program_iteration__program__type="UG Transfer")
        if application_type == "undergraduate":
            ug_types = ["UG Freshman", "UG Transfer"]
            return q.filter(round__program_iteration__program__type__in=ug_types)
        if application_type == "masters":
            return q.filter(round__program_iteration__program__type="Master's")
        if application_type == "doctorate":
            return q.filter(round__program_iteration__program__type="Doctorate")
        if application_type == "graduate":
            grad_types = ["Master's", "Doctorate"]
            return q.filter(round__program_iteration__program__type__in=grad_types)
        if application_type in {"nondegree", "other"}:
            return q.filter(round__program_iteration__program__type="Non-degree")
        return q

    @classmethod
    def filter_by_status(cls, q, status):
        if status == "pending":
            return cls.get_pending(q)
        if status == "resolved":
            return cls.get_resolved(q)
        if status == "accepted":
            return cls.get_accepted(q)
        if status == "denied":
            return cls.get_denied(q)
        if status == "neutral":
            return cls.get_neutral(q)
        return q

    @staticmethod
    def _annotate_with_latest_status(queryset):
        latest_status_subquery = ApplicationLog.objects.filter(
            application=OuterRef("pk")
        ).order_by("-date", "-updated")

        return queryset.annotate(
            latest_status=Subquery(latest_status_subquery.values("status")[:1])
        )

    @classmethod
    def get_pending(cls, queryset):
        return cls._annotate_with_latest_status(queryset).filter(
            Q(latest_status__isnull=True)
            | Q(latest_status="Started")
            | Q(latest_status="Submitted")
            | Q(latest_status="Under Review")
            | Q(latest_status="Deferred")
            | Q(latest_status="On Waitlist")
        )

    @classmethod
    def get_resolved(cls, queryset):
        return cls._annotate_with_latest_status(queryset).exclude(
            Q(latest_status__isnull=True)
            | Q(latest_status="Started")
            | Q(latest_status="Submitted")
            | Q(latest_status="Under Review")
            | Q(latest_status="Deferred")
            | Q(latest_status="On Waitlist")
        )

    @classmethod
    def get_accepted(cls, queryset):
        return cls._annotate_with_latest_status(queryset).filter(
            latest_status="Accepted"
        )

    @classmethod
    def get_denied(cls, queryset):
        return cls._annotate_with_latest_status(queryset).filter(
            Q(latest_status="Rejected")
            | Q(latest_status="Pres. Rejected")
            | Q(latest_status="Offer Rescinded")
        )

    @classmethod
    def get_neutral(cls, queryset):
        return cls._annotate_with_latest_status(queryset).filter(
            Q(latest_status="Cancelled")
            | Q(latest_status="Withdrawn")
            | Q(latest_status="Untracked")
        )

    @property
    def student(self) -> Student:
        return self.contract.student

    @property
    def services(self) -> list[Service]:
        return self.contract.services

    @property
    def schools(self):
        return self.round.program_iteration.program.schools

    @property
    def program(self):
        return self.round.program_iteration.program

    @property
    def program_iteration(self):
        return self.round.program_iteration

    @property
    def majors(self):
        return " | ".join(filter(None, [self.major_1, self.major_2, self.major_3]))

    @property
    def majors_or_track(self):
        return self.track or self.majors

    @property
    def year(self):
        return self.program_iteration.year

    @property
    def term(self):
        return self.program_iteration.term

    @property
    def round_name(self):
        return self.round.name

    @property
    def due_date(self):
        return self.round.due_date


class ApplicationLog(models.Model):
    application = models.ForeignKey(
        Application,
        related_name="logs",
        on_delete=models.CASCADE,
    )
    date = models.DateField()
    status = models.CharField(max_length=50)
    comments = models.TextField(max_length=1000, blank=True)
    updated = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.status} ({self.date}) | {self.application}"
