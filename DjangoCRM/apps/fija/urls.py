from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.fija.views import FijaViewSet, FijaViewSetCreate

router = DefaultRouter()
router.register(r'historico_fija', FijaViewSet, basename='historico_fija')
router.register(r'venta_fija', FijaViewSetCreate, basename='venta_fija')

urlpatterns = [
    path('', include(router.urls)),
    path('historico_fija/reporte_excel/', FijaViewSet.as_view({'get': 'reporte_excel'}), name='reporte_historico_excel'),
    path('venta_fija/asesor/', FijaViewSetCreate.as_view({'get': 'asesor_ventas'}), name='venta_fija_asesor'),
    path('venta_fija/<int:pk>/', FijaViewSetCreate.as_view({'get': 'retrieve'}), name='detalle_venta_fija'),
]