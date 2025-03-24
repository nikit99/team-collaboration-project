from django.urls import path
from .views import WorkspaceListCreateView, WorkspaceDetailView

urlpatterns = [
    path('', WorkspaceListCreateView.as_view(), name="workspace-list-create"),
    path('<int:pk>/', WorkspaceDetailView.as_view(), name="workspace-detail"),
]

# add
# path('workspaces/', include('apps.workspaces.urls')),  # Include workspace routes