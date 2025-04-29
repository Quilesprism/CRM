from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
# Nuevo modelo de Permiso personalizado
class Permiso(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

# Custom Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, usuario, password=None, **extra_fields):
        if not usuario:
            raise ValueError('El nombre de usuario es obligatorio')
        user = self.model(usuario=usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True')

        return self.create_user(usuario, password, **extra_fields)

# Modelo de usuario personalizado
class CustomUser(AbstractBaseUser, PermissionsMixin):
    nombres = models.CharField(max_length=100, null=True)
    cedula = models.CharField(max_length=20, unique=True, null=True)
    usuario = models.CharField(max_length=50, unique=True, null=True)
    fecha_registro = models.DateTimeField(default=timezone.now, null=True)
    estado = models.BooleanField(default=True,null=True)  # 1 = activo, 0 = inactivo
    nuevo = models.BooleanField(default=True, null=True)   # 1 = ya ingreso, 0 = nuevo

    permisos = models.ManyToManyField(Permiso, blank=True, null=True)  # Relación avanzada de permisos

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'usuario'
    REQUIRED_FIELDS = ['nombres', 'cedula']

    def __str__(self):
        return self.usuario
