from django.db import models
from django.conf import settings


class Meeting(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )
    title = models.CharField(max_length=200)
    purpose = models.CharField(max_length=200)
    venue = models.CharField(max_length=200)
    duration = models.CharField(max_length=50)
    start_time = models.TimeField()
    end_time = models.TimeField()
    meeting_date = models.DateField()
    reminder = models.DateTimeField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    result = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')

    def __str__(self):
        return self.title


class MeetingMember(models.Model):
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name='internal_members'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    assigned_as = models.ForeignKey(
        'accounts.Role', on_delete=models.CASCADE
    )
    participant_type = models.CharField(max_length=50)

    class Meta:
        unique_together = ['meeting', 'user', 'assigned_as']

    def get_member_details(self):
        profile = self.user.profile
        return f"{profile.team_member_id} - {profile.full_name}"

    def __str__(self):
        return self.get_member_details()


class MeetingExternalParticipant(models.Model):
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name='external_members'
    )
    full_name = models.CharField(max_length=100)
    cnic = models.CharField(max_length=20)
    contact_number = models.CharField(max_length=20)
    participant_type = models.CharField(max_length=50)
    email = models.EmailField()
    city = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return self.full_name