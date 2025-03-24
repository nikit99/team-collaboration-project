from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model 

from django.contrib.auth.hashers import check_password, make_password  

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from rest_framework.permissions import AllowAny


User = get_user_model()
# class SignupView(APIView):
#     permission_classes = [AllowAny]  # 🔹 No token required to signup
#     def post(self, request):
       
#         email = request.data.get('email')

#         if User.objects.filter(email=email).exists():
#             return Response({'error': 'User with this email already exists!'}, status=status.HTTP_400_BAD_REQUEST)

#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()

            
#             authenticated_user = authenticate(username=email, password=request.data.get('password'))
#             if authenticated_user:
#                 login(request, authenticated_user)
#                 token, _ = Token.objects.get_or_create(user=authenticated_user)

#                 return Response({
#                     'message': 'User created and logged in successfully',
#                     'token': token.key,
#                     'user': {
#                         'id': user.id,
#                         'email': user.email,
#                         'name': user.name,
#                     }
#                 }, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SignupView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        email = request.data.get('email')

        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists!'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()  # Copy request data
        data.pop('role', None)  # Remove role from request data if present

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()

            authenticated_user = authenticate(username=email, password=request.data.get('password'))
            if authenticated_user:
                login(request, authenticated_user)
                token, _ = Token.objects.get_or_create(user=authenticated_user)

                return Response({
                    'message': 'User created and logged in successfully',
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'role': user.role,
                    }
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class SigninView(APIView):

    permission_classes = [AllowAny]  # 🔹 No token required to signup
    def post(self, request):

        
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
        "message": "Login successful",
        "token": token.key,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role":user.role,
        }
    }, status=status.HTTP_200_OK)



class ResetPasswordRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{user.pk}/{token}/"

        send_mail(
            "Password Reset Request",
            f"Click the link below to reset your password:\n{reset_url}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent to your email"}, status=status.HTTP_200_OK)
    


class ResetPasswordView(APIView):
    def post(self, request, user_id, token):
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not password or not confirm_password:
            return Response({"error": "Both password fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(password)
        user.save()

        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    

class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Requires authentication

class GetUserByIdView(APIView):
    permission_classes = [AllowAny]  # No authentication required

    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class ChangeUserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.role != 'superadmin':
            return Response({"error": "You do not have permission to change roles"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        new_role = request.data.get('role')
        if new_role not in ['admin', 'user', 'superadmin']:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = new_role
        user.save()

        return Response({"message": f"User role updated to {new_role}"}, status=status.HTTP_200_OK)


class EditUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, user_id):
        if request.user.role not in ['superadmin', 'admin']:
            return Response({"error": "You do not have permission to edit users"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.name = request.data.get("name", user.name)
        user.email = request.data.get("email", user.email)
        user.role = request.data.get("role", user.role)

        user.save()

        return Response({
            "message": "User updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        if request.user.role not in ['superadmin', 'admin']:
            return Response({"error": "You do not have permission to delete users"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()

        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)