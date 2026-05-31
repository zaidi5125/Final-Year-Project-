from django.contrib import admin
from .models import Course, CourseMember, ParticipantProfile

admin.site.register(Course)
admin.site.register(CourseMember)
admin.site.register(ParticipantProfile)