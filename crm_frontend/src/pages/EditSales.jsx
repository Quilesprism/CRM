import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = "https://1cc3rjkx-8000.use2.devtunnels.ms";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});

const getVentaById = async (idVenta) => {
  try {
    const res = await axios.get(`${API_URL}/api/venta_fija/21/`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error(`Error al obtener la venta con ID ${idVenta}:`, error);
    throw error;
  }
};

const updateVenta = async (idVenta, data) => {
  try {
    console.log("Datos a enviar para actualizar:", data);
    const response = await axios.put(
      `${API_URL}/api/venta_fija/21/`,
      data,
      getAuthHeaders()
    );
    console.log("Respuesta de la actualización:", response);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la venta con ID ${idVenta}:`, error);
    throw error;
  }
};

function EditarCliente({ clienteId, onGuardarExito, onGuardarError }) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewLink, setPreviewLink] = useState(null);
  const [previewLink2, setPreviewLink2] = useState(null);
  const [previewLink3, setPreviewLink3] = useState(null);

  const fetchCliente = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVentaById(clienteId);
      setCliente(data);
      setPreviewLink(data.link || null);
      setPreviewLink2(data.link2 || null);
      setPreviewLink3(data.link3 || null);
    } catch (err) {
      setError(err.message);
      setCliente(null);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    fetchCliente();
  }, [fetchCliente]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === 'file' && files && files.length > 0) {
      const file = files[[0]];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'link') {
          setPreviewLink(reader.result);
        } else if (name === 'link2') {
          setPreviewLink2(reader.result);
        } else if (name === 'link3') {
          setPreviewLink3(reader.result);
        }
        setCliente(prevState => ({
          ...prevState,
          ...(files.length > 0 && {[name]: file}),
          ...(files.length === 0 && prevState && prevState.hasOwnProperty(name) ? {[name]: prevState[[name]]} : {})
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setCliente(prevState => ({
        ...prevState,
        ...(prevState !== null && {[name]: type === 'checkbox' ? checked : value})
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (cliente) {
      const formData = new FormData();
      for (const key in cliente) {
        if (cliente.hasOwnProperty(key)) {
          formData.append(key, cliente[[key]]);
        }
      }

      try {
        await updateVenta(clienteId, formData);
        onGuardarExito('Venta actualizada con éxito');
      } catch (error) {
        onGuardarError('Error al actualizar la venta: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div>Cargando datos del cliente...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos del cliente: {error}</div>;
  }

  if (!cliente) {
    return <div>No se encontraron datos del cliente.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Cliente</h2>
      <div>
        <label>Nombres y Apellidos:</label>
        <input
          type="text"
          name="nombres_apellidos_cliente"
          value={cliente.nombres_apellidos_cliente || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cédula:</label>
        <input
          type="text"
          name="cedula_cliente"
          value={cliente.cedula_cliente || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tipo de Cédula:</label>
        <input
          type="text"
          name="tipo_cedula"
          value={cliente.tipo_cedula || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Fecha de Expedición:</label>
        <input
          type="date"
          name="fecha_expedicion"
          value={cliente.fecha_expedicion ? cliente.fecha_expedicion.split('T')[0] : ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Lugar de Expedición:</label>
        <input
          type="text"
          name="lugar_expedicion"
          value={cliente.lugar_expedicion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Correo Electrónico:</label>
        <input
          type="email"
          name="correo_electronico"
          value={cliente.correo_electronico || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Correspondencia Electrónica:</label>
        <input
          type="checkbox"
          name="correspondencia_electronica"
          checked={cliente.correspondencia_electronica || false}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Teléfono 1:</label>
        <input
          type="text"
          name="telefono_1"
          value={cliente.telefono_1 || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Teléfono 2:</label>
        <input
          type="text"
          name="telefono_2"
          value={cliente.telefono_2 || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Teléfono Grabación Contrato:</label>
        <input
          type="text"
          name="telefono_grabacion_contrato"
          value={cliente.telefono_grabacion_contrato || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Dirección RR:</label>
        <input
          type="text"
          name="direccion_rr"
          value={cliente.direccion_rr || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nombre Conjunto:</label>
        <input
          type="text"
          name="nombre_conjunto"
          value={cliente.nombre_conjunto || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Barrio:</label>
        <input
          type="text"
          name="barrio"
          value={cliente.barrio || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Ciudad:</label>
        <input
          type="text"
          name="ciudad"
          value={cliente.ciudad || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Departamento:</label>
        <input
          type="text"
          name="departamento"
          value={cliente.departamento || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Comunidad:</label>
        <input
          type="text"
          name="comunidad"
          value={cliente.comunidad || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nodo:</label>
        <input
          type="text"
          name="nodo"
          value={cliente.nodo || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estrato:</label>
        <input
          type="text"
          name="estrato"
          value={cliente.estrato || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Venta:</label>
        <input
          type="text"
          name="venta"
          value={cliente.venta || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tipo de Gestión:</label>
        <input
          type="text"
          name="tipo_gestion"
          value={cliente.tipo_gestion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Servicio:</label>
        <input
          type="text"
          name="servicio"
          value={cliente.servicio || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Deco Adicional:</label>
        <input
          type="text"
          name="deco_adicional"
          value={cliente.deco_adicional || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Campaña:</label>
        <input
          type="text"
          name="campana"
          value={cliente.campana || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Adicionales:</label>
        <input
          type="text"
          name="adicionales"
          value={cliente.adicionales || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Código Tarifa:</label>
        <input
          type="text"
          name="codigo_tarifa"
          value={cliente.codigo_tarifa || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Ptar:</label>
        <input
          type="text"
          name="ptar"
          value={cliente.ptar || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nombre Paquete Adquirido:</label>
        <input
          type="text"
          name="nombre_paquete_adquirido"
          value={cliente.nombre_paquete_adquirido || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Fecha Grabación Contrato:</label>
        <input
          type="datetime-local"
          name="fecha_grabacion_contrato"
          value={cliente.fecha_grabacion_contrato ? cliente.fecha_grabacion_contrato.split('.')[0] : ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Fecha Instalación:</label>
        <input
          type="date"
          name="fecha_instalacion"
          value={cliente.fecha_instalacion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Franja Instalación:</label>
        <input
          type="text"
          name="franja_instalacion"
          value={cliente.franja_instalacion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Renta Mensual:</label>
        <input
          type="text"
          name="renta_mensual"
          value={cliente.renta_mensual || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Todo Claro:</label>
        <input
          type="text"
          name="todo_claro"
          value={cliente.todo_claro || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Persona Recibe Instalación:</label>
        <input
          type="text"
          name="persona_recibe_instalacion"
          value={cliente.persona_recibe_instalacion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Observación:</label>
        <textarea
          name="observacion"
          value={cliente.observacion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Imagen 1:</label>
        <input
          type="file"
          name="link"
          accept="image/*"
          onChange={handleChange}
        />
        {previewLink && (
          <div>
            <p>Vista previa:</p>
            <img src={previewLink} alt="Vista previa 1" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}
      </div>
      <div>
        <label>Imagen 2:</label>
        <input
          type="file"
          name="link2"
          accept="image/*"
          onChange={handleChange}
        />
        {previewLink2 && (
          <div>
            <p>Vista previa:</p>
            <img src={previewLink2} alt="Vista previa 2" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}
      </div>
      <div>
        <label>Imagen 3:</label>
        <input
          type="file"
          name="link3"
          accept="image/*"
          onChange={handleChange}
        />
        {previewLink3 && (
          <div>
            <p>Vista previa:</p>
            <img src={previewLink3} alt="Vista previa 3" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}
      </div>
      <div>
        <label>Link Autorización:</label>
        <input
          type="text"
          name="link_autorizacion"
          value={cliente.link_autorizacion || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Fecha Registro:</label>
        <input
          type="datetime-local"
          name="fecha_registro"
          value={cliente.fecha_registro ? cliente.fecha_registro.split('.')[0] : ''}
          readOnly
        />
      </div>
      <div>
        <label>Última Modificación:</label>
        <input
          type="datetime-local"
          name="ultima_modificacion"
          value={cliente.ultima_modificacion ? cliente.ultima_modificacion.split('.')[0] : ''}
          readOnly
        />
      </div>
      <div>
        <label>Estado:</label>
        <input
          type="text"
          name="estado"
          value={cliente.estado || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tipo de Solicitud:</label>
        <input
          type="text"
          name="tipo_solicitud"
          value={cliente.tipo_solicitud || ''}
          readOnly
        />
      </div>
      <div>
        <label>Detalles:</label>
        <textarea
          name="detalles"
          value={cliente.detalles || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Usuario Modificado:</label>
        <input
          type="text"
          name="usuario_modificado"
          value={cliente.usuario_modificado || ''}
          readOnly
        />
      </div>
      <div>
        <label>Cuenta:</label>
        <input
          type="text"
          name="cuenta"
          value={cliente.cuenta || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Orden de Trabajo:</label>
        <input
          type="text"
          name="orden_trabajo"
          value={cliente.orden_trabajo || ''}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        Guardar Cambios
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default EditarCliente;