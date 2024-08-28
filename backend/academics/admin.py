from django.contrib import admin

from academics.models import (
    Enrollment,
    Grade,
    TOEFLScore,
    IELTSScore,
    DuolingoScore,
    SATScore,
    ACTScore,
    APScore,
    IBGrade,
    ALevelGrade,
    GREScore,
    GMATScore,
    LSATScore,
)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = "id", "student", "school", "program_type", "start_date"


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "enrollment",
        "progression",
        "term",
        "value",
        "scale",
        "is_weighted",
        "is_cumulative",
        "comments",
    )


@admin.register(TOEFLScore)
class TOEFLScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "overall", "date"


@admin.register(IELTSScore)
class IELTSScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "overall", "date"


@admin.register(DuolingoScore)
class DuolingoScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "overall", "date"


@admin.register(SATScore)
class SATScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "total", "date"


@admin.register(ACTScore)
class ACTScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "composite", "date"


@admin.register(APScore)
class APScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "subject", "score", "date"


@admin.register(IBGrade)
class IBGradeAdmin(admin.ModelAdmin):
    list_display = "id", "student", "type", "subject", "grade", "date"


@admin.register(ALevelGrade)
class ALevelGradeAdmin(admin.ModelAdmin):
    list_display = "id", "student", "type", "subject", "grade", "date"


@admin.register(GREScore)
class GREScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "total", "verbal", "quant", "date"


@admin.register(GMATScore)
class GMATScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "total", "verbal", "quant", "data_insights", "date"


@admin.register(LSATScore)
class LSATScoreAdmin(admin.ModelAdmin):
    list_display = "id", "student", "score", "date"
