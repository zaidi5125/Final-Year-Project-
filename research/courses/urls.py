from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ParticipantProfileViewSet

router = DefaultRouter()
router.register('participants', ParticipantProfileViewSet, basename='course-participants')
router.register('', CourseViewSet, basename='courses')

urlpatterns = [
    path('', include(router.urls)),
]