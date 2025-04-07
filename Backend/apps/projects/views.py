
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Project
from .serializers import ProjectSerializer
from django.db.models import Q

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .Pagination import ProjectPagination  # Import our custom pagination


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ProjectPagination 
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {
        'workspace': ['exact'],
        'status': ['exact'],
        'created_by': ['exact'],
        'members': ['exact'],
        'start_date': ['gte', 'lte', 'exact'],
        'end_date': ['gte', 'lte', 'exact'],
        'name': ['exact', 'icontains'],
    }
    ordering_fields = ['name', 'created_at', 'start_date', 'end_date', 'status']
    ordering = ['-created_at']


    def perform_create(self, serializer):
        workspace = serializer.validated_data.get('workspace')
        members = serializer.validated_data.pop('members', [])
        project = serializer.save(created_by=self.request.user)

        valid_members = workspace.members.filter(id__in=[member.id for member in members])
        project.members.set(valid_members)

    def perform_update(self, serializer):
        project = self.get_object()
        workspace = project.workspace
        members = serializer.validated_data.get('members', project.members.all())

        valid_members = workspace.members.filter(id__in=[member.id for member in members])
        serializer.save(members=valid_members)

    def get_queryset(self):
        user = self.request.user
        if user.role == "superadmin":
            return Project.objects.all()
        elif user.role == "admin":
            return Project.objects.filter(Q(created_by=user) | Q(members=user)).distinct()
        else:
            return Project.objects.filter(members=user)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Update the status of a project."""
        project = get_object_or_404(Project, pk=pk)
        new_status = request.data.get('status')

        if new_status not in [choice[0] for choice in Project.StatusChoices.choices]:
            return Response({"error": "Invalid status choice."}, status=status.HTTP_400_BAD_REQUEST)

        project.status = new_status
        project.save()
        return Response({"message": f"Project status updated to '{new_status}'"}, status=status.HTTP_200_OK)
