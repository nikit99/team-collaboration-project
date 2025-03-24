from django.urls import path
from .views import SignupView, SigninView, ResetPasswordRequestView, ResetPasswordView, UserListView, GetUserByIdView, ChangeUserRoleView, EditUserView, DeleteUserView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('reset-password-request/', ResetPasswordRequestView.as_view(), name='reset-password-request'),
    path('reset-password/<int:user_id>/<str:token>/', ResetPasswordView.as_view(), name='reset-password'),
    # path('users/', UserListView.as_view(), name='user-list'),  # New endpoint for fetching users,
    path('users/', UserListView.as_view(), name='user-list'),  # ✅ Public API (No authentication required)
    path('users/<int:user_id>/', GetUserByIdView.as_view(), name='get-user-by-id'),

     path('change-role/<int:user_id>/', ChangeUserRoleView.as_view(), name='change_user_role'),

      path('users/<int:user_id>/edit/', EditUserView.as_view(), name='edit-user'),
    path('users/<int:user_id>/delete/', DeleteUserView.as_view(), name='delete-user'),
]
