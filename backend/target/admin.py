from django.contrib import admin
from target.models import (
    School,
    ProgramCollection,
    Program,
    ProgramIteration,
    ApplicationRound,
    SchoolRanking,
    SchoolRankingEntry,
)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = "id", "type", "name", "alt_name", "country"


@admin.register(ProgramCollection)
class ProgramGroupAdmin(admin.ModelAdmin):
    list_display = "id", "name"


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = "id", "type", "host_schools", "name", "degree", "is_defunct"

    def host_schools(self, instance) -> str:
        return " | ".join([s.name for s in instance.schools.all()])


@admin.register(ProgramIteration)
class ProgramIterationAdmin(admin.ModelAdmin):
    list_display = "id", "program", "year", "term"


@admin.register(ApplicationRound)
class ApplicationRoundAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "program_iteration",
        "name",
        "due_date",
        "due_time",
        "timezone",
    )


@admin.register(SchoolRanking)
class SchoolRankingAdmin(admin.ModelAdmin):
    list_display = "id", "name"


@admin.register(SchoolRankingEntry)
class SchoolRankingEntryAdmin(admin.ModelAdmin):
    list_display = "id", "ranking", "year", "school", "rank"
