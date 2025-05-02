from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Historico_Fija, Venta_fija
from ..user.models import Permiso, CustomUser
from rest_framework.decorators import action
from .serializers import FijaSerializer, FijaSerializerCreate, FijaSerializerUpdate
from .usecases.validations.permissions import CanCreateReadPermission, CanEditDeletePermission, SupervisorPermission

class FijaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Historico_Fija: listado y detalles.
    Solo usuarios autenticados con permisos adecuados pueden acceder.
    """
    queryset = Historico_Fija.objects.all()
    serializer_class = FijaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
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
        if self.action in ['create', 'list', 'retrieve', 'asesor_ventas']:
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

    @action(detail=False, methods=['get'], url_path='asesor')
    def asesor_ventas(self, request):
        """
        Obtiene todas las ventas asociadas al asesor logueado.
        """
        asesor_cedula = request.GET.get('asesor')
        if asesor_cedula:
            ventas = Venta_fija.objects.filter(cedula_asesor=asesor_cedula)
            serializer = self.get_serializer(ventas, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Se requiere la cédula del asesor."}, status=status.HTTP_400_BAD_REQUEST)


    def retrieve(self, request, pk=None):
        """
        Override retrieve para obtener una venta específica.
        """
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(venta)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """
        Override update para actualizar una venta específica.
        """
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        serializer = FijaSerializerUpdate(venta, data=request.data, partial=True) # Usamos un serializer diferente para la actualización
        if serializer.is_valid():
            serializer.save()
            # Opcional: Actualizar también el histórico si es necesario
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Override destroy para eliminar una venta específica.
        """
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        venta.delete()
        # Opcional: También podrías marcar el registro en el histórico como inactivo
        return Response(status=status.HTTP_204_NO_CONTENT)