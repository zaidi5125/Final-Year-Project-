from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    logout_view,
    change_password_view,
    me_view,
    admin_reset_password,
    UserViewSet,
    RoleViewSet,
)

router = DefaultRouter()
router.register('roles', RoleViewSet, basename='roles')
router.register('', UserViewSet, basename='users')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/change-password/', change_password_view, name='change-password'),
    path('auth/me/', me_view, name='me'),
    path('auth/reset-password/<int:user_id>/', admin_reset_password, name='admin-reset-password'),
    path('users/', include(router.urls)),
]