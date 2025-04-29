from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated



class RegisterView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def post(self, request):
        # Verificar si el usuario autenticado es un administrador
        if not request.user.is_staff:
            return Response({"error": "Solo los administradores pueden registrar usuarios."}, status=status.HTTP_403_FORBIDDEN)

        # Si el usuario es admin, proceder con el registro
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.validated_data['usuario']
            password = serializer.validated_data['password']
            user = authenticate(request, username=usuario, password=password)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                
                # Obtener permisos en formato de lista
                permisos = list(user.permisos.values_list('nombre', flat=True))

                return Response({
                    "token": token.key,
                    "user_id": user.id,
                    "usuario": user.usuario,
                    "nombres": user.nombres,
                    "cedula": user.cedula,
                    "permisos": permisos,
                    "estado": user.estado,
                    "nuevo": user.nuevo,
                })
            return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

