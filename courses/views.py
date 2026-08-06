from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import HasRolePermission
from .models import Course, CourseMember, ParticipantProfile
from .serializers import (
    CourseSerializer,
    CourseMemberSerializer,
    ParticipantProfileSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, HasRolePermission]
    filterset_fields = ['status']
    search_fields = ['name', 'course_id']
    required_roles = {
        'list':           ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'retrieve':       ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'create':         ['Admin', 'Sub Admin'],
        'update':         ['Admin', 'Sub Admin'],
        'partial_update': ['Admin', 'Sub Admin'],
        'destroy':        ['Admin'],
        'members':        ['Admin', 'Sub Admin'],
        'remove_member':  ['Admin', 'Sub Admin'],
    }

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_role('Admin', 'Sub Admin'):
            return Course.objects.all().order_by('-start_date')
        return Course.objects.filter(
            members__user=user
        ).distinct().order_by('-start_date')

    @action(detail=True, methods=['get', 'post'], url_path='members')
    def members(self, request, pk=None):
        course = self.get_object()
        if request.method == 'GET':
            members = course.members.all()
            return Response(CourseMemberSerializer(members, many=True).data)
        serializer = CourseMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            from notifications.models import Notification
            Notification.objects.create(
                user_id=request.data.get('user'),
                notification_type='course',
                title='Added to Course',
                message=f'You have been added to course: {course.name}',
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path=r'members/(?P<member_id>\d+)')
    def remove_member(self, request, pk=None, member_id=None):
        CourseMember.objects.filter(id=member_id, course_id=pk).delete()
        return Response({'detail': 'Member removed.'})


class ParticipantProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantProfileSerializer
    permission_classes = [IsAuthenticated, HasRolePermission]
    search_fields = ['full_name', 'email', 'cnic', 'participant_id']
    required_roles = {
        'list':           ['Admin', 'Sub Admin'],
        'retrieve':       ['Admin', 'Sub Admin'],
        'create':         ['Admin', 'Sub Admin'],
        'update':         ['Admin', 'Sub Admin'],
        'partial_update': ['Admin', 'Sub Admin'],
        'destroy':        ['Admin'],
    }

    def get_queryset(self):
        return ParticipantProfile.objects.all()

