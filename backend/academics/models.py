from contextlib import suppress
from decimal import Decimal

from django.db import models
from django.db.models import Case, When, F
from django.db.models.functions import Lower

from core.models import Student
from target.models import School


class Enrollment(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="enrollments",
        on_delete=models.CASCADE,
    )
    school = models.ForeignKey(
        School,
        related_name="enrollments",
        on_delete=models.CASCADE,
    )
    # "High School", "UG Freshman", etc.
    program_type = models.CharField(max_length=50)

    start_date = models.DateField()
    start_progression = models.CharField(max_length=50, blank=True)
    end_date = models.DateField(blank=True, null=True)
    end_progression = models.CharField(max_length=50, blank=True)

    # For high school students, "IB", "AP", etc.
    # For college/grad students, the major or graduate program
    curriculum = models.CharField(max_length=100, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "student",
                "school",
                Lower("program_type"),
                "start_date",
                name="enrollment_unique_student_school_type_startdate",
            )
        ]

        ordering = [
            # The most advanced program first; if tied, then
            # the one with the latest end date first (null later than all dates);
            # then the one with the latest end progression;
            # and finally the one with the latest start progression
            Case(
                When(program_type="Master's", then=0),
                When(program_type="UG Transfer", then=1),
                When(program_type="UG Freshman", then=2),
                When(program_type="Secondary School", then=3),
                default=99,
                output_field=models.IntegerField(),
            ),
            F("end_date").desc(nulls_first=True),
            Case(
                When(end_progression="Year 5", then=0),
                When(end_progression="Year 4", then=1),
                When(end_progression="Year 3", then=2),
                When(end_progression="Year 2", then=3),
                When(end_progression="Year 1", then=4),
                When(end_progression="G12", then=5),
                When(end_progression="G11", then=6),
                When(end_progression="G10", then=7),
                When(end_progression="G9", then=8),
                When(end_progression="G8", then=9),
                When(end_progression="G7", then=10),
            ),
            Case(
                When(start_progression="Year 5", then=0),
                When(start_progression="Year 4", then=1),
                When(start_progression="Year 3", then=2),
                When(start_progression="Year 2", then=3),
                When(start_progression="Year 1", then=4),
                When(start_progression="G12", then=5),
                When(start_progression="G11", then=6),
                When(start_progression="G10", then=7),
                When(start_progression="G9", then=8),
                When(start_progression="G8", then=9),
                When(start_progression="G7", then=10),
            ),
        ]

    def __str__(self) -> str:
        return f"{self.student} @ {self.school}"

    @staticmethod
    def filter(q, school: int = None, program_type: str = None):
        if school is not None:
            q = q.filter(school=school)
        if program_type is not None:
            q = q.filter(program_type=program_type)
        return q.distinct()


class Grade(models.Model):

    enrollment = models.ForeignKey(
        Enrollment,
        related_name="grades",
        on_delete=models.CASCADE,
    )
    progression = models.CharField(max_length=50)
    term = models.CharField(max_length=20)
    value = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    scale = models.DecimalField(max_digits=6, decimal_places=3, blank=True, null=True)
    is_weighted = models.BooleanField(default=False)
    is_cumulative = models.BooleanField(default=False)
    comments = models.TextField(max_length=500, blank=True)

    # No unique constraint because students might repeat a grade
    class Meta:
        ordering = [
            # ordering mimicks natural progression
            Case(
                When(progression="G7", then=0),
                When(progression="G8", then=1),
                When(progression="G9", then=2),
                When(progression="G10", then=3),
                When(progression="G11", then=4),
                When(progression="G12", then=5),
                When(progression="Year 1", then=6),
                When(progression="Year 2", then=7),
                When(progression="Year 3", then=8),
                When(progression="Year 4", then=9),
                When(progression="Year 5", then=10),
                default=99,
                output_field=models.IntegerField(),
            ),
            Case(
                When(term="Fall", then=0),
                When(term="Winter", then=1),
                When(term="Spring", then=2),
                When(term="Summer", then=3),
                When(term="Year", then=4),
                default=99,
                output_field=models.IntegerField(),
            ),
            # cumulative grades after non-cumulative ons
            "is_cumulative",
        ]

    def __str__(self) -> str:
        return f"{self.enrollment} | {self.progression} {self.term}: {self.value}"


class TOEFLScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="toefl",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    reading = models.SmallIntegerField(blank=True, null=True)
    listening = models.SmallIntegerField(blank=True, null=True)
    speaking = models.SmallIntegerField(blank=True, null=True)
    writing = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "TOEFL scores"

    def __str__(self) -> str:
        return f"{self.student} | TOEFL: {self.total}"

    @property
    def total(self) -> int | None:
        with suppress(TypeError):
            return sum([self.reading, self.listening, self.speaking, self.writing])


class IELTSScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="ielts",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    listening = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=True,
        null=True,
    )
    reading = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=True,
        null=True,
    )
    writing = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=True,
        null=True,
    )
    speaking = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name_plural = "IELTS scores"

    def __str__(self) -> str:
        return f"{self.student} | IELTS: {self.overall}"

    @property
    def overall(self) -> Decimal | None:
        with suppress(TypeError):
            total = sum([self.listening, self.reading, self.writing, self.speaking])
            return Decimal(int(total / 2 + Decimal(0.5)) / 2)


class DuolingoScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="duolingo",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    overall = models.PositiveSmallIntegerField(blank=True, null=True)
    literacy = models.PositiveSmallIntegerField(blank=True, null=True)
    comprehension = models.PositiveSmallIntegerField(blank=True, null=True)
    conversation = models.PositiveSmallIntegerField(blank=True, null=True)
    production = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Duolingo scores"

    def __str__(self) -> str:
        return f"{self.student} | Duolingo: {self.overall}"


class SATScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="sat",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    ebrw = models.PositiveSmallIntegerField(blank=True, null=True)
    math = models.PositiveSmallIntegerField(blank=True, null=True)
    essay = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "SAT scores"

    def __str__(self) -> str:
        return f"{self.student} | SAT: {self.total}"

    @property
    def total(self) -> int | None:
        with suppress(TypeError):
            return self.ebrw + self.math


class ACTScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="act",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    math = models.PositiveSmallIntegerField(blank=True, null=True)
    science = models.PositiveSmallIntegerField(blank=True, null=True)
    english = models.PositiveSmallIntegerField(blank=True, null=True)
    reading = models.PositiveSmallIntegerField(blank=True, null=True)
    writing = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "ACT scores"

    def __str__(self) -> str:
        return f"{self.student} | ACT: {self.composite}"

    @property
    def composite(self) -> int | None:
        with suppress(TypeError):
            total = sum([self.math, self.science, self.english, self.reading])
            return round(Decimal(total / 4) + Decimal(0.1))


class APScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="ap",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    subject = models.CharField(max_length=100)
    score = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "AP scores"

    def __str__(self) -> str:
        return f"{self.student} | AP {self.subject}: {self.score}"


class IBGrade(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="ib",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    # "predicted" or "final"
    type = models.CharField(max_length=20)

    subject = models.CharField(max_length=100)
    grade = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "IB grades"

    def __str__(self) -> str:
        return f"{self.student} | IB ({self.type}) {self.subject}: {self.grade}"


class ALevelGrade(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="alevel",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    # "predicted" or "final"
    type = models.CharField(max_length=20)

    subject = models.CharField(max_length=100)
    percentage = models.SmallIntegerField(blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True)

    class Meta:
        verbose_name_plural = "A-level grades"

    def __str__(self) -> str:
        return f"{self.student} | A-level ({self.type}) {self.subject}: {self.grade}"


class GREScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="gre",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    verbal = models.PositiveSmallIntegerField(blank=True, null=True)
    quant = models.PositiveSmallIntegerField(blank=True, null=True)
    writing = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    class Meta:
        verbose_name_plural = "GRE scores"

    def __str__(self) -> str:
        return f"{self.student} | GRE: {self.total}"

    @property
    def total(self):
        with suppress(TypeError):
            return self.verbal + self.quant


class GMATScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="gmat",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)

    total = models.PositiveSmallIntegerField(blank=True, null=True)
    verbal = models.SmallIntegerField(blank=True, null=True)
    quant = models.SmallIntegerField(blank=True, null=True)
    data_insights = models.SmallIntegerField(blank=True, null=True)
    reasoning = models.SmallIntegerField(blank=True, null=True)
    writing = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    # whether the test is the pre-2023 version
    is_legacy = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "GMAT scores"

    def __str__(self) -> str:
        return f"{self.student} | GMAT: {self.total}"


class LSATScore(models.Model):

    student = models.ForeignKey(
        Student,
        related_name="lsat",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)
    score = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "LSAT scores"

    def __str__(self) -> str:
        return f"{self.student} | LSAT: {self.score}"
