
 
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { crearVentaFija } from "../api/fijaApi";
import "../assets/styles/creacionVenta.css";
const API_URL = "http://localhost:8000";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});

// Componente Textarea
function Textarea({ label, name, value, onChange, rows = 4, required = false }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        className="form-control-separated"
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

// Componente FileInput
function FileInput({ label, name, accept = "image/*", required = false, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        className="form-control-separated"
        accept={accept}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  maxLength,
  min,
  max,
  readOnly = false,
  required = false,
  value,
  onChange,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="form-control-separated"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        min={min}
        max={max}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
}

function Select({ label, name, options = [], value, onChange, required = false }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        className="form-control-separated"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Seleccione una opción</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} disabled={opt.disabled || false}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Componente Card
function Card({ title, children }) {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <h6 className="card-title m-0">
          {title} <strong className="text-danger">*</strong>
        </h6>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function CrearVenta() {
  const { idVenta } = useParams();
  const hoy = new Date().toISOString().split("T")[0];

  // Estados
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [user, setUser] = useState(null);

  // Estado inicial con todos los campos que el backend espera
  const [formData, setFormData] = useState({
    id_venta: "",
    nombres_apellidos_cliente: "",
    cedula_cliente: "",
    tipo_cedula: "",
    fecha_expedicion: "",
    lugar_expedicion: "",
    correo_electronico: "",
    correspondencia_electronica: "",
    telefono_1: "",
    telefono_2: "",
    telefono_grabacion_contrato: "",
    direccion_rr: "",
    nombre_conjunto: "",
    barrio: "",
    ciudad: "",
    departamento: "",
    comunidad: "",
    nodo: "",
    estrato: "",
    venta: "",
    tipo_gestion: "",
    servicio: "",
    deco_adicional: "",
    cantidad_decos: "",
    campana: "",
    adicionales: "",
    codigo_tarifa: "",
    ptar: "",
    nombre_paquete_adquirido: "",
    renta_mensual: "",
    todo_claro: "",
    persona_recibe_instalacion: "",
    fecha_instalacion: "",
    franja_instalacion: "",
    observacion: "",
    detalles: "",
    tipo_solicitud: "FIJA",
    link: null,
    link2: null,
    link3: null,
    link_autorizacion: "",
  });

  // Recuperar usuario
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : {});
    } catch {
      setUser({});
    }
  }, []);

   // Cargar departamentos
   useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get(`${API_URL}/ubicaciones/departamentos/`, getAuthHeaders());
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error al obtener departamentos", error);
      }
    };
  
    fetchDepartamentos();
  }, []); 

  // Cargar ciudades cuando cambia departamento
  useEffect(() => {
    const fetchCiudades = async () => {
      if (selectedDepartamento) {
        try {
          const response = await axios.get(`${API_URL}/ubicaciones/departamentos/${selectedDepartamento}/ciudades/`, getAuthHeaders());
          setCiudades(response.data);
        } catch (error) {
          console.error("Error al obtener ciudades", error);
        }
      } else {
        setCiudades([]);  // Si no hay departamento seleccionado, vaciar ciudades
      }
    };
  
    fetchCiudades();
  }, [selectedDepartamento]); 
  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((f) => ({ ...f, [name]: files[0] }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mapa de estado → claves API
    const fieldMap = {
      nombres_apellidos_cliente: "nombres_apellidos_cliente",
      cedula_cliente: "cedula_cliente",
      tipo_cedula: "tipo_cedula",
      fecha_expedicion: "fecha_expedicion",
      lugar_expedicion: "lugar_expedicion",
      correo_electronico: "correo_electronico",
      correspondencia_electronica: "correspondencia_electronica",
      telefono_1: "telefono_1",
      telefono_2: "telefono_2",
      telefono_grabacion_contrato: "telefono_grabacion_contrato",
      direccion_rr: "direccion_rr",
      nombre_conjunto: "nombre_conjunto",
      barrio: "barrio",
      ciudad: "ciudad",
      departamento: "departamento",
      comunidad: "comunidad",
      nodo: "nodo",
      estrato: "estrato",
      venta: "venta",
      tipo_gestion: "tipo_gestion",
      servicio: "servicio",
      deco_adicional: "deco_adicional",
      cantidad_decos: "cantidad_decos",
      campana: "campana",
      adicionales: "adicionales",
      codigo_tarifa: "codigo_tarifa",
      ptar: "ptar",
      nombre_paquete_adquirido: "nombre_paquete_adquirido",
      renta_mensual: "renta_mensual",
      todo_claro: "todo_claro",
      persona_recibe_instalacion: "persona_recibe_instalacion",
      fecha_instalacion: "fecha_instalacion",
      franja_instalacion: "franja_instalacion",
      observacion: "observacion",
      detalles: "detalles",
      tipo_solicitud: "tipo_solicitud",
      link: "link",
      link2: "link2",
      link3: "link3",
      link_autorizacion: "link_autorizacion",
    };

    const fd = new FormData();
    for (let [stateKey, val] of Object.entries(formData)) {
      const apiKey = fieldMap[stateKey];
      if (!apiKey) continue;
      let toAppend = val;
      if (stateKey === "correspondencia_electronica") {
        toAppend = val === "SI";
      }
      if (val instanceof File) {
        fd.append(apiKey, val, val.name);
      } else {
        fd.append(apiKey, toAppend ?? "");
      }
    }

    console.log("=== FormData entries ===");
    for (let [k, v] of fd.entries()) console.log(k, v);
    console.log("========================");

    try {
      const resp = await crearVentaFija(fd);
      console.log("Venta creada:", resp.data);
      alert("Venta creada exitosamente");
    } catch (err) {
      console.error("Error validación:", err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  if (user === null) {
    return <div className="text-center mt-5">Cargando datos del usuario...</div>;
  }

  // Opciones para selects
  const opcionesTipoDocumento = [
    { value: "CEDULA DE CIUDADANIA", label: "CC" },
    { value: "CEDULA DE EXTRANJERIA", label: "CE" },
  ];

  const opcionesCorrespondencia = [
    { value: "SI", label: "SI" },
    { value: "NO", label: "NO" },
  ];

  const opcionesVenta = [
    { value: "DIGITAL", label: "Digital" },
    { value: "GRABADO", label: "Grabado" },
  ];

  const opcionesTipoGestion = [
    { value: "VENTA_NUEVA", label: "Venta Nueva" },
    { value: "EMPAQUETAMIENTO", label: "Empaquetamiento" },
  ];

  const opcionesServicio = [
    { value: "SENCILLO", label: "Sencillo" },
    { value: "DOBLE", label: "Doble" },
    { value: "TRIPLE", label: "Triple" },
  ];

  const opcionesDecoAdicional = [
    { value: "NO", label: "NO" },
    { value: "SI", label: "SI" },
  ];

  const opcionesCantidadDecos = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

  const opcionesAdicionales = [
    { value: "", label: "Ninguno" },
    { value: "revista_15_minutos", label: "Revista 15 minutos" },
    { value: "hot_pack", label: "Hot pack" },
    { value: "golden_premier_hd", label: "Golden Premier HD" },
    { value: "max_premium", label: "Max premium" },
    { value: "universal_plus", label: "Universal +" },
    { value: "win_futbol", label: "Win+ Futbol" },
    { value: "paquete_internacional", label: "Paquete internacional" },
    { value: "ultra_wifi", label: "Ultra wifi" },
    { value: "ultra_wifi_1", label: "Ultra wifi 1" },
    { value: "baseball_1", label: "Baseball 1" },
    { value: "netflix", label: "Netflix" },
    { value: "disney", label: "Disney" },
    { value: "prime", label: "Prime" },
  ];

  const opcionesTerceros = [
    { value: "TITULAR", label: "Titular" },
    { value: "TERCERO", label: "Tercero" },
  ];

  return (
    <div className="container my-4">
      <h1 className="form-title">Fija - Detalles de la Venta {idVenta}</h1>
      <form
        id="miFormulario"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="form-body"
      >
        <input type="hidden" name="tipo_solicitud" value="FIJA" />
        <input type="hidden" name="cedula_asesor" value={user?.cedula || ""} />
        <input type="hidden" name="nombre_asesor" value={user?.nombres || ""} />

        <div className="row">
          <div className="col-lg-6">
            <details open className="form-section">
              <summary>Datos del Cliente</summary>
              <div className="section-content">
                <Input
                  label="Nombres y apellidos del cliente"
                  name="nombres_apellidos_cliente"
                  required
                  value={formData.nombres_apellidos_cliente}
                  onChange={handleInputChange}
                />
                <Select
                  label="Tipo de Documento"
                  name="tipo_cedula"
                  options={opcionesTipoDocumento}
                  required
                  value={formData.tipo_cedula}
                  onChange={handleInputChange}
                />
                <Input
                  label="Número de documento"
                  name="cedula_cliente"
                  type="number"
                  maxLength={10}
                  required
                  value={formData.cedula_cliente}
                  onChange={handleInputChange}
                />
                <Input
                  label="Fecha de expedición"
                  name="fecha_expedicion"
                  type="date"
                  max={hoy}
                  required
                  value={formData.fecha_expedicion}
                  onChange={handleInputChange}
                />
                <Input
                  label="Lugar de expedición"
                  name="lugar_expedicion"
                  required
                  value={formData.lugar_expedicion}
                  onChange={handleInputChange}
                />
                <Input
                  label="Correo Electrónico"
                  name="correo_electronico"
                  type="email"
                  required
                  value={formData.correo_electronico}
                  onChange={handleInputChange}
                />
                <Select
                  label="Correspondencia Electrónica"
                  name="correspondencia_electronica"
                  options={opcionesCorrespondencia}
                  required
                  value={formData.correspondencia_electronica}
                  onChange={handleInputChange}
                />
                <Input
                  label="Teléfono de contacto 1"
                  name="telefono_1"
                  type="text"
                  maxLength={10}
                  required
                  value={formData.telefono_1}
                  onChange={handleInputChange}
                />
                <Input
                  label="Teléfono de contacto 2"
                  name="telefono_2"
                  type="text"
                  maxLength={10}
                  value={formData.telefono_2}
                  onChange={handleInputChange}
                />
                <Input
                  label="Teléfono grabación de contrato"
                  name="telefono_grabacion_contrato"
                  type="text"
                  maxLength={10}
                  required
                  value={formData.telefono_grabacion_contrato}
                  onChange={handleInputChange}
                />
              </div>
            </details>
          </div>

          <div className="col-lg-6">
            <details open className="form-section">
              <summary>Dirección Cliente</summary>
              <div className="section-content">
                <Select
                  label="Departamento"
                  name="departamento"
                  options={departamentos.map((d) => ({ value: d, label: d }))}
                  required
                  value={formData.departamento}
                  onChange={(e) => {
                    handleInputChange(e);
                    setSelectedDepartamento(e.target.value);
                  }}
                />
            <Select
                    label="Ciudad"
                    name="ciudad"
                    options={ciudades.map((c) => ({ value: c, label: c }))}
                    required
                    value={formData.ciudad} // ¡Aquí faltaba .ciudad!
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Nombre Conjunto"
                    name="nombre_conjunto"
                    value={formData.nombre_conjunto}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Barrio"
                    name="barrio"
                    required
                    value={formData.barrio}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Comunidad"
                    name="comunidad"
                    required
                    value={formData.comunidad}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Nodo"
                    name="nodo"
                    required
                    value={formData.nodo}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Estrato"
                    name="estrato"
                    type="number"
                    min={0}
                    required
                    value={formData.estrato}
                    onChange={handleInputChange}
                    />
                  </div>
              </details>
  
              <details open className="form-section">
                <summary>Datos de Venta</summary>
                <div className="section-content">
                  <Select
                    label="Venta"
                    name="venta"
                    options={opcionesVenta}
                    required
                    value={formData.venta}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Tipo de Gestión"
                    name="tipo_gestion"
                    options={opcionesTipoGestion}
                    required
                    value={formData.tipo_gestion}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Servicio"
                    name="servicio"
                    options={opcionesServicio}
                    required
                    value={formData.servicio}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Deco Adicional"
                    name="deco_adicional"
                    options={opcionesDecoAdicional}
                    required
                    value={formData.deco_adicional}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Cantidad Decos"
                    name="cantidad_decos"
                    options={opcionesCantidadDecos}
                    value={formData.cantidad_decos}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Campaña"
                    name="campana"
                    required
                    value={formData.campana}
                    onChange={handleInputChange}
                  />

                  <Select
                    label="Adicionales"
                    name="adicionales"
                    options={opcionesAdicionales}
                    required
                    value={formData.adicionales}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Código Tarifa"
                    name="codigo_tarifa"
                    required
                    value={formData.codigo_tarifa}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Ptar"
                    name="ptar"
                    required
                    value={formData.ptar}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Nombre Paquete Adquirido"
                    name="nombre_paquete_adquirido"
                    required
                    value={formData.nombre_paquete_adquirido}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Renta Mensual"
                    name="renta_mensual"
                    type="number"
                    min={0}
                    required
                    value={formData.renta_mensual}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Todo Claro"
                    name="todo_claro"
                    options={[
                      { value: "SI", label: "SI" },
                      { value: "NO", label: "NO" },
                    ]}
                    required
                    value={formData.todo_claro}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Persona recibe instalación"
                    name="persona_recibe_instalacion"
                    required
                    value={formData.persona_recibe_instalacion}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Fecha instalación"
                    name="fecha_instalacion"
                    type="date"
                    min={hoy}
                    required
                    value={formData.fecha_instalacion}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Franja instalación"
                    name="franja_instalacion"
                    required
                    value={formData.franja_instalacion}
                    onChange={handleInputChange}
                  />
                  <Textarea
                    label="Observación"
                    name="observacion"
                    value={formData.observacion}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Detalles"
                    name="detalles"
                    value={formData.detalles}
                    onChange={handleInputChange}
                  />
                  <FileInput
                    label="Validación de Identidad"
                    name="link"
                    required
                    onChange={handleFileChange}
                  />
                  <FileInput
                    label="Validación de Créditos"
                    name="link2"
                    required
                    onChange={handleFileChange}
                  />
                  <FileInput
                    label="Motivo no venta digital"
                    name="link3"
                    onChange={handleFileChange}
                  />
                  <Input
                    label="Autorización de Datos (URL)"
                    name="link_autorizacion"
                    type="url"
                    required
                    value={formData.link_autorizacion}
                    onChange={handleInputChange}
                  />
                </div>
              </details>
            </div>
          </div>
  
          <div className="row mt-4">
            <div className="col-12 text-center">
              <button type="submit" className="btn-submit">
                {idVenta ? "Actualizar Venta" : "Crear Venta"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }