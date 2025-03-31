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


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Automatically assign the project owner as the task owner."""
        project = serializer.validated_data['project']
        if not (self.request.user == project.created_by or self.request.user.role == "superadmin"):
            raise PermissionDenied("Only the project owner or superadmin can create tasks.")

        task = serializer.save(owner=project.created_by)

    def get_queryset(self):
        user = self.request.user

        if user.role == "superadmin":
            return Task.objects.all()  # Superadmin sees all tasks

         # Get tasks where the user is the owner OR a member
        owner_tasks = Task.objects.filter(owner=user)
        member_tasks = Task.objects.filter(members=user)

        # Ensure both queries have the same uniqueness condition
        return (owner_tasks | member_tasks).distinct()

    def update(self, request, *args, **kwargs):
        """Handles editing (updating) a task"""
        task = self.get_object()

        # Only owner or superadmin can edit the task
        if request.user != task.owner and request.user.role != "superadmin":
            return Response({"error": "You do not have permission to edit this task."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(task, data=request.data, partial=True)  # partial=True allows updating specific fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Handles deleting a task"""
        task = self.get_object()

        # Only owner or superadmin can delete the task
        if request.user != task.owner and request.user.role != "superadmin":
            return Response({"error": "You do not have permission to delete this task."}, status=status.HTTP_403_FORBIDDEN)

        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["PATCH"])
    def change_status(self, request, pk=None):
        """Handles changing the status of a task"""
        task = get_object_or_404(Task, pk=pk)

        # Only owner or superadmin can change the status
        if request.user != task.owner and request.user.role != "superadmin" and request.user not in task.members.all():
            return Response({"error": "You do not have permission to change the task status."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in dict(Task.StatusChoices.choices):
            return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        task.save()
        return Response({"message": "Task status updated", "status": task.status}, status=status.HTTP_200_OK)