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
from io import BytesIO
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
from django.http import HttpResponse
from datetime import datetime
import pandas as pd
from django.utils.timezone import make_naive

class FijaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Historico_Fija: listado y detalles.
    Solo usuarios autenticados con permisos adecuados pueden acceder.
    """
    queryset = Historico_Fija.objects.all()
    serializer_class = FijaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'reporte_excel']:
            perms = [IsAuthenticated, CanCreateReadPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            perms = [IsAuthenticated, CanEditDeletePermission]
        else:
            perms = [IsAuthenticated]
        return [perm() for perm in perms]
    from django.db.models.functions import TruncDate
    

class FijaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Historico_Fija: listado y detalles.
    Solo usuarios autenticados con permisos adecuados pueden acceder.
    """
    queryset = Historico_Fija.objects.all()
    serializer_class = FijaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'reporte_excel']:
            perms = [IsAuthenticated, CanCreateReadPermission]
        elif self.action in ['update', 'partial_update', 'destroy']:
            perms = [IsAuthenticated, CanEditDeletePermission]
        else:
            perms = [IsAuthenticated]
        return [perm() for perm in perms]
    from django.db.models.functions import TruncDate

    @action(detail=False, methods=['get'], url_path='reporte_excel')
    def reporte_excel(self, request):
        # Paso 1: Obtener las fechas desde los parámetros de la URL
        fecha_inicio_str = request.query_params.get('fecha_inicio')
        fecha_fin_str = request.query_params.get('fecha_fin')

        # Comprobar si se proporcionaron las fechas
        if not fecha_inicio_str or not fecha_fin_str:
            print("Error: Faltan parámetros 'fecha_inicio' y/o 'fecha_fin'.")
            return Response(
                {"error": "Se deben proporcionar los parámetros 'fecha_inicio' y 'fecha_fin'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convertir las fechas de string a objeto datetime
        try:
            print(f"Convirtiendo fechas: {fecha_inicio_str} a datetime y {fecha_fin_str} a datetime.")
            fecha_inicio = datetime.strptime(fecha_inicio_str, "%Y-%m-%d").date()
            fecha_fin = datetime.strptime(fecha_fin_str, "%Y-%m-%d").date()
        except ValueError:
            print("Error: El formato de las fechas debe ser YYYY-MM-DD.")
            return Response(
                {"error": "El formato de las fechas debe ser YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Paso 2: Filtrar los registros de ventas entre las fechas proporcionadas
        print(f"Filtrando ventas entre {fecha_inicio} y {fecha_fin}.")
        ventas = Historico_Fija.objects.filter(
            fecha_registro__range=[fecha_inicio, fecha_fin]
        )

        if not ventas.exists():
            print("No se encontraron ventas en el rango especificado.")
            return Response({"mensaje": "No se encontraron ventas en el rango especificado."}, status=204)

        # Paso 3: Preparar los datos para el archivo Excel
        print(f"Se encontraron {ventas.count()} ventas en el rango especificado.")
        # Aseguramos que todas las fechas estén en formato naive y las convertimos a string
        for venta in ventas:
            if venta.fecha_registro:
                # Eliminar tzinfo si existe
                if venta.fecha_registro.tzinfo:
                    print(f"Eliminando tzinfo de la fecha: {venta.fecha_registro}")
                    venta.fecha_registro = venta.fecha_registro.replace(tzinfo=None)
                # Convertir la fecha a formato string para evitar problemas con Excel
                venta.fecha_registro = venta.fecha_registro.strftime('%Y-%m-%d %H:%M:%S')

        # Crear un DataFrame de pandas a partir de los registros de ventas
        print("Convirtiendo los registros de ventas a un DataFrame de pandas.")

        # Convertir todos los atributos de las ventas a string antes de pasarlos a DataFrame
        ventas_como_strings = [
            {field.name: str(getattr(venta, field.name)) for field in venta._meta.get_fields() if not field.auto_created and field.name != 'id' and getattr(venta, field.name) is not None}
            for venta in ventas
        ]

        print(ventas_como_strings)  # Imprimir valores convertidos a strings
        df = pd.DataFrame(ventas_como_strings)
        df



        # Paso 4: Crear el archivo Excel
        print("Creando el archivo Excel.")
        wb = Workbook()
        ws = wb.active
        ws.title = "Reporte Histórico de Ventas"

        # Paso 5: Escribir los datos del DataFrame en el archivo Excel
        print("Escribiendo los datos en el archivo Excel.")
        for r_idx, row in enumerate(dataframe_to_rows(df, header=True, index=False)):
            ws.append(row)

        # Guardar el archivo Excel en memoria
        print("Guardando el archivo Excel en memoria.")
        output = BytesIO()
        wb.save(output)
        output.seek(0)

        # Paso 6: Crear la respuesta HTTP para descargar el archivo Excel
        print("Preparando la respuesta para descargar el archivo Excel.")
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="reporte_historico_{fecha_inicio_str}_a_{fecha_fin_str}.xlsx"'

        print("El archivo Excel está listo para descargarse.")
        return response
class FijaViewSetCreate(viewsets.ModelViewSet):
    """
    ViewSet para Venta_fija: creación y CRUD de ventas.
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
        serializer.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='asesor')
    def asesor_ventas(self, request):
        asesor_cedula = request.GET.get('asesor')
        if asesor_cedula:
            ventas = Venta_fija.objects.filter(cedula_asesor=asesor_cedula)
            serializer = self.get_serializer(ventas, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Se requiere la cédula del asesor."}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(venta)
        return Response(serializer.data)

    def update(self, request, pk=None, partial=False):
        print(request.data)
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        serializer = FijaSerializerUpdate(venta, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        venta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)