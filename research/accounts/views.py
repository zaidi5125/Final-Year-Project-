from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Role
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserListSerializer,
    UserCreateSerializer,
    ChangePasswordSerializer,
    MeSerializer,
    RoleSerializer,
)


# ─── Login ───────────────────────────────────────────────────────────────────
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# ─── Logout ──────────────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'detail': 'Logged out successfully.'})
    except Exception:
        return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


# ─── Change Password ─────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(
        data=request.data, context={'request': request}
    )
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.force_password_change = False
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'detail': 'Password changed successfully.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Me ──────────────────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(MeSerializer(request.user).data)


# ─── Admin Reset User Password ───────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_reset_password(request, user_id):
    if not request.user.is_staff:
        return Response(
            {'detail': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
    try:
        user = User.objects.get(id=user_id)
        new_password = request.data.get('new_password', 'Welcome@123')
        user.set_password(new_password)
        user.force_password_change = True
        user.save()
        return Response({'detail': f'Password reset for {user.username}.'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# ─── User ViewSet ─────────────────────────────────────────────────────────────
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.prefetch_related('roles').order_by('-date_joined')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserListSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.is_active_member = False
        user.save()
        return Response({'detail': 'User deactivated.'})


# ─── Role ViewSet ─────────────────────────────────────────────────────────────
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]