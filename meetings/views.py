from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import HasRolePermission
from .models import Meeting, MeetingMember, MeetingExternalParticipant
from .serializers import (
    MeetingSerializer,
    MeetingMemberSerializer,
    MeetingExternalParticipantSerializer
)


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated, HasRolePermission]
    filterset_fields = ['status', 'meeting_date']
    search_fields = ['title', 'venue', 'purpose']
    required_roles = {
        'list':                  ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'retrieve':              ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'create':                ['Admin', 'Sub Admin'],
        'update':                ['Admin', 'Sub Admin'],
        'partial_update':        ['Admin', 'Sub Admin'],
        'destroy':               ['Admin'],
        'internal_participants': ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'external_participants': ['Admin', 'Sub Admin'],
        'update_status':         ['Admin', 'Sub Admin'],
    }

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_role('Admin', 'Sub Admin'):
            return Meeting.objects.all().order_by('-meeting_date')
        return Meeting.objects.filter(
            internal_members__user=user
        ).distinct().order_by('-meeting_date')

    @action(detail=True, methods=['get', 'post'], url_path='internal-participants')
    def internal_participants(self, request, pk=None):
        meeting = self.get_object()
        if request.method == 'GET':
            members = meeting.internal_members.all()
            return Response(MeetingMemberSerializer(members, many=True).data)
        serializer = MeetingMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(meeting=meeting)
            from notifications.models import Notification
            Notification.objects.create(
                user_id=request.data.get('user'),
                notification_type='meeting',
                title='New Meeting Assigned',
                message=f'You have been added to meeting: {meeting.title}',
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get', 'post'], url_path='external-participants')
    def external_participants(self, request, pk=None):
        meeting = self.get_object()
        if request.method == 'GET':
            members = meeting.external_members.all()
            return Response(MeetingExternalParticipantSerializer(members, many=True).data)
        serializer = MeetingExternalParticipantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(meeting=meeting)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        meeting = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['scheduled', 'completed', 'cancelled']:
            return Response({'error': 'Invalid status!'}, status=status.HTTP_400_BAD_REQUEST)
        meeting.status = new_status
        meeting.save()
        return Response({'detail': f'Status updated to {new_status}'})

