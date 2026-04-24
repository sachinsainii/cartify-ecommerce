from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .serializers import SignupSerializer,LoginSerializer,LogoutSerializer
from rest_framework.permissions import IsAuthenticated,BasePermission
from rest_framework import status
from .permissions import IsAdminUserCustom

# Create your views here.

@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        data = serializer.save()
        refresh = RefreshToken.for_user(data)

        return Response({
            "message":"User Created Successfully",
            "access": data["access"],     
            "refresh": data["refresh"],},
            status=status.HTTP_201_CREATED)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response({
        "email":request.user.email
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUserCustom])
def admin_dashboard(request):
    return Response({"message":"Welcome Admin"})
    




