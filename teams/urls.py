from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TeamMemberProfileViewSet

router = DefaultRouter()
router.register('profiles', TeamMemberProfileViewSet, basename='team-profiles')
router.register('', TeamViewSet, basename='teams')

urlpatterns = [
    path('', include(router.urls)),
]