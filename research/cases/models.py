from django.db import models
from django.conf import settings


class Case(models.Model):
    PAYMENT_STATUS = (
        ('received', 'Received'),
        ('pending', 'Pending'),
        ('partial', 'Partial')
    )
    CASE_STATUS = (
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('closed', 'Closed')
    )
    title = models.CharField(max_length=200)
    case_id = models.CharField(max_length=50, unique=True)
    court_case_id = models.CharField(max_length=50, blank=True, null=True)
    case_type = models.CharField(max_length=100)
    court = models.CharField(max_length=100)
    payment_status = models.CharField(max_length=30, choices=PAYMENT_STATUS)
    status = models.CharField(max_length=30, choices=CASE_STATUS)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    result = models.TextField(blank=True, null=True)
    case_document = models.FileField(upload_to='case_documents/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title


class CaseParty(models.Model):
    PARTY_TYPES = (
        ('complainant', 'Complainant'),
        ('respondent', 'Respondent')
    )
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )
    case = models.ForeignKey(
        Case, on_delete=models.CASCADE, related_name='parties'
    )
    party_type = models.CharField(max_length=30, choices=PARTY_TYPES)
    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    cnic = models.CharField(max_length=20)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    dob = models.DateField()
    email = models.EmailField()
    contact_number = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    lawyer_name = models.CharField(max_length=100, blank=True, null=True)
    lawyer_role = models.CharField(max_length=100, blank=True, null=True)
    document = models.FileField(upload_to='party_documents/', blank=True, null=True)

    def __str__(self):
        return self.full_name


class PartyMember(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )
    party = models.ForeignKey(
        CaseParty, on_delete=models.CASCADE, related_name='members'
    )
    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    cnic = models.CharField(max_length=20)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    relation = models.CharField(max_length=50)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()
    dob = models.DateField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    document = models.FileField(upload_to='party_documents/', blank=True, null=True)

    def __str__(self):
        return self.full_name