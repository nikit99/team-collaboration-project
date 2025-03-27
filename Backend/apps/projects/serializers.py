
from rest_framework import serializers
from .models import Project
from apps.auth_app.models import User

class ProjectSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.name')
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    status = serializers.ChoiceField(choices=Project.StatusChoices.choices, default=Project.StatusChoices.IN_PROGRESS)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'workspace', 'created_by', 'members', 'created_at', 'start_date', 'end_date', 'status']
