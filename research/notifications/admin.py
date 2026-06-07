from django.contrib import admin
from .models import Notification, CalendarEvent

admin.site.register(Notification)
admin.site.register(CalendarEvent)