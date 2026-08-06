import re
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import HasRolePermission
from accounts.models import User, Role
from .models import Participant
from .serializers import ParticipantSerializer


def generate_username(full_name, existing_id):
    base = re.sub(r'[^a-z0-9]', '.', full_name.lower()).strip('.')
    base = base or 'participant'
    username = base
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1
    return username


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all().order_by('-created_at')
    serializer_class = ParticipantSerializer
    permission_classes = [IsAuthenticated, HasRolePermission]
    filterset_fields = ['status', 'gender']
    search_fields = ['full_name', 'participant_id', 'email', 'cnic']
    required_roles = {
        'list':           ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'retrieve':       ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'create':         ['Admin', 'Sub Admin'],
        'update':         ['Admin', 'Sub Admin'],
        'partial_update': ['Admin', 'Sub Admin'],
        'destroy':        ['Admin'],
    }

    def perform_create(self, serializer):
        participant = serializer.save()

        if not User.objects.filter(email=participant.email).exists() and participant.email:
            username = generate_username(participant.full_name, participant.id)
            first, _, last = participant.full_name.strip().partition(' ')
            user = User(
                username=username,
                email=participant.email,
                first_name=first,
                last_name=last,
                is_active=True,
                is_active_member=True,
                force_password_change=True,
            )
            user.set_password('Welcome@123')
            user.save()

            role, _ = Role.objects.get_or_create(name='Participant')
            user.roles.add(role)
