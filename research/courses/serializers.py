from rest_framework import serializers
from .models import Course, CourseMember, ParticipantProfile


class CourseMemberSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source='user.username', read_only=True
    )
    role_name = serializers.CharField(
        source='assigned_role.name', read_only=True
    )

    class Meta:
        model = CourseMember
        fields = ['id', 'user', 'member_name', 'assigned_role', 'role_name']


class CourseSerializer(serializers.ModelSerializer):
    members = CourseMemberSerializer(many=True, read_only=True)
    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'course_id', 'start_date', 'end_date',
            'description', 'status', 'members', 'total_members'
        ]

    def get_total_members(self, obj):
        return obj.members.count()


class ParticipantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipantProfile
        fields = [
            'id', 'user', 'participant_id', 'profile_image',
            'status', 'enrolled_date', 'session_year',
            'full_name', 'father_name', 'contact_number',
            'email', 'cnic', 'city', 'address', 'gender'
        ]