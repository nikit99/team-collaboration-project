# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# # User Manager
# class UserManager(BaseUserManager):
#     def create_user(self, email, name, password=None, role='user'):
#         if not email:
#             raise ValueError("Users must have an email address")
#         user = self.model(email=self.normalize_email(email), name=name, role=role)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, name, password):
#         user = self.create_user(email, name, password, role='admin')
#         user.is_superuser = True
#         user.is_staff = True
#         user.save(using=self._db)
#         return user

# # User Model
# class User(AbstractBaseUser, PermissionsMixin):
#     ROLE_CHOICES = [('admin', 'Admin'), ('user', 'User')]
    
#     email = models.EmailField(unique=True)
#     name = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     objects = UserManager()
    
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['name']
    
#     def __str__(self):
#         return self.email

# class Project(models.Model):
#     STATUS_CHOICES = [('pending', 'Pending'), ('in progress', 'In Progress'), ('completed', 'Completed')]
    
#     name = models.CharField(max_length=255)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     start_date = models.DateField()
#     estimated_end_date = models.DateField()
#     assigned_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_projects')
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return self.name

# class ProjectAssignment(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     project = models.ForeignKey(Project, on_delete=models.CASCADE)
#     assigned_at = models.DateTimeField(auto_now_add=True)
    
# # Department Model
# class Department(models.Model):
#     name = models.CharField(max_length=100, unique=True)
    
#     def __str__(self):
#         return self.name

# # Task Model
# class Task(models.Model):
#     STATUS_CHOICES = [('pending', 'Pending'), ('in progress', 'In Progress'), ('completed', 'Completed')]
    
#     name = models.CharField(max_length=255)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     project = models.ForeignKey(Project, on_delete=models.CASCADE)
#     department = models.ForeignKey(Department, on_delete=models.CASCADE)
#     assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
#     assigned_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return self.name
