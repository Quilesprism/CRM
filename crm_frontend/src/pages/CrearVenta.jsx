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

const opcionesTercerosInicial = [
  { value: "Titular", label: "Titular" },
  { value: "Tercero", label: "Tercero" },
];

const serviciosOptions = [
  { name: "TV", value: "TV" },
  { name: "INTERNET", value: "INTERNET" },
  { name: "MOVIL", value: "MOVIL" },
];

// Simulación de datos de terceros (reemplazar con tu lógica real)
const datosTerceros = [
  { id: 1, nombre: 'Ana Pérez', telefono: '3001112222' },
  { id: 2, nombre: 'Carlos López', telefono: '3103334444' },
  { id: 3, nombre: 'Sofía Gómez', telefono: '3205556666' },
];

const validarTelefono = (telefono) => {
  if (!/^\d+$/.test(telefono)) {
    return "El teléfono debe contener solo números.";
  }
  if (telefono.length > 10) {
    return "El teléfono no debe tener más de 10 dígitos.";
  }
  return null;
};

const validarTelefonosNoIguales = (tel1, tel2) => {
  if (tel1 && tel2 && tel1 === tel2) {
    return "El teléfono de contacto 1 no puede ser igual al teléfono de contacto 2.";
  }
  return null;
};

const validarUltimosCuatroDigitos = (tel1, tel2) => {
  if (tel1 && tel2 && tel1.length >= 4 && tel2.length >= 4) {
    const ultimosCuatroTel1 = tel1.slice(-4);
    const ultimosCuatroTel2 = tel2.slice(-4);
    if (ultimosCuatroTel1 === ultimosCuatroTel2) {
      return "Los últimos cuatro dígitos del teléfono de contacto 1 y 2 no pueden ser iguales.";
    }
  }
  return null;
};

const validarEstrato = (estrato) => {
  if (estrato && (!/^[1-6]$/.test(estrato) || isNaN(parseInt(estrato)))) {
    return "El estrato debe ser un número entre 1 y 6.";
  }
  return null;
};

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
    nombre_tercero: "", // Nuevo estado para el nombre del tercero
    telefono_tercero: "", // Nuevo estado para el teléfono del tercero
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
  const [mostrarTerceroCampos, setMostrarTerceroCampos] = useState(false);
  const [opcionesNombreTercero, setOpcionesNombreTercero] = useState([]);
  const [opcionesTelefonoTercero, setOpcionesTelefonoTercero] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      setUser(rawUser ? JSON.parse(rawUser) : {});
    } catch (error) {
      console.error("Error al obtener o parsear el usuario de localStorage:", error);
      setUser(null);
    }

    // Formatear datos de terceros para los selects
    const nombresOptions = datosTerceros.map(tercero => ({
      value: tercero.nombre,
      label: tercero.nombre,
      telefono: tercero.telefono,
    }));
    const telefonosOptions = datosTerceros.map(tercero => ({
      value: tercero.telefono,
      label: tercero.telefono,
      nombre: tercero.nombre,
    }));
    setOpcionesNombreTercero(nombresOptions);
    setOpcionesTelefonoTercero(telefonosOptions);

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
    } else if (name === "persona_recibe_instalacion") {
      setFormData((prevData) => ({ ...prevData, [name]: value, nombre_tercero: '', telefono_tercero: '' }));
      setMostrarTerceroCampos(value === "Tercero");
    } else if (name === "nombre_tercero") {
      const terceroSeleccionado = opcionesNombreTercero.find(option => option.value === value);
      setFormData(prevData => ({ ...prevData, [name]: value, telefono_tercero: terceroSeleccionado?.telefono || '' }));
    } else if (name === "telefono_tercero") {
      const terceroSeleccionado = opcionesTelefonoTercero.find(option => option.value === value);
      setFormData(prevData => ({ ...prevData, [name]: value, nombre_tercero: terceroSeleccionado?.nombre || '' }));
    } else if (name === "estrato") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
     else {
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
    let valid = true;
    const nuevosErrores = {};

    // Validaciones de teléfonos
    const telefono1Error = validarTelefono(formData.telefono_1);
    if (telefono1Error) {
      nuevosErrores.telefono_1 = telefono1Error;
      valid = false;
    }
    const telefono2Error = validarTelefono(formData.telefono_2);
    if (telefono2Error) {
      nuevosErrores.telefono_2 = telefono2Error;
      valid = false;
    }
    const telefonoGrabacionError = validarTelefono(formData.telefono_grabacion_contrato);
    if (telefonoGrabacionError) {
      nuevosErrores.telefono_grabacion_contrato = telefonoGrabacionError;
      valid = false;
    }

    const telefonosNoIgualesError = validarTelefonosNoIguales(formData.telefono_1, formData.telefono_2);
    if (telefonosNoIgualesError) {
      nuevosErrores.telefono_2 = telefonosNoIgualesError;
      valid = false;
    }

    const ultimosCuatroDigitosError = validarUltimosCuatroDigitos(formData.telefono_1, formData.telefono_2);
    if (ultimosCuatroDigitosError) {
      nuevosErrores.telefono_2 = ultimosCuatroDigitosError;
      valid = false;
    }

    // Validación de estrato
    const estratoError = validarEstrato(formData.estrato);
    if (estratoError) {
      nuevosErrores.estrato = estratoError;
      valid = false;
    }

    setErrores(nuevosErrores);

    if (!valid) {
      alert("Por favor, corrige los errores en el formulario.");
      return;
    }

    const formDataToSend = new FormData(e.target);

    // Append asesor information
    formDataToSend.append("cedula_asesor", user?.cedula || "");
    formDataToSend.append("nombre_asesor", user?.nombres || "");

    // Append servicios adicionales as JSON string
    formDataToSend.append("servicios_adicionales", JSON.stringify(serviciosSeleccionados));

    // Append información de tercero si se seleccionó
    if (formData.persona_recibe_instalacion === "Tercero") {
      formDataToSend.append("persona_recibe_instalacion", `Tercero: ${formData.nombre_tercero} ${formData.telefono_tercero}`);
    } else {
      formDataToSend.append("persona_recibe_instalacion", formData.persona_recibe_instalacion);
    }
    formDataToSend.append("nombre_tercero", formData.nombre_tercero); // Asegúrate de enviar también estos campos
    formDataToSend.append("telefono_tercero", formData.telefono_tercero);

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
        } else if (key !== "deco_adicional" && key !== "nombre_tercero" && key !== "telefono_tercero") { // Excluir nombre_tercero y telefono_tercero del loop normal
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
                  error={errores.telefono_1}
                />
                <Input
                  label="Teléfono de contacto 2"
                  name="telefono_2"
                  type="text"
                  maxLength={10}
                  value={formData.telefono_2}
                  onChange={handleInputChange}
                  error={errores.telefono_2}
                />
                <Input
                  label="Teléfono grabación de contrato"
                  name="telefono_grabacion_contrato"
                  type="text"
                  maxLength={10}
                  required
                  value={formData.telefono_grabacion_contrato}
                  onChange={handleInputChange}
                  error={errores.telefono_grabacion_contrato}
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
                  value={formData.comunidad}
                  onChange={handleInputChange}
                />
                <Input
                  label="Nodo"
                  name="nodo"
                  value={formData.nodo}
                  onChange={handleInputChange}
                />
                <Input
                  label="Estrato"
                  name="estrato"
                  type="text"
                  maxLength={1}
                  required
                  value={formData.estrato}
                  onChange={handleInputChange}
                  error={errores.estrato}
                />
              </div>
            </details>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <details open className="form-section">
              <summary>Detalles de la Venta</summary>
              <div className="section-content">
                <Select
                  label="Tipo de Venta"
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
                  <div className="mb-3">
                    <label className="form-label">Servicios Adicionales ({serviciosSeleccionados.length}/{maxServicios})</label>
                    {serviciosOptions.map((servicio) => (
                      <Checkbox
                        key={servicio.value}
                        id={`servicio-${servicio.value}`}
                        name="servicios_adicionales"
                        value={servicio.value}
                        label={servicio.name}
                        checked={serviciosSeleccionados.includes(servicio.value)}
                        onChange={handleServicioCheckboxChange}
                        disabled={serviciosSeleccionados.length >= maxServicios && !serviciosSeleccionados.includes(servicio.value)}
                      />
                    ))}
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
                    label="Cantidad de Decos"
                    name="cantidad_decos"
                    options={opcionesCantidadDecos}
                    required
                    value={formData.cantidad_decos}
                    onChange={handleInputChange}
                  />
                )}
                <Input
                  label="Campaña"
                  name="campana"
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
                  value={formData.codigo_tarifa}
                  onChange={handleInputChange}
                />
                <Input
                  label="PTAR"
                  name="ptar"
                  value={formData.ptar}
                  onChange={handleInputChange}
                />
                <Input
                  label="Nombre Paquete Adquirido"
                  name="nombre_paquete_adquirido"
                  value={formData.nombre_paquete_adquirido}
                  onChange={handleInputChange}
                />
                <Input
                  label="Renta Mensual"
                  name="renta_mensual"
                  type="text"
                  value={
                    formData.renta_mensual
                      ? `$${Number(formData.renta_mensual).toLocaleString("es-CO")}`
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    if (raw.length <= 7) {
                      handleInputChange({
                        target: {
                          name: "renta_mensual",
                          value: raw,
                        },
                      });
                    }
                  }}
                  placeholder="$"
                />

                <Input
                  label="Todo Claro"
                  name="todo_claro"
                  value={formData.todo_claro}
                  onChange={handleInputChange}
                />
              </div>
            </details>
          </div>

          <div className="col-lg-6">
            <details open className="form-section">
              <summary>Información de Instalación</summary>
              <div className="section-content">
                <Select
                  label="¿Quién recibe la instalación?"
                  name="persona_recibe_instalacion"
                  options={opcionesTercerosInicial}
                  required
                  value={formData.persona_recibe_instalacion}
                  onChange={handleInputChange}
                />

                {mostrarTerceroCampos && (
                  <>
                    <Input
                      label="Nombre del Tercero"
                      name="nombre_tercero"
                      type="text"
                      value={formData.nombre_tercero}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Teléfono del Tercero"
                      name="telefono_tercero"
                      type="text"
                      maxLength={10}
                      value={formData.telefono_tercero}
                      onChange={handleInputChange}
                      error={errores.telefono_tercero}
                    />
                  </>
                )}

                <Input
                  label="Fecha de Instalación"
                  name="fecha_instalacion"
                  type="date"
                  min={hoy}
                  required
                  value={formData.fecha_instalacion}
                  onChange={handleInputChange}
                />
                <Input
                  label="Franja de Instalación"
                  name="franja_instalacion"
                  value={formData.franja_instalacion}
                  onChange={handleInputChange}
                />
                <Textarea
                  label="Observaciones"
                  name="observacion"
                  rows="3"
                  value={formData.observacion}
                  onChange={handleInputChange}
                />
                <Textarea
                  label="Detalles Adicionales"
                  name="detalles"
                  rows="3"
                  value={formData.detalles}
                  onChange={handleInputChange}
                />
              </div>
            </details>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <details open className="form-section">
              <summary>Documentos Adjuntos</summary>
              <div className="section-content">
                <FileInput
                  label="Imagen"
                  name="link"
                  onChange={handleFileChange}
                />
                <FileInput
                  label="Imagen "
                  name="link2"
                  onChange={handleFileChange}
                />
                <FileInput
                  label="Imagen"
                  name="link3"
                  onChange={handleFileChange}
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