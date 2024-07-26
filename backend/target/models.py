from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.functions import Lower


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
