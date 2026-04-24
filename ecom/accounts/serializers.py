from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email','username','password']

    def create(self,validated_data):
        user = User.objects.create_user(
        email = validated_data['email'],
        username = validated_data['username'],
        password = validated_data['password']
    )
        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self,data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and Password are required")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User Not Found")

        # user = authenticate(email=email,password=password)
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid Credentials")

        # Generate JWT Token
        refresh = RefreshToken.for_user(user)

        return{
            "user":user,
            "refresh":str(refresh),
            "access":str(refresh.access_token),
        }

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self,data):
        try:
            token = RefreshToken(data['refresh'])
            token.blacklist()
        except Exception:
            raise serializers.ValidationError("Invalid Token")

        return data
