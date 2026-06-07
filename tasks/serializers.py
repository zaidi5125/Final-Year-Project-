from rest_framework import serializers
from .models import Task, TaskAssignment


class TaskAssignmentSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(
        source='user.username', read_only=True
    )

    class Meta:
        model = TaskAssignment
        fields = ['id', 'user', 'assigned_to_name', 'assigned_at']
        read_only_fields = ['assigned_at']


class TaskSerializer(serializers.ModelSerializer):
    assignments = TaskAssignmentSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(
        source='created_by.username', read_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority',
            'status', 'due_date', 'created_by',
            'created_by_name', 'created_at', 'updated_at',
            'assignments'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']