from django.db import models
from django.db.models import Case, When, Value
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

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "contract",
                "round",
                name="application_unique_contract_round",
            )
        ]

    def __str__(self) -> str:
        return f"{self.contract} > {self.round}"

    @classmethod
    def filter(
        cls,
        student: int = None,
        school: int = None,
        program: int = None,
        program_iteration: int = None,
        application_round: int = None,
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
                "round__program_iteration__program__schools",
                "logs",
            )
        )

        if student is not None:
            q = q.filter(contract__student=student)
        if school is not None:
            q = q.filter(round__program_iteration__program__schools=school)
        if program is not None:
            q = q.filter(round__program_iteration__program=program)
        if program_iteration is not None:
            q = q.filter(round__program_iteration=program_iteration)
        if application_round is not None:
            q = q.filter(round=application_round)

        return q

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

    # useful for the serializer with custom creation logic

    @property
    def program_id(self):
        return self.program.id

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
