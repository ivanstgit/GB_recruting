# Register your models here.
from django.contrib import admin

from recrutingapp.models import NewsTag, NewsPost


class NewsTagAdmin(admin.ModelAdmin):
    pass


class NewsPostAdmin(admin.ModelAdmin):
    pass


admin.site.register(NewsTag, NewsTagAdmin)
admin.site.register(NewsPost, NewsPostAdmin)
