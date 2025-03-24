from django.db import models
from apps.auth_app.models import User

class Workspace(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_workspaces")
    members = models.ManyToManyField(User, related_name="workspaces", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name











# Step 1: Define the Workspace Model
# We need to create a new Django app for workspace management.

# 1️⃣ Create a New App for Workspaces
# Run the following command:   

# 📌 Step 2: Define the Workspace Model (workspaces/models.py)
# Now, let’s define a Workspace model where:

# A workspace is created by an admin.
# A workspace can have multiple users (Many-to-Many relation with User).

# 📝 Explanation:

# owner: A ForeignKey to User, meaning each workspace is owned by one admin.
# members: A ManyToManyField to User, meaning a workspace can have multiple members.
# created_at: Stores the creation date of the workspace.
