from rest_framework import serializers
from .models import Participant


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = [
            'id', 'participant_id', 'profile_image', 'full_name', 'father_name',
            'gender', 'status', 'contact_number', 'email', 'cnic', 'city',
            'address', 'enrolled_date', 'session_year', 'created_at',
        ]
        read_only_fields = ['participant_id', 'created_at']
