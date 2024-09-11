from django.db import models
from django.db.models.functions import Lower


class AcademyProgram(models.Model):

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                Lower("category"),
                name="academyprogram_unique_name_category",
            )
        ]

    def __str__(self):
        return self.name
