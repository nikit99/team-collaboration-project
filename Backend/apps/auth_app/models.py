
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):  
    ROLE_CHOICES = (
        ('superadmin', 'Superadmin'),
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    name = models.CharField(max_length=255, default="Unknown") 
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")  

    username = None  
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']  

    groups = models.ManyToManyField(Group, related_name="auth_app_users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="auth_app_users", blank=True)

    def __str__(self):
        return self.email
