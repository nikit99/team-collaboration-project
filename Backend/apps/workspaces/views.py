# from rest_framework import generics, permissions
# from rest_framework.response import Response
# from .models import Workspace
# from .serializers import WorkspaceSerializer
# from apps.auth_app.models import User

# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import TokenAuthentication

# from rest_framework.exceptions import PermissionDenied


# class WorkspaceListCreateView(generics.ListCreateAPIView):
#     serializer_class = WorkspaceSerializer
#     authentication_classes = [TokenAuthentication]  # Ensure authentication
#     permission_classes = [IsAuthenticated]  # Require login

#     def get_queryset(self):
#         # Only show workspaces owned by the logged-in user
#         return Workspace.objects.filter(owner=self.request.user)

#     def perform_create(self, serializer):
#         # Ensure only admins can create a workspace
#         # if self.request.user.role != 'admin':
#         if self.request.user.role not in ['admin', 'superadmin']:

#             raise PermissionDenied("Only admins can create workspaces")
#         serializer.save(owner=self.request.user)  # Set owner as logged-in admin

# class WorkspaceDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Workspace.objects.all()
#     serializer_class = WorkspaceSerializer

#     def perform_update(self, serializer):
#         # Ensure only the owner (admin) can update the workspace
#         if self.request.user != self.get_object().owner:
#             return Response({"error": "Only the owner can update this workspace"}, status=403)
#         serializer.save()
    
#     def perform_destroy(self, instance):
#         # Ensure only the owner can delete the workspace
#         if self.request.user != instance.owner:
#             return Response({"error": "Only the owner can delete this workspace"}, status=403)
#         instance.delete()

   


# # Explanation:

# # WorkspaceListCreateView: Allows admins to create a workspace and users to view all workspaces.
# # WorkspaceDetailView: Allows only the workspace owner to edit/delete the workspace.

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Workspace
from .serializers import WorkspaceSerializer
from apps.auth_app.models import User
from django.db import models  # Add this import
from django.db.models import Q  # Import this



# class WorkspaceListCreateView(generics.ListCreateAPIView):
#     serializer_class = WorkspaceSerializer
#     authentication_classes = [TokenAuthentication]  # Ensure authentication
#     permission_classes = [IsAuthenticated]  # Require login

#     def get_queryset(self):
#         """
#         - Superadmin: Retrieve all workspaces.
#         - Other users: Retrieve only their own workspaces.
#         """
#         if self.request.user.role == "superadmin":
#             return Workspace.objects.all()  # Superadmin gets all workspaces
#         return Workspace.objects.filter(owner=self.request.user)  # Others get their own workspaces

#     def perform_create(self, serializer):
#         """
#         - Only admin and superadmin can create a workspace.
#         """
#         if self.request.user.role not in ["admin", "superadmin"]:
#             raise PermissionDenied("Only admins can create workspaces")
#         serializer.save(owner=self.request.user)  # Set owner as the logged-in admin

class WorkspaceListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkspaceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):
        """
        - Superadmin: Retrieve all workspaces.
        - Admins: Retrieve workspaces they created or are members of.
        - Users: Retrieve workspaces they are members of.
        """
        user = self.request.user
        
        if user.role == "superadmin":
            return Workspace.objects.all()  # Superadmin gets all workspaces
        
        return Workspace.objects.filter(Q(owner=user) | Q(members=user)).distinct()

        
    def perform_create(self, serializer):
        """
        - Only admin and superadmin can create a workspace.
        """
        if self.request.user.role not in ["admin", "superadmin"]:
            raise PermissionDenied("Only admins can create workspaces")
        serializer.save(owner=self.request.user)  # Set owner as the logged-in admin


# class WorkspaceDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = WorkspaceSerializer
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         """
#         - Superadmin: Can view/edit/delete all workspaces.
#         - Others: Can only view/edit/delete their own workspaces.
#         """
#         if self.request.user.role == "superadmin":
#             return Workspace.objects.all()  # Superadmin gets all workspaces
#         return Workspace.objects.filter(owner=self.request.user)  # Others get only their workspaces

#     def perform_update(self, serializer):
#         """
#         - Superadmin: Can edit any workspace.
#         - Owner: Can edit their own workspace.
#         """
#         workspace = self.get_object()
#         if self.request.user != workspace.owner and self.request.user.role != "superadmin":
#             raise PermissionDenied("Only the owner or superadmin can update this workspace")
#         serializer.save()

        
class WorkspaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkspaceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        - Superadmin: Can view/edit/delete all workspaces.
        - Admins: Can view workspaces they own or are members of.
        - Users: Can only view workspaces they are members of.
        """
        user = self.request.user
        
        if user.role == "superadmin":
            return Workspace.objects.all()  # Superadmin gets all workspaces
        
        return Workspace.objects.filter(Q(owner=user) | Q(members=user)).distinct()

    "Get all workspaces where owner = user OR user is in members."

    def perform_update(self, serializer):
        """
        - Superadmin: Can edit any workspace.
        - Owner: Can edit their own workspace.
        - Members: Cannot edit.
        """
        workspace = self.get_object()
        if self.request.user != workspace.owner and self.request.user.role != "superadmin":
            raise PermissionDenied("Only the owner or superadmin can update this workspace")
        serializer.save()

    def perform_destroy(self, instance):
        """
        - Superadmin: Can delete any workspace.
        - Owner: Can delete their own workspace.
        - Members: Cannot delete.
        """
        if self.request.user != instance.owner and self.request.user.role != "superadmin":
            raise PermissionDenied("Only the owner or superadmin can delete this workspace")
        instance.delete()


    def perform_destroy(self, instance):
        """
        - Superadmin: Can delete any workspace.
        - Owner: Can delete their own workspace.
        """
        if self.request.user != instance.owner and self.request.user.role != "superadmin":
            raise PermissionDenied("Only the owner or superadmin can delete this workspace")
        instance.delete()
