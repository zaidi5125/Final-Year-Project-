from rest_framework import serializers
from .models import Meeting, MeetingMember, MeetingExternalParticipant


class MeetingMemberSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source='user.username', read_only=True
    )
    role_name = serializers.CharField(
        source='assigned_as.name', read_only=True
    )

    class Meta:
        model = MeetingMember
        fields = [
            'id', 'user', 'member_name',
            'assigned_as', 'role_name', 'participant_type'
        ]


class MeetingExternalParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingExternalParticipant
        fields = [
            'id', 'full_name', 'cnic', 'contact_number',
            'participant_type', 'email', 'city', 'address'
        ]


class MeetingSerializer(serializers.ModelSerializer):
    internal_members = MeetingMemberSerializer(many=True, read_only=True)
    external_members = MeetingExternalParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Meeting
        fields = [
            'id', 'title', 'purpose', 'venue', 'duration',
            'start_time', 'end_time', 'meeting_date', 'reminder',
            'description', 'result', 'status',
            'internal_members', 'external_members'
        ]