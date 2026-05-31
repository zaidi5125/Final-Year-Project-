from rest_framework import serializers
from .models import Team, TeamMemberProfile, TeamMembership
from accounts.serializers import UserListSerializer


class TeamSerializer(serializers.ModelSerializer):
    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'status', 'created_date', 'total_members']

    def get_total_members(self, obj):
        return obj.total_members()


class TeamMemberProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMemberProfile
        fields = [
            'id', 'user', 'team_member_id', 'profile_image',
            'experience', 'status', 'full_name', 'father_name',
            'cnic', 'contact_number', 'email',
            'address', 'city', 'gender'
        ]


class TeamMembershipSerializer(serializers.ModelSerializer):
    user_detail = UserListSerializer(source='user', read_only=True)

    class Meta:
        model = TeamMembership
        fields = ['id', 'team', 'user', 'user_detail', 'joined_date']
        read_only_fields = ['joined_date']