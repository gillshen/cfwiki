from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import CFUserManager


class CFUser(AbstractUser):
    # Additional fields
    department = models.CharField(max_length=100)
    public_banner = models.CharField(max_length=100, blank=True)
    private_banner = models.CharField(max_length=100, blank=True)

    objects = CFUserManager()

    def __str__(self):
        return self.username


class Student(models.Model):
    lastname = models.CharField(max_length=100)
    firstname = models.CharField(max_length=100)
    lastname_first = models.BooleanField(default=True)

    lastname_rm = models.CharField(max_length=100, blank=True)
    firstname_rm = models.CharField(max_length=100, blank=True)

    gender = models.CharField(max_length=20)
    citizenship = models.CharField(max_length=100)
    date_of_birth = models.DateField(blank=True, null=True)

    base_city = models.CharField(max_length=100, blank=True)
    base_state = models.CharField(max_length=50, blank=True)

    comments = models.TextField(max_length=1000, blank=True)

    def __str__(self) -> str:
        return self.fullname

    @property
    def fullname(self):
        if self.lastname_first:
            return f"{self.lastname}{self.firstname}"
        else:
            return f"{self.firstname} {self.lastname}"
