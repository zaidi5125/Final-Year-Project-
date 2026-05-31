from django.db import models
from django.conf import settings


class Research(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    )
    title = models.CharField(max_length=200)
    purpose = models.CharField(max_length=200)
    topic = models.CharField(max_length=200)
    research_document = models.FileField(
        upload_to='research_documents/', blank=True, null=True
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class ResearchAssignment(models.Model):
    RESEARCHER_LEVEL = (
        ('senior', 'Senior Researcher'),
        ('junior', 'Junior Researcher'),
        ('assistant', 'Research Assistant')
    )
    research = models.ForeignKey(
        Research, on_delete=models.CASCADE, related_name='researchers'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    researcher_role = models.CharField(max_length=30, choices=RESEARCHER_LEVEL)
    assigned_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['research', 'user']

    def __str__(self):
        return f"{self.user.username} - {self.researcher_role}"


class Beneficiary(models.Model):
    BENEFICIARY_TYPE = (
        ('individual', 'Individual'),
        ('organization', 'Organization')
    )
    research = models.ForeignKey(
        Research, on_delete=models.CASCADE, related_name='beneficiaries'
    )
    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()
    cnic = models.CharField(max_length=20)
    beneficiary_type = models.CharField(max_length=30, choices=BENEFICIARY_TYPE)
    address = models.TextField()
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.full_name