from django.contrib import admin
from .models import Meeting, MeetingMember, MeetingExternalParticipant

admin.site.register(Meeting)
admin.site.register(MeetingMember)
admin.site.register(MeetingExternalParticipant)