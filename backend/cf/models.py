from django.db import models
from django.db.models.functions import Lower


class AcademyProduct(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                name="academyproduct_unique_name",
            )
        ]

    def __str__(self):
        return self.name
