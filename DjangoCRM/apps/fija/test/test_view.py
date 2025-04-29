import pytest
from rest_framework.test import APIClient
from apps.fija.models import Historico_Fija
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io

def create_test_image(name="test.png"):
    image = Image.new("RGB", (100, 100), color="red")
    byte_io = io.BytesIO()
    image.save(byte_io, "PNG")
    byte_io.seek(0)
    return SimpleUploadedFile(name, byte_io.read(), content_type="image/png")

@pytest.mark.django_db
def test_create_historico_fija():
    client = APIClient()
    file1 = create_test_image("image1.png")
    file2 = create_test_image("image2.png")
    file3 = create_test_image("image3.png")
    
    data = {
        "id_venta": 1,
        "cedula_asesor": "12345",
        "nombre_asesor": "Juan Pérez",
        "correspondencia_electronica": True,
        "telefono_1": "3000000001",
        "telefono_2": "3000000002",
        "telefono_grabacion_contrato": "3000000003",
        "direccion_rr": "Calle 123",
        "nombre_conjunto": "",
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
        "observacion": "",
        "link": file1,
        "link2": file2,
        "link3": file3,
        "estado": "Activo",
        "usuario_modificado": "Usuario 1",
        "link_autorizacion": "http://example.com/autorizacion"
    }
    response = client.post("/api/historico_fija/", data, format="multipart")
    print(response.data)
    assert response.status_code == 201
    assert Historico_Fija.objects.count() == 1


@pytest.mark.django_db
def test_get_historico_fija():
    historico = Historico_Fija.objects.create(
        id_venta=1,
        cedula_asesor="12345",
        nombre_asesor="Juan Pérez",
        correspondencia_electronica=True,
        telefono_1="3000000001",
        telefono_2="3000000002",
        telefono_grabacion_contrato="3000000003",
        direccion_rr="Calle 123",
        nombre_conjunto=None,
        barrio="Centro",
        ciudad="Bogotá",
        departamento="Cundinamarca",
        comunidad="Comunidad 1",
        nodo="Nodo 1",
        estrato="3",
        venta="Venta 1",
        tipo_gestion="Gestión 1",
        servicio="Servicio 1",
        deco_adicional="Deco 1",
        campana="Campaña 1",
        adicionales="Adicionales 1",
        codigo_tarifa="Tarifa 1",
        ptar="PTAR 1",
        nombre_paquete_adquirido="Paquete 1",
        renta_mensual="100000",
        todo_claro="Sí",
        persona_recibe_instalacion="Persona 1",
        observacion=None,
        link=None,
        link2=None,
        link3=None,
        estado="Activo",
        usuario_modificado="Usuario 1",
        link_autorizacion="http://example.com/autorizacion"
    )
    client = APIClient()
    response = client.get(f"/api/historico_fija/{historico.id_venta}/")
    print(response.data)
    assert response.status_code == 200
    assert response.data["nombre_asesor"] == "Juan Pérez"