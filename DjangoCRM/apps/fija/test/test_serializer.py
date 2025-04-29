from apps.fija.models import Historico_Fija
from apps.fija.serializers import FijaSerializer
import pytest


@pytest.mark.django_db
def test_historico_fija_serializer_valid():
    data = {
        "id_venta": 1,
        "cedula_asesor": "12345",
        "nombre_asesor": "Juan Pérez",
        "correspondencia_electronica": True,
        "telefono_1": "3000000001",
        "telefono_2": "3000000002",
        "telefono_grabacion_contrato": "3000000003",
        "direccion_rr": "Calle 123",
        "nombre_conjunto": None,
        "barrio": "Centro",
        "ciudad": "Bogotá",
        "departamento": "Cundinamarca",
        "comunidad": "Comunidad 1",
        "nodo": "Nodo 1",
        "estrato": "3",
        "venta": "Venta 1",
        "tipo_gestion": "Gestión 1",
        "servicio": "Servicio 1",
        "deco_adicional": "Deco 1",
        "campana": "Campaña 1",
        "adicionales": "Adicionales 1",
        "codigo_tarifa": "Tarifa 1",
        "ptar": "PTAR 1",
        "nombre_paquete_adquirido": "Paquete 1",
        "renta_mensual": "100000",
        "todo_claro": "Sí",
        "persona_recibe_instalacion": "Persona 1",
        "observacion": None,
        "link": None,
        "link2": None,
        "link3": None,
        "estado": "Activo",
        "usuario_modificado": "Usuario 1",
        "link_autorizacion": "http://example.com/autorizacion"
    }
    serializer = FijaSerializer(data=data)
    assert serializer.is_valid(), serializer.errors