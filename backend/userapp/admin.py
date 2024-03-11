from django.contrib import admin

from userapp import models


@admin.register(models.CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "email", "is_active", "date_created"]
    ordering = ["-date_created"]
