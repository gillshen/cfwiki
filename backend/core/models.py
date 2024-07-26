from django.db import models
from django.db.models import Case, When, Value
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from .managers import CFUserManager


class CFUser(AbstractUser):
    # Additional fields
    department = models.CharField(max_length=100)
    public_banner = models.CharField(max_length=100, blank=True)
    private_banner = models.CharField(max_length=100, blank=True)

    objects = CFUserManager()

    def __str__(self):
        return self.username


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
