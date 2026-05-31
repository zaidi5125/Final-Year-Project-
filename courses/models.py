from django.db import models
from django.conf import settings
from django.utils import timezone


class Course(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed')
    )
    name = models.CharField(max_length=200)
    course_id = models.CharField(max_length=30, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')

    def save(self, *args, **kwargs):
        today = timezone.now().date()
        if self.end_date < today:
            self.status = 'completed'
        elif self.start_date <= today <= self.end_date:
            self.status = 'ongoing'
        else:
            self.status = 'upcoming'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CourseMember(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='members'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    assigned_role = models.ForeignKey(
        'accounts.Role', on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ['course', 'user', 'assigned_role']

    def __str__(self):
        return f"{self.user.username} - {self.assigned_role.name}"


class ParticipantProfile(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('completed', 'Completed')
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='participant_profile'
    )
    participant_id = models.CharField(max_length=30, unique=True)
    profile_image = models.ImageField(
        upload_to='participant_profiles/', blank=True, null=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    enrolled_date = models.DateField(auto_now_add=True)
    session_year = models.CharField(max_length=20)
    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    cnic = models.CharField(max_length=20, unique=True)
    city = models.CharField(max_length=100)
    address = models.TextField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)

    def __str__(self):
        return self.full_name