from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Historico_Fija, Venta_fija
from ..user.models import Permiso
from .serializers import FijaSerializer, FijaSerializerCreate
from .usecases.validations.permissions import CanCreateReadPermission, CanEditDeletePermission, SupervisorPermission

class FijaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Historico_Fija: listado y detalles.
    Solo usuarios autenticados con permisos adecuados pueden acceder.
    """
    queryset = Historico_Fija.objects.all()
    serializer_class = FijaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            perms = [IsAuthenticated, CanCreateReadPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            perms = [IsAuthenticated, CanEditDeletePermission]
        else:
            perms = [IsAuthenticated]
        return [perm() for perm in perms]

class FijaViewSetCreate(viewsets.ModelViewSet):
    """
    ViewSet para Venta_fija: creación y CRUD de ventas.
    Los registros también se copian a Historico_Fija al crear.
    """
    queryset = Venta_fija.objects.all()
    serializer_class = FijaSerializerCreate

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            perms = [IsAuthenticated, CanCreateReadPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            perms = [IsAuthenticated, CanEditDeletePermission]
        else:
            perms = [IsAuthenticated]
        return [perm() for perm in perms]

    def perform_create(self, serializer):
        # Guardar en venta fija
        venta_instance = serializer.save()

        # Construir datos para historial excluyendo campos automáticos
        venta_data = {
            field.name: getattr(venta_instance, field.name)
            for field in venta_instance._meta.fields
            if field.name not in ['fecha_registro', 'ultima_modificacion']
        }

        # Serializar y guardar en historico
        historico_serializer = FijaSerializer(data=venta_data)
        historico_serializer.is_valid(raise_exception=True)
        historico_serializer.save()

    def create(self, request, *args, **kwargs):
        """
        Override create para devolver ambos registros si es necesario.
        """
        response = super().create(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_201_CREATED)
