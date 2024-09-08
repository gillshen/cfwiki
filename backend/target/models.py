from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.functions import Lower
from django.core.exceptions import ValidationError


class School(models.Model):

    class Type(models.TextChoices):
        UNIVERSITY = "University", _("University")
        SECONDARY = "Secondary School", _("Secondary School")
        OTHER = "Other", _("Other")

    name = models.CharField(max_length=100)
    alt_name = models.CharField(max_length=20, blank=True)
    type = models.CharField(max_length=50, choices=Type.choices)
    country = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                name="school_unique_name",
            ),
            models.UniqueConstraint(
                Lower("alt_name"),
                name="school_unique_altname",
                condition=~models.Q(alt_name=""),
            ),
        ]

    def __str__(self) -> str:
        return self.name

    @classmethod
    def filter(cls, q, school_type: str = None):
        if school_type == "university":
            q = q.filter(type=School.Type.UNIVERSITY)
        elif school_type == "secondary-school":
            q = q.filter(type=School.Type.SECONDARY)
        elif school_type == "other":
            q = q.filter(type=School.Type.OTHER)
        return q


class Program(models.Model):
    # It would be nice to have a unique constraint at the database level
    # but this is not possible because `schools` is a many-to-many field
    # and consequently not allowed in constraints.
    # We have to rely on serializers to ensure program uniqueness.
    type = models.CharField(max_length=50)
    schools = models.ManyToManyField(School, related_name="programs")
    name = models.CharField(max_length=100, blank=True)
    degree = models.CharField(max_length=100, blank=True)
    is_defunct = models.BooleanField(default=False)

    def __str__(self) -> str:
        school_names = " + ".join(s.name for s in self.schools.all())
        return f"{school_names} | {self.display_name}".strip()

    @classmethod
    def filter(cls, q, school: int = None, program_type: str = None):
        if school is not None:
            q = q.filter(schools=school)

        if program_type == "undergraduate":
            q = q.filter(type__in=["UG Freshman", "UG Transfer"])
        elif program_type == "freshman":
            q = q.filter(type="UG Freshman")
        elif program_type == "transfer":
            q = q.filter(type="UG Transfer")
        elif program_type == "graduate":
            q = q.filter(type__in=["Master's", "Doctorate"])
        elif program_type in {"nondegree", "other"}:
            q = q.filter(type="Non-degree")

        return q

    @property
    def display_name(self) -> str:
        return f"{self.name or self.type}, {self.degree}".strip(", ")


class ProgramCollection(models.Model):
    name = models.CharField(max_length=100)
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(to="core.CFUser", on_delete=models.CASCADE)
    programs = models.ManyToManyField(Program, related_name="collections", blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                condition=models.Q(is_public=True),
                name="programcollection_public_unique_name",
            ),
            models.UniqueConstraint(
                Lower("name"),
                "created_by",
                condition=models.Q(is_public=False),
                name="programcollection_private_unique_name_createdby",
            ),
        ]

    def __str__(self) -> str:
        return self.name


class ProgramIteration(models.Model):

    program = models.ForeignKey(
        Program,
        related_name="iterations",
        on_delete=models.CASCADE,
    )
    year = models.IntegerField()
    term = models.CharField(max_length=20)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "program",
                "year",
                Lower("term"),
                name="programiteration_unique_program_year_term",
            )
        ]

    def __str__(self) -> str:
        return f"{self.program} ({self.term} {self.year})"


class ApplicationRound(models.Model):

    program_iteration = models.ForeignKey(
        ProgramIteration,
        related_name="application_rounds",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=50)
    due_date = models.DateField(blank=True, null=True)
    due_time = models.TimeField(blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True)
    decision_date = models.DateField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "program_iteration",
                Lower("name"),
                name="applicationround_unique_programiteration_name",
            )
        ]

    def __str__(self) -> str:
        return f"{self.program_iteration} | {self.name}"

    @classmethod
    def filter(
        cls,
        program_type: str = None,
        program: int = None,
        year: int = None,
        term: str = None,
    ):
        q = cls.objects.all().prefetch_related("program_iteration__program")

        if program_type == "undergraduate":
            q = q.filter(
                program_iteration__program__type__in=["UG Freshman", "UG Transfer"]
            )
        elif program_type == "freshman":
            q = q.filter(program_iteration__program__type="UG Freshman")
        elif program_type == "transfer":
            q = q.filter(program_iteration__program__type="UG Transfer")
        elif program_type == "graduate":
            q = q.filter(program_iteration__program__type__in=["Master's", "Doctorate"])
        elif program_type in {"nondegree", "other"}:
            q = q.filter(program_iteration__program__type="Non-degree")

        if program is not None:
            q = q.filter(program_iteration__program__id=program)
        if year is not None:
            q = q.filter(program_iteration__year=year)
        if term is not None:
            q = q.filter(program_iteration__term=term)

        return q

    @property
    def applications_count(self):
        return self.applications.count()
