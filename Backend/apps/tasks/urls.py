from django.urls import path
from .views import TaskViewSet

urlpatterns = [
    path('', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list-create'),
    path('<int:pk>/', TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='task-detail'),

    # path('', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list-create'),
    # path('<int:pk>/', TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='task-detail'),
    path('<int:pk>/change_status/', TaskViewSet.as_view({'patch': 'change_status'}), name='change-task-status'),
]
