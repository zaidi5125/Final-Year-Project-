from django.contrib import admin
from .models import Team, TeamMemberProfile, TeamMembership

admin.site.register(Team)
admin.site.register(TeamMemberProfile)
admin.site.register(TeamMembership)