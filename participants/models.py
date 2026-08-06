from django.db import models


class Participant(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('completed', 'Completed'),
    ]
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    participant_id = models.CharField(max_length=50, unique=True, blank=True)
    profile_image = models.TextField(blank=True)
    full_name = models.CharField(max_length=150)
    father_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    contact_number = models.CharField(max_length=30)
    email = models.EmailField()
    cnic = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    address = models.TextField()
    enrolled_date = models.DateField(null=True, blank=True)
    session_year = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.participant_id:
            count = Participant.objects.count() + 1
            self.participant_id = f"PRT-{count:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name
