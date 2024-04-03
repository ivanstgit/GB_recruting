# Register your models here.
from django.contrib import admin

from recrutingapp.models import City, Gender, NewsTag, NewsPost, Region, Skill


class NewsTagAdmin(admin.ModelAdmin):
    pass


class NewsPostAdmin(admin.ModelAdmin):
    pass


admin.site.register(NewsTag, NewsTagAdmin)
admin.site.register(NewsPost, NewsPostAdmin)
admin.site.register(Gender, admin.ModelAdmin)
admin.site.register(City, admin.ModelAdmin)
admin.site.register(Skill, admin.ModelAdmin)
admin.site.register(Region, admin.ModelAdmin)
