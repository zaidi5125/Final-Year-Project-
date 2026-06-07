from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Course, CourseMember, ParticipantProfile
from .serializers import (
    CourseSerializer,
    CourseMemberSerializer,
    ParticipantProfileSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-start_date')
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status']
    search_fields = ['name', 'course_id']

    @action(detail=True, methods=['get', 'post'], url_path='members')
    def members(self, request, pk=None):
        course = self.get_object()
        if request.method == 'GET':
            members = course.members.all()
            return Response(CourseMemberSerializer(members, many=True).data)
        serializer = CourseMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path=r'members/(?P<member_id>\d+)')
    def remove_member(self, request, pk=None, member_id=None):
        CourseMember.objects.filter(id=member_id, course_id=pk).delete()
        return Response({'detail': 'Member removed.'})


class ParticipantProfileViewSet(viewsets.ModelViewSet):
    queryset = ParticipantProfile.objects.all()
    serializer_class = ParticipantProfileSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['full_name', 'email', 'cnic', 'participant_id']