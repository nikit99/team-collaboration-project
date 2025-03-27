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


class WorkspaceListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkspaceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):
       
        user = self.request.user
        
        if user.role == "superadmin":
            return Workspace.objects.all()  
        elif user.role == "admin":
            return Workspace.objects.filter(Q(owner=user) | Q(members=user)).distinct()
        else:  # Regular user
            return Workspace.objects.filter(members=user)
      


        
    def perform_create(self, serializer):
       
        if self.request.user.role not in ["admin", "superadmin"]:
            raise PermissionDenied("Only admins can create workspaces")
        serializer.save(owner=self.request.user)  # Set owner as the logged-in admin

        
class WorkspaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkspaceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
      
        user = self.request.user
        print({user})
        print({self})
        
        if user.role == "superadmin":
            return Workspace.objects.all()  
        
        return Workspace.objects.filter(Q(owner=user) | Q(members=user)).distinct()
        # user = self.request.user

        # if user.role == "superadmin":
        #     print(f"this is superadmin: {user}")
        #     return Workspace.objects.all()
        # elif user.role == "admin":
        #     print(f"this is admin: {user}")
        #     workspaces = Workspace.objects.filter(Q(owner=user) | Q(members=user)).distinct()
        # else:  # Regular user
        #     workspaces = Workspace.objects.filter(members=user)

        # # Log the members of each workspace before returning
        # for workspace in workspaces:
        #     print(f"Workspace: {workspace.id}, {user}, Members: {[member.id for member in workspace.members.all()]}")

        # return workspaces

 
    def perform_update(self, serializer):
      
        workspace = self.get_object()
        if self.request.user != workspace.owner and self.request.user.role != "superadmin":
            raise PermissionDenied("Only the owner or superadmin can update this workspace")
        serializer.save()

    def perform_destroy(self, instance):
      
        if self.request.user != instance.owner and self.request.user.role != "superadmin":
            raise PermissionDenied("Only the owner or superadmin can delete this workspace")
        instance.delete()


    def perform_destroy(self, instance):
      
        if self.request.user != instance.owner and self.request.user.role != "superadmin":
            raise PermissionDenied("Only the owner or superadmin can delete this workspace")
        instance.delete()
