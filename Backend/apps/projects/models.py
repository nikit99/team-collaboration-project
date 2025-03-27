from django.db import models
from apps.workspaces.models import Workspace
from apps.auth_app.models import User
from django.core.exceptions import ValidationError

class Project(models.Model):
    class StatusChoices(models.TextChoices):
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="projects")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_projects")
    members = models.ManyToManyField(User, related_name="project_memberships", blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.IN_PROGRESS
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Validate before saving to remove invalid members."""
        self.clean()  # Run validation
        super().save(*args, **kwargs)

    def add_member(self, user):
        """Allow adding only workspace members to the project."""
        if user in self.workspace.members.all():
            self.members.add(user)
        else:
            raise ValidationError(f"User {user.email} is not a member of workspace '{self.workspace.name}'")

    def remove_member(self, user):
        """Remove a member from the project."""
        self.members.remove(user)
