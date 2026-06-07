from rest_framework import serializers
from .models import Notification, CalendarEvent


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title',
            'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['created_at']


class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = [
            'id', 'event_type', 'title', 'start_date',
            'end_date', 'start_time', 'end_time',
            'description', 'created_at'
        ]
        read_only_fields = ['created_at']