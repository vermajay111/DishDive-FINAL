from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from django.contrib.auth.models import User
from .models import UserCustomization
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    refresh_token = request.data['refresh']
    if not refresh_token:
        return Response({"error": "refresh_token is required"})
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"info": "logged out successfully"})
    except Exception as e:
        return Response({"error": str(e)})

@api_view(['POST'])
def dashboardContent(request):
    user_dishes = UserCustomization.objects.all().filter(user=request.user).first().user_dishes.all()
    return Response({"dishes": user_dishes})

@api_view(['POST'])
def save_ai_dish(request):
    pass
    

