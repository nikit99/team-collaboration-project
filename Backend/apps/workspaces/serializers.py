from rest_framework import serializers
from .models import Workspace
from apps.auth_app.models import User

# class WorkspaceSerializer(serializers.ModelSerializer):
#     owner = serializers.ReadOnlyField(source='owner.email')  # Show owner email
#     members = serializers.SerializerMethodField()  # Get detailed user data

#     class Meta:
#         model = Workspace
#         fields = ['id', 'name', 'description', 'owner', 'members', 'created_at']

#     def get_members(self, obj):
#         """Return members with id, name, and email."""
#         return [{"id": member.id, "name": member.name, "email": member.email} for member in obj.members.all()]


class WorkspaceSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')  # Show owner email
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'description', 'owner', 'members', 'created_at']

