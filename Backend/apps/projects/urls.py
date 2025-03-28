from django.urls import path
from .views import ProjectViewSet

urlpatterns = [
    path('', ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), name='project-list-create'),
    path('<int:pk>/', ProjectViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='project-detail'),
    path('<int:pk>/remove-member/<int:user_id>/', ProjectViewSet.as_view({'delete': 'remove_member'}), name='project-remove-member'),
    path('<int:pk>/update-status/', ProjectViewSet.as_view({'patch': 'update_status'}), name='project-update-status'),
]
