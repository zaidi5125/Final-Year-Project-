from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import HasRolePermission
from .models import Case, CaseParty, PartyMember
from .serializers import CaseSerializer, CasePartySerializer, PartyMemberSerializer


class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated, HasRolePermission]
    filterset_fields = ['status', 'payment_status', 'case_type']
    search_fields = ['title', 'case_id', 'court_case_id', 'court']
    required_roles = {
        'list':           ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'retrieve':       ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'create':         ['Admin', 'Sub Admin'],
        'update':         ['Admin', 'Sub Admin'],
        'partial_update': ['Admin', 'Sub Admin'],
        'destroy':        ['Admin'],
        'parties':        ['Admin', 'Sub Admin', 'Team Member', 'Participant', 'Researcher'],
        'add_party_member': ['Admin', 'Sub Admin'],
    }

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_role('Admin', 'Sub Admin'):
            return Case.objects.all().order_by('-start_date')
        return Case.objects.filter(
            created_by=user
        ).order_by('-start_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='parties')
    def parties(self, request, pk=None):
        case = self.get_object()
        if request.method == 'GET':
            parties = case.parties.all()
            return Response(CasePartySerializer(parties, many=True).data)
        serializer = CasePartySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(case=case)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path=r'parties/(?P<party_id>\d+)/members')
    def add_party_member(self, request, pk=None, party_id=None):
        try:
            party = CaseParty.objects.get(id=party_id, case_id=pk)
        except CaseParty.DoesNotExist:
            return Response({'error': 'Party not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PartyMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(party=party)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
