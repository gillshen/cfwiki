from decimal import Decimal

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

    @classmethod
    def filter(
        cls,
        cfer: int = None,
        contract_type: str = None,
        target_year: int = None,
        contract_status: str = None,
    ):
        q = cls.objects.all().prefetch_related(
            "contracts",
            "contracts__services__cfer",
            "toefl",
            "ielts",
            "duolingo",
            "sat",
            "act",
            "gre",
            "gmat",
            "lsat",
        )

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
    def contracts_sorted(self):
        """
        Return related contracts sorted by

            - `status_code` (effective ones first),
            - `target_year` (descending), and
            - `date` (descending, null last)

        so that the first in the sorted QuerySet will be the latest of
        the effective contract if there are effective contracts, or else
        the latest of the non-effective contracts.
        """
        contracts = self.contracts.annotate(
            status_code=Case(
                When(status=Contract.Status.IN_EFFECT, then=Value(0)),
                default=Value(1),
                output_field=models.IntegerField(),
            ),
            date_code=Case(
                When(date__isnull=True, then=Value(1)),
                default=Value(0),
                output_field=models.IntegerField(),
            ),
        )
        return contracts.order_by(
            "status_code",
            "-target_year",
            "date_code",
            "-date",
        )

    @property
    def latest_contract(self):
        return self.contracts_sorted.first()

    @staticmethod
    def _find_best_score(*, q, total_exp):
        if not q.exists():
            return
        values = q.annotate(v=total_exp).order_by("-v").values("v").first()
        return values["v"]

    @property
    def best_toefl(self):
        return self._find_best_score(
            q=self.toefl,
            total_exp=F("reading") + F("listening") + F("speaking") + F("writing"),
        )

    @property
    def best_ielts(self):
        total = self._find_best_score(
            q=self.ielts,
            total_exp=F("reading") + F("listening") + F("speaking") + F("writing"),
        )
        if total is not None:
            return Decimal(int(total / 2 + Decimal(0.5)) / 2)

    @property
    def best_duolingo(self):
        return self._find_best_score(q=self.duolingo, total_exp=F("overall"))

    @property
    def best_gre(self):
        return self._find_best_score(q=self.gre, total_exp=F("verbal") + F("quant"))

    @property
    def best_gmat(self):
        return self._find_best_score(q=self.gmat, total_exp=F("total"))

    @property
    def best_lsat(self):
        return self._find_best_score(q=self.lsat, total_exp=F("score"))

    @property
    def super_sat(self):
        aggreg: dict = self.sat.aggregate(
            max_ebrw=Max("ebrw"),
            max_math=Max("math"),
        )
        try:
            return sum(aggreg.values())
        except TypeError:
            return

    @property
    def super_act(self):
        aggreg: dict = self.act.aggregate(
            max_math=Max("math"),
            max_science=Max("science"),
            max_english=Max("english"),
            max_reading=Max("reading"),
        )
        try:
            total = sum(aggreg.values())
            return round(Decimal(total / 4) + Decimal(0.1))
        except TypeError:
            return

    @property
    def ap_summary(self):
        return (
            self.ap.filter(score__isnull=False)
            .values("score")
            .annotate(count=Count("score"))
        )

    @property
    def ib_summary(self):
        summary = {
            "predicted": {
                "total": 0,
                "scale": 0,
            },
            "final": {
                "total": 0,
                "scale": 0,
            },
        }

        for ib in self.ib.filter(grade__isnull=False):
            if ib.subject in {"Extended Essay", "Theory of Knowledge"}:
                scale = 3
            else:
                scale = 7
            summary[ib.type]["total"] += ib.grade
            summary[ib.type]["scale"] += scale

        return summary

    @property
    def alevel_summary(self):
        return (
            self.alevel.filter(grade__isnull=False)
            .values("type", "grade")
            .annotate(count=Count("grade"))
        )

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
    def get_stats(cls, **kwargs):
        q = cls.filter(**kwargs)

        stats = {
            "applied": q.count(),
            "pending": 0,
            "accepted": 0,
            "denied": 0,
            "neutral": 0,
        }

        if not stats["applied"]:
            return stats

        stats["pending"] = cls.get_pending(q).count()
        if stats["pending"] == stats["applied"]:
            return stats

        stats["accepted"] = cls.get_accepted(q).count()
        stats["denied"] = cls.get_denied(q).count()
        stats["neutral"] = cls.get_neutral(q).count()

        return stats

    @classmethod
    def filter(
        cls,
        student: int = None,
        cfer: int = None,
        school: int = None,
        program: int = None,
        program_iteration: int = None,
        year: int = None,
        term: str = None,
        application_round: int = None,
        application_type: str = None,
        status: str = None,
    ):
        q = (
            cls.objects.all()
            .select_related(
                "contract",
                "contract__student",
                "round",
                "round__program_iteration",
                "round__program_iteration__program",
            )
            .prefetch_related(
                "contract__services__cfer",
                "contract__student__toefl",
                "contract__student__ielts",
                "contract__student__duolingo",
                "contract__student__sat",
                "contract__student__act",
                "contract__student__gre",
                "contract__student__gmat",
                "contract__student__lsat",
                "round__program_iteration__program__schools",
                "logs",
            )
        )

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
        if term is not None:
            q = q.filter(round__program_iteration__term=term)
        if application_round is not None:
            q = q.filter(round=application_round)
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
            return q.filter(
                round__program_iteration__program__type__in=[
                    "UG Freshman",
                    "UG Transfer",
                ]
            )
        if application_type == "masters":
            return q.filter(round__program_iteration__program__type="Master's")
        if application_type == "doctorate":
            return q.filter(round__program_iteration__program__type="Doctorate")
        if application_type == "graduate":
            return q.filter(
                round__program_iteration__program__type__in=["Master's", "Doctorate"]
            )
        if application_type == "other":
            return q.exclude(
                round__program_iteration__program__type__in=[
                    "UG Freshman",
                    "UG Transfer",
                    "Master's",
                    "Doctorate",
                ]
            )
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
            Q(latest_status="Accepted") | Q(latest_status="Enrolled")
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
    def latest_log(self):
        return self.logs.order_by("-date", "-updated").first()

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

    # For admin display

    @property
    def year(self):
        return self.program_iteration.year

    @property
    def term(self):
        return self.program_iteration.term

    @property
    def round_name(self):
        return self.round.name


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
