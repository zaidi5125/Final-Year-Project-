from django.contrib import admin
from .models import Case, CaseParty, PartyMember

admin.site.register(Case)
admin.site.register(CaseParty)
admin.site.register(PartyMember)