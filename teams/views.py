from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Team, TeamMemberProfile, TeamMembership
from .serializers import (
    TeamSerializer,
    TeamMemberProfileSerializer,
    TeamMembershipSerializer,
)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('-created_date')
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get', 'post'], url_path='members')
    def members(self, request, pk=None):
        team = self.get_object()
        if request.method == 'GET':
            memberships = team.members.select_related('user')
            return Response(TeamMembershipSerializer(memberships, many=True).data)

        serializer = TeamMembershipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(team=team)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True, methods=['delete'],
        url_path=r'members/(?P<user_id>\d+)'
    )
    def remove_member(self, request, pk=None, user_id=None):
        TeamMembership.objects.filter(team_id=pk, user_id=user_id).delete()
        return Response({'detail': 'Member removed.'}, status=status.HTTP_200_OK)


class TeamMemberProfileViewSet(viewsets.ModelViewSet):
    queryset = TeamMemberProfile.objects.all()
    serializer_class = TeamMemberProfileSerializer
    permission_classes = [IsAuthenticated]