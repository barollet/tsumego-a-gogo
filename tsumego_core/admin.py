from django.contrib import admin

from .models import Tsumego, Collection, Tag

# Register your models here.

admin.site.register(Collection)
admin.site.register(Tag)
admin.site.register(Tsumego)
