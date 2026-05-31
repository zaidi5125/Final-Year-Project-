from rest_framework import serializers
from .models import Lead, CallLog


class CallLogSerializer(serializers.ModelSerializer):
    called_by_name = serializers.CharField(
        source='called_by.username', read_only=True
    )

    class Meta:
        model = CallLog
        fields = [
            'id', 'call_status', 'lead_status_after_call',
            'notes', 'called_at', 'called_by_name'
        ]
        read_only_fields = ['called_at']


class LeadSerializer(serializers.ModelSerializer):
    call_logs = CallLogSerializer(many=True, read_only=True)
    assigned_to_name = serializers.CharField(
        source='assigned_to.username', read_only=True
    )

    class Meta:
        model = Lead
        fields = [
            'id', 'lead_type', 'lead_source', 'full_name',
            'father_name', 'gender', 'contact_number', 'email',
            'city', 'address', 'course_interest', 'dispute_type',
            'status', 'assigned_to', 'assigned_to_name',
            'notes', 'created_at', 'updated_at', 'call_logs'
        ]
        read_only_fields = ['created_at', 'updated_at']


class LeadBulkUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    lead_type = serializers.ChoiceField(
        choices=[('student', 'Student'), ('dispute', 'Dispute Resolution')]
    )