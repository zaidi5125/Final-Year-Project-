from rest_framework import serializers
from .models import Research, ResearchAssignment, Beneficiary


class ResearchAssignmentSerializer(serializers.ModelSerializer):
    researcher_name = serializers.CharField(
        source='user.username', read_only=True
    )

    class Meta:
        model = ResearchAssignment
        fields = [
            'id', 'user', 'researcher_name',
            'researcher_role', 'assigned_date'
        ]
        read_only_fields = ['assigned_date']


class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = [
            'id', 'full_name', 'father_name', 'contact_number',
            'email', 'cnic', 'beneficiary_type', 'address', 'city'
        ]


class ResearchSerializer(serializers.ModelSerializer):
    researchers = ResearchAssignmentSerializer(many=True, read_only=True)
    beneficiaries = BeneficiarySerializer(many=True, read_only=True)

    class Meta:
        model = Research
        fields = [
            'id', 'title', 'purpose', 'topic',
            'research_document', 'start_date', 'end_date',
            'status', 'description', 'researchers', 'beneficiaries'
        ]