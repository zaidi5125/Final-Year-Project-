from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, CalendarEventViewSet

router = DefaultRouter()
router.register('calendar', CalendarEventViewSet, basename='calendar')
router.register('notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
]