from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from core.models import CFUser, Student, Contract, Application, ApplicationLog
from core.forms import CFUserCreationForm, CFUserChangeForm


class CFUserAdmin(UserAdmin):
    ordering = ["username"]
    list_display = (
        "username",
        "id",
        "email",
        "department",
        "is_active",
        "is_staff",
        "is_superuser",
    )

    form = CFUserChangeForm
    add_form = CFUserCreationForm
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ["department", "public_banner", "private_banner"]}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ["department", "public_banner", "private_banner"]}),
    )


admin.site.register(CFUser, CFUserAdmin)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = "id", "fullname", "gender", "citizenship"


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = "id", "student", "type", "target_year", "status"


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = "id", "student", "program", "year", "term", "round_name"


@admin.register(ApplicationLog)
class ApplicationLogAdmin(admin.ModelAdmin):
    list_display = "id", "application", "date", "status"
