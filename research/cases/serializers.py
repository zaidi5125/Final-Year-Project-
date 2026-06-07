from rest_framework import serializers
from .models import Case, CaseParty, PartyMember


class PartyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMember
        fields = [
            'id', 'full_name', 'father_name', 'cnic',
            'gender', 'relation', 'contact_number',
            'email', 'dob', 'address', 'city', 'document'
        ]


class CasePartySerializer(serializers.ModelSerializer):
    members = PartyMemberSerializer(many=True, read_only=True)

    class Meta:
        model = CaseParty
        fields = [
            'id', 'party_type', 'full_name', 'father_name',
            'cnic', 'gender', 'dob', 'email', 'contact_number',
            'address', 'city', 'lawyer_name', 'lawyer_role',
            'document', 'members'
        ]


class CaseSerializer(serializers.ModelSerializer):
    parties = CasePartySerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(
        source='created_by.username', read_only=True
    )

    class Meta:
        model = Case
        fields = [
            'id', 'title', 'case_id', 'court_case_id',
            'case_type', 'court', 'payment_status', 'status',
            'start_date', 'end_date', 'result', 'case_document',
            'description', 'created_by', 'created_by_name', 'parties'
        ]
        read_only_fields = ['created_by']