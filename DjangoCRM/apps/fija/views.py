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
from django.db.models.functions import TruncDate
from datetime import datetime
import pandas as pd
from django.db.models.functions import TruncDate
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
    
    @action(detail=False, methods=['get'], url_path='reporte_excel')
    def reporte_excel(self, request):
        fecha_inicio_str = request.query_params.get('fecha_inicio')
        fecha_fin_str = request.query_params.get('fecha_fin')

        if not fecha_inicio_str or not fecha_fin_str:
            return Response(
                {"error": "Se deben proporcionar los parámetros 'fecha_inicio' y 'fecha_fin'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            fecha_inicio = datetime.strptime(fecha_inicio_str, "%Y-%m-%d").date()
            fecha_fin = datetime.strptime(fecha_fin_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"error": "El formato de las fechas debe ser YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ventas = Historico_Fija.objects.annotate(
            fecha_solo=TruncDate('fecha_registro')
        ).filter(fecha_solo__range=[fecha_inicio, fecha_fin])

        if not ventas.exists():
            return Response({"mensaje": "No se encontraron ventas en el rango especificado."}, status=204)

        df = pd.DataFrame.from_records(ventas.values())

        wb = Workbook()
        ws = wb.active
        ws.title = "Reporte Histórico de Ventas"

        for r_idx, row in enumerate(dataframe_to_rows(df, header=True, index=False)):
            ws.append(row)

        output = BytesIO()
        wb.save(output)
        output.seek(0)

        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="reporte_historico_{fecha_inicio_str}_a_{fecha_fin_str}.xlsx"'

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

    def update(self, request, pk=None):
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        serializer = FijaSerializerUpdate(venta, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        queryset = Venta_fija.objects.all()
        venta = get_object_or_404(queryset, pk=pk)
        venta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)