from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):  
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    name = models.CharField(max_length=255, default="Unknown") 
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    username = None  # Remove default username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role'] 

    groups = models.ManyToManyField(Group, related_name="auth_app_users")
    user_permissions = models.ManyToManyField(Permission, related_name="auth_app_users")

    def __str__(self):
        return self.email
