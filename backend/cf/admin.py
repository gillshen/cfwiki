from django.contrib import admin

from cf.models import AcademyProduct


@admin.register(AcademyProduct)
class AcademyProductAdmin(admin.ModelAdmin):
    list_display = "id", "name"
