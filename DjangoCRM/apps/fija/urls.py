from rest_framework.routers import DefaultRouter
from apps.fija.views import FijaViewSet, FijaViewSetCreate

router = DefaultRouter()
router.register(r'historico_fija', FijaViewSet, basename='fija')
router.register(r'venta_fija', FijaViewSetCreate, basename='venta_fija')

urlpatterns = router.urls