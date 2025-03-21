from django.urls import path
from .views import SignupView, SigninView, ResetPasswordRequestView, ResetPasswordView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('reset-password-request/', ResetPasswordRequestView.as_view(), name='reset-password-request'),
    path('reset-password/<int:user_id>/<str:token>/', ResetPasswordView.as_view(), name='reset-password'),
]
