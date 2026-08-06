from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import HasRolePermission
from .models import Task, TaskAssignment
from .serializers import TaskSerializer, TaskAssignmentSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, HasRolePermission]
    filterset_fields = ['status', 'priority']
    search_fields = ['title', 'description']
    required_roles = {
        'list':           ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'retrieve':       ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'create':         ['Admin', 'Sub Admin'],
        'update':         ['Admin', 'Sub Admin'],
        'partial_update': ['Admin', 'Sub Admin'],
        'destroy':        ['Admin'],
        'assign':         ['Admin', 'Sub Admin'],
        'update_status':  ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
    }

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_role('Admin', 'Sub Admin'):
            return Task.objects.all().order_by('-created_at')
        return Task.objects.filter(
            assignments__user=user
        ).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='assign')
    def assign(self, request, pk=None):
        task = self.get_object()
        if request.method == 'GET':
            assignments = task.assignments.all()
            return Response(TaskAssignmentSerializer(assignments, many=True).data)
        serializer = TaskAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(task=task)
            from notifications.models import Notification
            Notification.objects.create(
                user_id=request.data.get('user'),
                notification_type='general',
                title='New Task Assigned',
                message=f'You have been assigned task: {task.title}',
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['pending', 'in_progress', 'completed', 'cancelled']:
            return Response(
                {'error': 'Invalid status!'},
                status=status.HTTP_400_BAD_REQUEST
            )
        task.status = new_status
        task.save()
        return Response({'detail': f'Status updated to {new_status}'})

