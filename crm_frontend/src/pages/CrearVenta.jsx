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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import holidaysColombia from "festivos-colombianos";
import {
    opcionesTipoDocumento,
    opcionesCorrespondencia,
    opcionesVenta,
    opcionesTipoGestion,
    opcionesServicio,
    opcionesDecoAdicional,
    opcionesCantidadDecos,
    opcionesAdicionales,
    opcionesTercerosInicial,
    serviciosOptions,
    opcionesFranjaInstalacion,
    opcionTodoClaro,
    estadosOptions,
    subestadosOptions,
    validarTelefono,
    validarTelefonosNoIguales,
    validarUltimosCuatroDigitos,
    validarEstrato,
} from "../components/forms/opcionesFormulario";

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
    const [adicionalesSeleccionados, setAdicionalesSeleccionados] = useState([]);
    const [mostrarCheckboxesAdicionales, setMostrarCheckboxesAdicionales] = useState(false); // Nuevo estado
    const [festivos, setFestivos] = useState([]);
    const [confirmacionDireccionRr, setConfirmacionDireccionRr] = useState("");
    const [direccionNoCoincide, setDireccionNoCoincide] = useState(false);
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
        adicionales: "NO", 
        codigo_tarifa: "",
        ptar: "",
        nombre_paquete_adquirido: "",
        renta_mensual: "",
        todo_claro: "",
        persona_recibe_instalacion: "",
        nombre_tercero: "",
        telefono_tercero: "",
        fecha_instalacion: "",
        franja_instalacion: "",
        observacion: "",
        detalles: "",
        cuenta: "",
        orden_trabajo:"",
        tipo_solicitud: "FIJA",
        link: null,
        link2: null,
        link3: null,
        link_autorizacion: "",
        servicios_adicionales: [],
        adicionales_seleccionados: [],
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
    }, []);

    useEffect(() => {
        const añoActual = new Date().getFullYear();
        try {
            const festivosColombia = holidaysColombia(añoActual);
            const festivosFormateados = festivosColombia.map((fecha) => {
                const dateObj = new Date(fecha.holiday);
                return {
                    date: dateObj.toISOString().split("T")[0],
                    name: fecha.celebration,
                };
            });
            setFestivos(festivosFormateados);
        } catch (error) {
            console.error("Error al obtener festivos:", error);
        }
    }, []);

    const esDiaNoLaboral = (date) => {
        const dia = date.getDay();
        const fechaStr = date.toISOString().split("T")[0];
        return dia === 0 || festivos.some((f) => f.date === fechaStr);
    };

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
        } else if (name === "adicionales") { // Nuevo manejo del Select de adicionales
            setFormData((prevData) => ({ ...prevData, [name]: value }));
            setMostrarCheckboxesAdicionales(value === "SI");
            if (value === "NO") {
                setAdicionalesSeleccionados([]); // Limpiar selecciones si dice NO
            }
        } else if (name === "departamento") {
            setFormData((prevData) => ({ ...prevData, [name]: value, ciudad: "" }));
        } else if (name === "persona_recibe_instalacion") {
            setFormData((prevData) => ({ ...prevData, [name]: value, nombre_tercero: '', telefono_tercero: '' }));
            setMostrarTerceroCampos(value === "Tercero");
            setErrores(prevErrores => ({ ...prevErrores, telefono_tercero: undefined }));
        } else if (name === "nombre_tercero") {
            const terceroSeleccionado = opcionesNombreTercero.find(option => option.value === value);
            setFormData(prevData => ({ ...prevData, [name]: value, telefono_tercero: terceroSeleccionado?.telefono || '' }));
        } else if (name === "telefono_tercero") {
            const terceroSeleccionado = opcionesTelefonoTercero.find(option => option.value === value);
            setFormData(prevData => ({ ...prevData, [name]: value, nombre_tercero: terceroSeleccionado?.nombre || '' }));
        } else if (name === "estrato") {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
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

    const handleAdicionalCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setAdicionalesSeleccionados([...adicionalesSeleccionados, value]);
        } else {
            setAdicionalesSeleccionados(adicionalesSeleccionados.filter((a) => a !== value));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target; setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        const nuevosErrores = {};

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

        const estratoError = validarEstrato(formData.estrato);
        if (estratoError) {
            nuevosErrores.estrato = estratoError;
            valid = false;
        }

        if (formData.direccion_rr !== confirmacionDireccionRr) {
            nuevosErrores.confirmacion_direccion_rr = "Las direcciones no coinciden.";
            valid = false;
            setDireccionNoCoincide(true);
        } else {
            setDireccionNoCoincide(false);
        }

        setErrores(nuevosErrores);

        if (!valid) {
            alert("Por favor, corrige los errores en el formulario.");
            return;
        }

        const formDataToSend = new FormData(e.target);

        formDataToSend.append("cedula_asesor", user?.cedula || "");
        formDataToSend.append("nombre_asesor", user?.nombres || "");

        // Formatear servicios
        const serviciosFormateados = serviciosSeleccionados.join(", ");
        formDataToSend.append("servicios_adicionales", serviciosFormateados);

        // Formatear adicionales
        if (formData.adicionales === "SI") {
            const adicionalesFormateados = adicionalesSeleccionados.join(", ");
            formDataToSend.append("adicionales_seleccionados", adicionalesFormateados);
        } else {
            formDataToSend.append("adicionales_seleccionados", "NO");
        }

        if (formData.persona_recibe_instalacion === "Tercero") {
            formDataToSend.append("persona_recibe_instalacion", `Tercero: ${formData.nombre_tercero} ${formData.telefono_tercero}`);
        } else {
            formDataToSend.append("persona_recibe_instalacion", formData.persona_recibe_instalacion);
        }
        formDataToSend.append("nombre_tercero", formData.nombre_tercero);
        formDataToSend.append("telefono_tercero", formData.telefono_tercero);

        for (const key in formData) {
            if (formData.hasOwnProperty(key) && key !== "confirmacion_direccion_rr") {
                const value = formData[key];
                if (value instanceof File) {
                    formDataToSend.append(key, value, value.name);
                } else if (key === "correspondencia_electronica") {
                    formDataToSend.append(key, value === "SI");
                } else if (key === "deco_adicional" && value === "NO") {
                    formDataToSend.append(key, value);
                    formDataToSend.append("cantidad_decos", "1");
                } else if (key !== "deco_adicional" && key !== "nombre_tercero" && key !== "telefono_tercero") {
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

                <div className="row">
                    {/* Datos del Cliente y Dirección Cliente (sin cambios) */}
                    <div className="col-lg-6">
                        <details className="form-section">
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
                            <details className="form-section">
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
                                        label="Direccion de residencia (Tal como se encuentra en RR)"
                                        name="direccion_rr"
                                        required
                                        value={formData.direccion_rr}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Confirmar Dirección de Residencia"
                                        name="confirmacion_direccion_rr"
                                        required
                                        value={confirmacionDireccionRr}
                                        onChange={(e) => {
                                            setConfirmacionDireccionRr(e.target.value);
                                            setDireccionNoCoincide(e.target.value !== formData.direccion_rr);
                                        }}
                                    />
                                    {direccionNoCoincide && (
                                        <p className="form-text text-danger">Las direcciones no coinciden.</p>
                                    )}
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
                            <details className="form-section">
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
                                        label="¿Desea Adicionales?"
                                        name="adicionales"
                                        options={[
                                            { value: "NO", label: "No" },
                                            { value: "SI", label: "Sí" },
                                        ]}
                                        required
                                        value={formData.adicionales}
                                        onChange={handleInputChange}
                                    />
    
                                    {mostrarCheckboxesAdicionales && (
                                        <div className="mb-3">
                                            <label className="form-label">Seleccione los Adicionales</label>
                                            {opcionesAdicionales.map((adicional) => (
                                                <Checkbox
                                                    key={adicional.value} id={`adicional-${adicional.value}`}
                                                    name="adicionales_seleccionados"
                                                    value={adicional.value}
                                                    label={adicional.label}
                                                    checked={adicionalesSeleccionados.includes(adicional.value)}
                                                    onChange={handleAdicionalCheckboxChange}
                                                />
                                            ))}
                                        </div>
                                    )}
    
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
    
                                    <Select
                                        label="Todo Claro"
                                        name="todo_claro"
                                        options={opcionTodoClaro}
                                        required
                                        value={formData.todo_claro}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </details>
                        </div>
    
                        <div className="col-lg-6">
                            <details className="form-section">
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
                                    <div className="mb-3">
                                        <label htmlFor="fecha_instalacion" className="form-label-separated">Fecha de Instalación</label>
                                        <Input
                                            id="fecha_instalacion"
                                            name="fecha_instalacion"
                                            type="date"
                                            value={formData.fecha_instalacion}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <Select
                                        label="Franja de Instalación"
                                        name="franja_instalacion"
                                        options={opcionesFranjaInstalacion}
                                        required
                                        value={formData.franja_instalacion}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                    label="Cuenta"
                                    name="cuenta"
                                    type="number"
                                    maxLength={8}
                                    value={formData.cuenta}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    label="Orden de Trabajo"
                                    name="orden_trabajo"
                                    type="number"
                                    maxLength={9}
                                    value={formData.orden_trabajo}
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
                            <details className="form-section">
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