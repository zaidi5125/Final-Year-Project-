from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Research, ResearchAssignment, Beneficiary
from .serializers import (
    ResearchSerializer,
    ResearchAssignmentSerializer,
    BeneficiarySerializer
)


class ResearchViewSet(viewsets.ModelViewSet):
    queryset = Research.objects.all().order_by('-start_date')
    serializer_class = ResearchSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status']
    search_fields = ['title', 'topic', 'purpose']

    @action(detail=True, methods=['get', 'post'], url_path='assign')
    def assign_researcher(self, request, pk=None):
        research = self.get_object()
        if request.method == 'GET':
            researchers = research.researchers.all()
            return Response(ResearchAssignmentSerializer(researchers, many=True).data)
        serializer = ResearchAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(research=research)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get', 'post'], url_path='beneficiaries')
    def beneficiaries(self, request, pk=None):
        research = self.get_object()
        if request.method == 'GET':
            beneficiaries = research.beneficiaries.all()
            return Response(BeneficiarySerializer(beneficiaries, many=True).data)
        serializer = BeneficiarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(research=research)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)