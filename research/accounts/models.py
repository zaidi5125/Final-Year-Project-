from django.db import models
from django.contrib.auth.models import AbstractUser


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    roles = models.ManyToManyField(
        Role,
        blank=True,
        related_name='users'
    )
    is_active_member = models.BooleanField(default=True)
    force_password_change = models.BooleanField(default=True)

    def has_role(self, *role_names):
        if self.is_staff:
            return True
        return self.roles.filter(name__in=role_names).exists()

    def __str__(self):
        return self.username