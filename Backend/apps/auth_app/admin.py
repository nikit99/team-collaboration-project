from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import your custom user model

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_superuser', 'is_staff')  # Display columns
    search_fields = ('email', 'username')
    ordering = ('email',)
    list_filter = ('is_superuser', 'is_staff')

admin.site.register(User, CustomUserAdmin)  # Register your User model
