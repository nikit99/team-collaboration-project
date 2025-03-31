from rest_framework import serializers
from .models import Task
from apps.auth_app.models import User
from apps.projects.models import Project


class TaskSerializer(serializers.ModelSerializer):
    # owner = serializers.HiddenField(default=serializers.CurrentUserDefault())  # Auto-assign logged-in user
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    project_name = serializers.CharField(source="project.name", read_only=True)
    workspace_id = serializers.IntegerField(source="project.workspace.id", read_only=True)
    workspace_name = serializers.CharField(source="project.workspace.name", read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

    def validate_project(self, project):
        """Ensure only the project owner (or superadmin) can create a task."""
        request_user = self.context['request'].user  # Get the logged-in user

        if request_user.role == "superadmin":
            return project  # Superadmin can create tasks in any project

        if project.created_by != request_user:
            print(project.created_by)
            print(request_user)
            raise serializers.ValidationError("You do not have permission to create tasks in this project.")

        return project

    def validate_members(self, members):
        """Ensure all members belong to the project."""
        project = self.initial_data.get('project')

        try:
            project = Project.objects.get(id=project)
        except Project.DoesNotExist:
            raise serializers.ValidationError("Project does not exist.")

        for member in members:
            if member not in project.members.all():
                raise serializers.ValidationError(f"User {member.email} is not a member of the project.")

        return members

    def create(self, validated_data):
        """Ensure the owner is set to the logged-in user automatically."""
        validated_data['owner'] = self.context['request'].user  # Set owner as the logged-in user
        return super().create(validated_data)
