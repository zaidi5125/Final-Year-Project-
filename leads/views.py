from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd

from .models import Lead, CallLog
from .serializers import LeadSerializer, CallLogSerializer, LeadBulkUploadSerializer


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['lead_type', 'status', 'assigned_to', 'lead_source']
    search_fields = ['full_name', 'contact_number', 'email', 'city']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Lead.objects.all().order_by('-created_at')
        return Lead.objects.filter(assigned_to=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(
        detail=False, methods=['post'],
        url_path='upload',
        parser_classes=[MultiPartParser, FormParser]
    )
    def bulk_upload(self, request):
        serializer = LeadBulkUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']
        lead_type = request.data.get('lead_type')

        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.name.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file)
            else:
                return Response(
                    {'error': 'Sirf CSV ya Excel file upload karein!'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            required_columns = ['full_name', 'contact_number']
            missing = [col for col in required_columns if col not in df.columns]
            if missing:
                return Response(
                    {'error': f'Ye columns missing hain: {missing}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            leads_created = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    Lead.objects.create(
                        lead_type=lead_type,
                        full_name=row.get('full_name', ''),
                        contact_number=str(row.get('contact_number', '')),
                        email=row.get('email', None),
                        city=row.get('city', None),
                        father_name=row.get('father_name', None),
                        address=row.get('address', None),
                        lead_source=row.get('lead_source', 'other'),
                        course_interest=row.get('course_interest', None),
                        dispute_type=row.get('dispute_type', None),
                        uploaded_by=request.user,
                        status='new'
                    )
                    leads_created += 1
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")

            return Response({
                'message': f'{leads_created} leads successfully upload ho gayi!',
                'total_rows': len(df),
                'created': leads_created,
                'errors': errors
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'], url_path='call')
    def add_call_log(self, request, pk=None):
        lead = self.get_object()
        serializer = CallLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lead=lead, called_by=request.user)
            lead.status = request.data.get('lead_status_after_call', lead.status)
            lead.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        lead = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Lead.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status!'},
                status=status.HTTP_400_BAD_REQUEST
            )
        lead.status = new_status
        lead.save()
        return Response({'detail': f'Status updated to {new_status}'})

    @action(detail=True, methods=['patch'], url_path='assign')
    def assign_lead(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'error': 'Sirf Admin assign kar sakta hai!'},
                status=status.HTTP_403_FORBIDDEN
            )
        lead = self.get_object()
        user_id = request.data.get('user_id')
        lead.assigned_to_id = user_id
        lead.save()
        return Response({'detail': 'Lead assigned successfully!'})