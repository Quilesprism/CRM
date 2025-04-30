// src/views/CrearVenta.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { crearVentaFija } from "../api/fijaApi";
import Input from "../components/forms/Input";
import Select from "../components/forms/Select";
import Textarea from "../components/forms/Textarea";
import FileInput from "../components/forms/FileInput";
import Checkbox from "../components/forms/Checkbox";
import useFetchDepartamentosCiudades from "../hooks/useFetchDepartamentosCiudades";
import "../assets/styles/creacionVenta.css";

const opcionesTipoDocumento = [
  { value: "CC", label: "CC" },
  { value: "CE", label: "CE" },
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

const serviciosOptions = [
  { name: "TV", value: "TV" },
  { name: "INTERNET", value: "INTERNET" },
  { name: "MOVIL", value: "MOVIL" },
];

export default function CrearVenta() {
  const { idVenta } = useParams();
  const hoy = new Date().toISOString().split("T")[0];
  const {
    departamentos,
    ciudades,
    selectedDepartamento,
    handleDepartamentoChange,
    loading: loadingUbicaciones,
    error: errorUbicaciones,
  } = useFetchDepartamentosCiudades();

  const [user, setUser] = useState(null);
  const [mostrarCantidadDecos, setMostrarCantidadDecos] = useState(false);
  const [maxServicios, setMaxServicios] = useState(0);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
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
    deco_adicional: "NO",
    cantidad_decos: "1",
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
    servicios_adicionales: [],
  });

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      setUser(rawUser ? JSON.parse(rawUser) : {});
    } catch (error) {
      console.error("Error al obtener o parsear el usuario de localStorage:", error);
      setUser(null);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "deco_adicional") {
      setMostrarCantidadDecos(value === "SI");
      if (value === "NO") {
        setFormData((prevData) => ({ ...prevData, cantidad_decos: "1" }));
      }
    } else if (name === "servicio") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      if (value === "SENCILLO") setMaxServicios(1);
      else if (value === "DOBLE") setMaxServicios(2);
      else if (value === "TRIPLE") setMaxServicios(3);
      else {
        setMaxServicios(0);
        setServiciosSeleccionados([]);
      }
    } else if (name === "departamento") {
      setFormData((prevData) => ({ ...prevData, [name]: value, ciudad: "" }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleServicioCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      if (serviciosSeleccionados.length < maxServicios) {
        setServiciosSeleccionados([...serviciosSeleccionados, value]);
      }
    } else {
      setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s !== value));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData(e.target);

    // Append asesor information
    formDataToSend.append("cedula_asesor", user?.cedula || "");
    formDataToSend.append("nombre_asesor", user?.nombres || "");

    // Append servicios adicionales as JSON string
    formDataToSend.append("servicios_adicionales", JSON.stringify(serviciosSeleccionados));

    // Append other form data from the state
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = formData[key];
        if (value instanceof File) {
          formDataToSend.append(key, value, value.name);
        } else if (key === "correspondencia_electronica") {
          formDataToSend.append(key, value === "SI");
        } else if (key === "deco_adicional" && value === "NO") {
          formDataToSend.append(key, value);
          formDataToSend.append("cantidad_decos", "1"); // Ensure cantidad_decos is 1 if deco_adicional is NO
        } else if (key !== "deco_adicional") {
          formDataToSend.append(key, value);
        }
      }
    }

    if (maxServicios > 0 && serviciosSeleccionados.length !== maxServicios) {
      alert(`Debes seleccionar ${maxServicios} servicios.`);
      return;
    }

    try {
      const response = await crearVentaFija(formDataToSend);
      console.log("Venta creada:", response.data);
      alert("Venta creada exitosamente");
      // Optionally reset the form or redirect
    } catch (error) {
      console.error("Error al crear la venta:", error.response?.data);
      alert(JSON.stringify(error.response?.data, null, 2));
    }
  };

  if (!user || loadingUbicaciones) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  if (errorUbicaciones) {
    return <div className="text-center mt-5">Error al cargar la información de ubicación.</div>;
  }

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
        {/* Asesor information will be appended in handleSubmit */}

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
                    handleDepartamentoChange(e);
                  }}
                />
                <Select
                  label="Ciudad"
                  name="ciudad"
                  options={ciudades.map((c) => ({ value: c, label: c }))}
                  required
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  disabled={!selectedDepartamento}
                />
                <Input
                  label="Direccion de residencia"
                  name="direccion_rr"
                  required
                  value={formData.direccion_rr}
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

                {maxServicios > 0 && (
                  <div className="form-group">
                    <label className="form-label-separated">Servicios Adicionales</label>
                    <div>
                      {serviciosOptions.map((servicio) => (
                        <Checkbox
                          key={servicio.value}
                          label={servicio.name}
                          name="servicios_adicionales"
                          value={servicio.value}
                          checked={serviciosSeleccionados.includes(servicio.value)}
                          onChange={handleServicioCheckboxChange}
                        />
                      ))}
                    </div>
                    {serviciosSeleccionados.length > maxServicios && (
                      <p className="text-danger">
                        Solo puedes seleccionar {maxServicios} servicios.
                      </p>
                    )}
                    {maxServicios > 0 && serviciosSeleccionados.length < maxServicios && (
                      <p className="text-warning">
                        Debes seleccionar {maxServicios} servicios.
                      </p>
                    )}
                  </div>
                )}
                <Select
                  label="Deco Adicional"
                  name="deco_adicional"
                  options={opcionesDecoAdicional}
                  required
                  value={formData.deco_adicional}
                  onChange={handleInputChange}
                />
                {mostrarCantidadDecos && (
                  <Select
                    label="Cantidad Decos"
                    name="cantidad_decos"
                    options={opcionesCantidadDecos}
                    value={formData.cantidad_decos}
                    onChange={handleInputChange}
                  />
                )}
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