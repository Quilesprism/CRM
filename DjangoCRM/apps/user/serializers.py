from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('nombres', 'cedula', 'usuario', 'password', 'estado', 'nuevo', 'permisos', 'is_staff')
        extra_kwargs = {
            'estado': {'default': True},
            'nuevo': {'default': True},
            'is_staff': {'default': False},
        }

    def create(self, validated_data):
        permisos = validated_data.pop('permisos', [12])  # Si no se pasa permisos, asignar [12] por defecto
        password = validated_data.pop('password')
        is_staff = validated_data.pop('is_staff', False)  # Establecemos is_staff si se pasa

        # Crear el usuario
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.is_staff = is_staff
        user.save()

        # Si el usuario es administrador, asignamos todos los permisos
        if user.is_staff:
            # Asigna todos los permisos disponibles para admin
            permisos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        else:
            # Asigna solo el permiso 12 para un usuario no admin
            if not permisos:  # Si no se pasa un permiso, asignamos el 12 por defecto
                permisos = [12]

        user.permisos.set(permisos)  # Establece los permisos correctamente
        return user

class LoginSerializer(serializers.Serializer):
    usuario = serializers.CharField()
    password = serializers.CharField()
