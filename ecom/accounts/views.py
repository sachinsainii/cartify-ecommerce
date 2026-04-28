from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .serializers import SignupSerializer,LoginSerializer,LogoutSerializer,ProfileSerializer
from rest_framework.permissions import IsAuthenticated,BasePermission,AllowAny
from rest_framework import status
from .permissions import IsAdminUserCustom
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully",
            "user": {
                "email": user.email,
                "username": user.username
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=201)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # serializer = LoginSerializer(data=request.data)
    serializer = LoginSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        return Response({
            "message":"Login Successful",
            "access":serializer.validated_data["access"],
            "refresh":serializer.validated_data["refresh"],
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    serializer = LogoutSerializer(data=request.data)

    if serializer.is_valid():
        return Response({"message":"Logged out successfully"})

    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    if request.method == 'GET':
        serializer = ProfileSerializer(user)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUserCustom])
def admin_dashboard(request):
    return Response({"message":"Welcome Admin"})
    




