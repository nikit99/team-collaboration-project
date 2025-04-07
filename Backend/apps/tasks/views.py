from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Task
from .serializers import TaskSerializer
from apps.projects.models import Project
from django.db.models import Q
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .Pagination import TaskPagination  

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TaskPagination  # Use our custom pagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {
        'project': ['exact'],
        'project__workspace': ['exact'],
        'project__name': ['exact', 'icontains'],
        'status': ['exact'],
        'owner': ['exact'],
        'due_date': ['gte', 'lte', 'exact'],
        'members': ['exact'],
        'name': ['exact', 'icontains']
    }
    ordering_fields = ['name', 'due_date', 'created_at', 'status', 'project__name', 'project__workspace__name']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user

        if user.role == "superadmin":
            return Task.objects.all()

        owner_tasks = Task.objects.filter(owner=user)
        member_tasks = Task.objects.filter(members=user)
        return (owner_tasks | member_tasks).distinct()

    def update(self, request, *args, **kwargs):
        task = self.get_object()

        if request.user != task.owner and request.user.role != "superadmin":
            return Response({"error": "You do not have permission to edit this task."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(task, data=request.data, partial=True)  # partial=True allows updating specific fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()

        if request.user != task.owner and request.user.role != "superadmin":
            return Response({"error": "You do not have permission to delete this task."}, status=status.HTTP_403_FORBIDDEN)

        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["PATCH"])
    def change_status(self, request, pk=None):
        task = get_object_or_404(Task, pk=pk)

        if request.user != task.owner and request.user.role != "superadmin" and request.user not in task.members.all():
            return Response({"error": "You do not have permission to change the task status."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in dict(Task.StatusChoices.choices):
            return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        task.save()
        return Response({"message": "Task status updated", "status": task.status}, status=status.HTTP_200_OK)