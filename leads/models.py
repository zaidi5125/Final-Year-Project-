from django.db import models
from django.conf import settings


class Lead(models.Model):

    LEAD_TYPES = (
        ('student', 'Student Admission'),
        ('dispute', 'Dispute Resolution')
    )

    LEAD_SOURCES = (
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('whatsapp', 'WhatsApp'),
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('other', 'Other')
    )

    STATUS_CHOICES = (
        ('new', 'New'),
        ('interested', 'Interested'),
        ('not_interested', 'Not Interested'),
        ('will_visit', 'Will Visit'),
        ('enrolled_filed', 'Enrolled/Filed'),
    )

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )

    lead_type = models.CharField(max_length=20, choices=LEAD_TYPES)
    lead_source = models.CharField(max_length=20, choices=LEAD_SOURCES, default='other')
    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    course_interest = models.CharField(max_length=200, blank=True, null=True)
    dispute_type = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='new')
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_leads'
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_leads'
    )

    def __str__(self):
        return f"{self.full_name} - {self.lead_type} - {self.status}"


class CallLog(models.Model):

    CALL_STATUS = (
        ('answered', 'Answered'),
        ('not_answered', 'Not Answered'),
        ('busy', 'Busy'),
        ('callback', 'Callback Requested')
    )

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='call_logs')
    called_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    call_status = models.CharField(max_length=20, choices=CALL_STATUS)
    lead_status_after_call = models.CharField(max_length=30, choices=Lead.STATUS_CHOICES)
    notes = models.TextField(blank=True, null=True)
    called_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead.full_name} - {self.call_status}"