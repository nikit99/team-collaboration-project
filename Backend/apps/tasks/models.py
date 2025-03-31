# from django.db import models
# from apps.projects.models import Project
# from apps.auth_app.models import User
# from django.core.exceptions import ValidationError

# class Task(models.Model):
#     class StatusChoices(models.TextChoices):
#         TODO = 'to_do', 'To Do'
#         IN_PROGRESS = 'in_progress', 'In Progress'
#         COMPLETED = 'completed', 'Completed'

#     name = models.CharField(max_length=255, unique=True)
#     description = models.TextField(blank=True, null=True)
#     project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
#     owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_tasks")  # Owner = Project Owner
#     members = models.ManyToManyField(User, related_name="task_memberships", blank=True)  # Members must be project members
#     status = models.CharField(
#         max_length=20,
#         choices=StatusChoices.choices,
#         default=StatusChoices.TODO
#     )
#     start_date = models.DateField(null=True, blank=True)
#     due_date = models.DateField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name

#     def clean(self):
#         """Ensure the owner is the project owner and members belong to the project."""
#         if self.owner != self.project.created_by:
#             raise ValidationError("Task owner must be the owner of the project.")

#         for member in self.members.all():
#             if member not in self.project.members.all():
#                 raise ValidationError(f"User {member.email} is not a member of the project.")

#     def save(self, *args, **kwargs):
#         """Validate before saving."""
#         self.clean()
#         super().save(*args, **kwargs)

#     def add_member(self, user):
#         """Allow adding only project members to the task. Superadmin can be added automatically."""
#         if user in self.project.members.all() or user.role == "superadmin":
#             self.members.add(user)
#         else:
#             raise ValidationError(f"User {user.email} is not a member of the project.")

#     def remove_member(self, user):
#         """Remove a member from the task."""
#         self.members.remove(user)

#     def is_editable_by(self, user):
#         """Check if the user has permission to edit the task (Owner or Superadmin)."""
#         return user == self.owner or user.role == "superadmin"
from django.db import models
from apps.projects.models import Project
from apps.auth_app.models import User
from django.core.exceptions import ValidationError

class Task(models.Model):
    class StatusChoices(models.TextChoices):
        TODO = 'to_do', 'To Do'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_tasks")  # Owner = Project Owner
    members = models.ManyToManyField(User, related_name="task_memberships", blank=True)  # Members must be project members
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.TODO
    )
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def clean(self):
        """Ensure the owner is the project owner."""
        if self.owner != self.project.created_by and self.owner.role != "superadmin":
            raise ValidationError("Task owner must be the owner of the project.")

    def save(self, *args, **kwargs):
        """Validate before saving."""
        self.clean()
        super().save(*args, **kwargs)

    def add_member(self, user):
        """Allow adding only project members to the task."""
        if user in self.project.members.all() or user.role == "superadmin":
            self.members.add(user)
        else:
            raise ValidationError(f"User {user.email} is not a member of the project.")

    def remove_member(self, user):
        """Remove a member from the task."""
        self.members.remove(user)

    def is_editable_by(self, user):
        """Check if the user has permission to edit the task (Owner or Superadmin)."""
        return user == self.owner or user.role == "superadmin"
