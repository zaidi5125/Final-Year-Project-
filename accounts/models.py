# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    """Dynamic roles — Admin frontend se naye roles bana sakta hai"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=list, blank=True)
    is_system_role = models.BooleanField(
        default=False,
        help_text="True for built-in roles like Admin (cannot be deleted)"
    )

    def __str__(self):
        return self.name


class User(AbstractUser):
    roles = models.ManyToManyField(Role, blank=True, related_name='users')
    is_active_member = models.BooleanField(default=True)
    force_password_change = models.BooleanField(default=False)

    def has_role(self, role_name):
        return self.roles.filter(name__iexact=role_name).exists()

    @property
    def is_admin_role(self):
        return self.has_role('Admin') or self.is_superuser

    def __str__(self):
        return f"{self.username}"