from django.contrib import admin

from cf.models import AcademyProgram


@admin.register(AcademyProgram)
class AcademyProgramAdmin(admin.ModelAdmin):
    list_display = "id", "name", "category"
