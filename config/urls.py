from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/participants/', include('participants.urls')),

    path('api/teams/', include('teams.urls')),
    path('api/leads/', include('leads.urls')),
    path('api/meetings/', include('meetings.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/cases/', include('cases.urls')),
    path('api/research/', include('research.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/notifications/', include('notifications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
