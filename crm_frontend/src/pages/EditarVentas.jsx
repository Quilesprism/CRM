import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateVenta, getVentaById } from "../api/fijaApi";
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

export default function EditarVenta() {
    const { idVenta } = useParams();
    const navigate = useNavigate();
    const hoy = new Date().toISOString().split("T")[0];
    const { departamentos, ciudades, handleDepartamentoChange } = useFetchDepartamentosCiudades();

    const [formData, setFormData] = useState({
        deco_adicional: "NO",
        cantidad_decos: "1",
        tipo_solicitud: "FIJA",
        servicios_adicionales: [],
        direccion_rr: "",
        persona_recibe_instalacion: "",
        nombre_tercero: "",
        telefono_tercero: "",
        telefono_1: "",
        telefono_2: "",
        telefono_grabacion_contrato: "",
        estrato: "",
        departamento: "",
        ciudad: "",
        adicionales: "NO", // Inicializar el estado de adicionales
        adicionales_seleccionados: [],
        observacion: "", // Asegúrate de tener estos campos en el estado
        detalles: "",
        link: null,
        link2: null,
        link3: null,
        link_autorizacion: "",
        cuenta: "", 
        orden_trabajo: "",
        ...Array(40).fill("").reduce((a, _, i) => ({ ...a, [`campo${i}`]: "" }), {}),
    });

    const [estadoUI, setEstadoUI] = useState({
        loading: true,
        error: null,
        errores: {},
        mostrarCantidadDecos: false,
        serviciosSeleccionados: [],
        maxServicios: 0,
        festivos: [],
        mostrarTerceroCampos: false,
        confirmacionDireccionRr: "",
        direccionNoCoincide: false,
        nombreAsesor: "",
        cedulaAsesor: "",
        fechaRegistro: "",
        mostrarCheckboxesAdicionales: false,
    });

    const [confirmacionDireccionRr, setConfirmacionDireccionRr] = useState("");
    const [direccionNoCoincide, setDireccionNoCoincide] = useState(false);
    const [selectedDepartamentoLocal, setSelectedDepartamentoLocal] = useState("");
    const [adicionalesSeleccionadosUI, setAdicionalesSeleccionadosUI] = useState([]); // Estado para la UI de los checkboxes

    const handleAdicionalCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setAdicionalesSeleccionadosUI([...adicionalesSeleccionadosUI, value]);
        } else {
            setAdicionalesSeleccionadosUI(adicionalesSeleccionadosUI.filter((a) => a !== value));
        }
    };

    useEffect(() => {
        setEstadoUI((s) => ({
            ...s,
            festivos: holidaysColombia(new Date().getFullYear()).map((f) => ({
                date: new Date(f.holiday).toISOString().split("T")[0],
                name: f.celebration,
            })),
        }));
    }, []);

    const cargarVentaInicial = useCallback(async () => {
        try {
            const data = await getVentaById(idVenta);

            if (!data) {
                setEstadoUI((s) => ({ ...s, loading: false, error: "Venta no encontrada" }));
                return;
            }
            setFormData(data);
            setSelectedDepartamentoLocal(data.departamento || "");
            setEstadoUI((s) => ({
                ...s,
                mostrarCantidadDecos: data.deco_adicional === "SI",
                serviciosSeleccionados: Array.isArray(data.servicios_adicionales) ? data.servicios_adicionales : [],
                mostrarTerceroCampos: data.persona_recibe_instalacion?.startsWith("Tercero"),
                loading: false,
                nombreAsesor: data.nombre_asesor,
                cedulaAsesor: data.cedula_asesor,
                fechaRegistro: data.fecha_registro,
                mostrarCheckboxesAdicionales: data.adicionales === "SI",
            }));
            setConfirmacionDireccionRr(data.direccion_rr || "");
            setAdicionalesSeleccionadosUI(Array.isArray(data.adicionales_seleccionados) ? data.adicionales_seleccionados : []); // Cargar adicionales desde la DB
        } catch (error) {
            setEstadoUI((s) => ({ ...s, error: error.message, loading: false }));
        }
    }, [idVenta]);

    useEffect(() => {
        cargarVentaInicial();
    }, [cargarVentaInicial]);

    useEffect(() => {
        if (formData.departamento) {
            handleDepartamentoChange({ target: { value: formData.departamento } });
        }
    }, [formData.departamento, handleDepartamentoChange]);

    const actualizarCampo = (name, value) => {
        setFormData((f) => ({ ...f, [name]: value }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        if (name === "deco_adicional") setEstadoUI((s) => ({ ...s, mostrarCantidadDecos: val === "SI" }));
        if (name === "servicio") {
            const max = { SENCILLO: 1, DOBLE: 2, TRIPLE: 3 }[val] || 0;
            setEstadoUI((s) => ({ ...s, maxServicios: max, serviciosSeleccionados: [] }));
        }
        if (name === "departamento") {
            actualizarCampo("ciudad", "");
            setSelectedDepartamentoLocal(value);
        }
        if (name === "persona_recibe_instalacion") {
            actualizarCampo("nombre_tercero", "");
            actualizarCampo("telefono_tercero", "");
            setEstadoUI((s) => ({ ...s, mostrarTerceroCampos: val === "Tercero" }));
        }
        if (name === "adicionales") {
            setEstadoUI((s) => ({ ...s, mostrarCheckboxesAdicionales: val === "SI" }));
        }

        actualizarCampo(name, val);
    };

    const handleServicioCheckboxChange = ({ target: { value, checked } }) => {
        setEstadoUI((s) => {
            const servicios = checked ? [...s.serviciosSeleccionados, value] : s.serviciosSeleccionados.filter((v) => v !== value);
            return { ...s, serviciosSeleccionados: servicios.slice(0, s.maxServicios) };
        });
    };

    const handleFileChange = ({ target: { name, files } }) => actualizarCampo(name, files[0]);
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errores = {};
    
        // Validaciones de teléfono
        ["telefono_1", "telefono_2", "telefono_grabacion_contrato"].forEach((t) => {
            const err = validarTelefono(formData[t]);
            if (err) errores[t] = err;
        });
    
        // Validaciones adicionales
        const validaciones = [
            validarTelefonosNoIguales(formData.telefono_1, formData.telefono_2),
            validarUltimosCuatroDigitos(formData.telefono_1, formData.telefono_2),
            validarEstrato(formData.estrato),
        ];
    
        ["telefono_1", "telefono_2", "estrato"].forEach((campo, i) => {
            if (validaciones[i]) errores[campo] = validaciones[i];
        });
    
        // Validación estricta de dirección
        if (formData.direccion_rr.trim() !== confirmacionDireccionRr.trim()) {
            errores.confirmacion_direccion_rr = "Las direcciones no coinciden.";
            setDireccionNoCoincide(true);
        } else {
            setDireccionNoCoincide(false);
        }
    
        // Validaciones obligatorias
        if (!formData.servicio) errores.servicio = "Debe seleccionar un servicio.";
        if (!formData.tipo_gestion) errores.tipo_gestion = "Debe seleccionar un tipo de gestión.";
        if (!formData.venta) errores.venta = "Debe seleccionar un tipo de venta.";
    
        // Validación por servicio
        if (formData.servicio === "INTERNET" && !formData.velocidad_internet) {
            errores.velocidad_internet = "Debe seleccionar una velocidad de internet.";
        }
    
        if (formData.servicio === "TELEVISIÓN" && !formData.cantidad_decos) {
            errores.cantidad_decos = "Debe indicar la cantidad de decos.";
        }
    
        // Validaciones por tipo_gestion
        if (formData.tipo_gestion === "PORTABILIDAD" && !formData.link_autorizacion) {
            errores.link_autorizacion = "Debe adjuntar el archivo de autorización.";
        }
    
        // Validaciones condicionales para estado RECHAZADO
        if (formData.estado === "RECHAZADO" && !formData.detalles) {
            errores.detalles = "Debe indicar el motivo del rechazo.";
        }
    
        // Validaciones si persona recibe instalación es Tercero
        if (formData.persona_recibe_instalacion === "Tercero") {
            if (!formData.nombre_tercero) errores.nombre_tercero = "Debe ingresar el nombre del tercero.";
            if (!formData.telefono_tercero) {
                errores.telefono_tercero = "Debe ingresar el teléfono del tercero.";
            } else {
                const err = validarTelefono(formData.telefono_tercero);
                if (err) errores.telefono_tercero = err;
            }
        }
    
        if (Object.keys(errores).length > 0) {
            setEstadoUI((s) => ({ ...s, errores }));
            alert("Por favor, corrige los errores en el formulario.");
            return;
        }
    
        const formDataToSend = new FormData();
    
        const convertirBooleano = (valor) => {
            if (typeof valor === 'boolean') return valor;
            if (typeof valor === 'string') {
                return valor.toLowerCase() === 'si' || valor.toLowerCase() === 'true';
            }
            return false;
        };
    
        const camposEspeciales = [
            'link', 'link2', 'link3', 
            'correspondencia_electronica', 
            'todo_claro', 
            'deco_adicional', 
            'adicionales'
        ];
    
        for (const key of Object.keys(formData)) {
            const valor = formData[key];
    
            // Archivos especiales
            if (camposEspeciales.includes(key)) {
                if (key.startsWith('link')) {
                    // Solo enviar si es un archivo nuevo
                    if (valor instanceof File) {
                        formDataToSend.append(key, valor, valor.name);
                    }
                    continue;
                } else {
                    // Booleanos (checkbox o similares)
                    if (valor !== undefined && valor !== null && valor !== '') {
                        formDataToSend.append(key, convertirBooleano(valor));
                    }
                    continue;
                }
            }
    
            // Otros archivos
            if (valor instanceof File) {
                formDataToSend.append(key, valor, valor.name);
                continue;
            }
    
            // Arrays
            if (Array.isArray(valor)) {
                valor.forEach((item, index) => {
                    formDataToSend.append(`${key}[${index}]`, item);
                });
                continue;
            }
    
            // Strings importantes o campos críticos
            if (typeof valor === 'string') {
                const valorTrimmed = valor.trim();
                const camposCriticos = [
                    'servicio', 'tipo_gestion', 'venta', 'departamento', 
                    'ciudad', 'direccion_rr', 'estrato', 'cedula_cliente',
                    'nombres_apellidos_cliente', 'telefono_1', 'telefono_2'
                ];
                if (valorTrimmed || camposCriticos.includes(key)) {
                    formDataToSend.append(key, valorTrimmed);
                }
                continue;
            }
    
            // Resto de campos (números, booleanos, etc.)
            if (valor !== null && valor !== undefined && valor !== '') {
                formDataToSend.append(key, valor);
            }
        }
    
        // Adicionales
        estadoUI.serviciosSeleccionados.forEach((item) =>
            formDataToSend.append("servicios_adicionales[]", item)
        );
        adicionalesSeleccionadosUI.forEach((item) =>
            formDataToSend.append("adicionales_seleccionados[]", item)
        );
    
        // Persona recibe instalación (si es tercero)
        if (formData.persona_recibe_instalacion === "Tercero" && 
            formData.nombre_tercero && formData.telefono_tercero) {
            formDataToSend.set(
                "persona_recibe_instalacion",
                `Tercero: ${formData.nombre_tercero} ${formData.telefono_tercero}`
            );
        }
    
        console.log("Campos enviados:");
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}: `, value);
        }
    
        try {
            const respuesta = await updateVenta(idVenta, formDataToSend);
            alert("Venta actualizada correctamente.");
            navigate("/ventas");
        } catch (error) {
            console.error('Error completo:', error);
    
            const mensajeError = 
                error.response?.data?.detail || 
                error.response?.data?.message || 
                (error.response?.data && JSON.stringify(error.response.data)) ||
                error.message || 
                "Error desconocido al actualizar la venta";
    
            alert(`Error: ${mensajeError}`);
    
            if (error.response) {
                console.error('Detalles de la respuesta:', error.response.data);
                console.error('Estatus:', error.response.status);
            }
        }
    };
    

    if (estadoUI.loading) {
        return <div>Cargando información de la venta...</div>;
    }

    if (estadoUI.error) {
        return <div>Error al cargar la venta</div>;
    }
    const capitalizarNombre = (nombre) =>
        nombre
            .toLowerCase()
            .split(" ")
            .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(" ");

    return (
        <div className="container my-4">
            <h1 className="form-title">
                Edicion de la Venta 
            </h1>
            <p className="datos-asesor">
                <span className="asesor-linea">
                    <strong>Asesor:</strong> {capitalizarNombre(estadoUI.nombreAsesor)}
                    <span className="separator">|</span>
                    <strong>Cédula:</strong> {estadoUI.cedulaAsesor}
                </span>
                <br />
                <strong>Fecha de Registro:</strong>{" "}
                {new Date(estadoUI.fechaRegistro).toLocaleString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })}
            </p>

            <form
                id="miFormulario"
                method="post"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="form-body"
            >
                <input type="hidden" name="tipo_solicitud" value="FIJA" />

                <div className="row">
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
                                    label="Número de documento"name="cedula_cliente"
                                    type="number"
                                    maxLength={10}
                                    required
                                    value={formData.cedula_cliente}
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
                                    value={formData.correspondencia_electronica ? "SI" : "NO"}
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
                                    error={estadoUI.errores.telefono_1}
                                />
                                <Input
                                    label="Teléfono de contacto 2"
                                    name="telefono_2"
                                    type="text"
                                    maxLength={10}
                                    value={formData.telefono_2}
                                    onChange={handleInputChange}
                                    error={estadoUI.errores.telefono_2}
                                />
                                <Input
                                    label="Teléfono grabación de contrato"
                                    name="telefono_grabacion_contrato"
                                    type="text"
                                    maxLength={10}
                                    required
                                    value={formData.telefono_grabacion_contrato}
                                    onChange={handleInputChange}
                                    error={estadoUI.errores.telefono_grabacion_contrato}
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
                                    onChange={handleInputChange}
                                />
                                <Select
                                    label="Ciudad"
                                    name="ciudad"
                                    options={ciudades.map((c) => ({ value: c, label: c }))}
                                    required
                                    value={formData.ciudad}
                                    onChange={handleInputChange}
                                    disabled={!selectedDepartamentoLocal}
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
                                    error={estadoUI.errores.estrato}
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

                                {estadoUI.maxServicios > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Servicios Adicionales ({estadoUI.serviciosSeleccionados.length}/{estadoUI.maxServicios})
                                        </label>
                                        {serviciosOptions.map((servicio) => (
                                            <Checkbox
                                                key={servicio.value}
                                                id={`servicio-${servicio.value}`}
                                                name="servicios_adicionales"
                                                value={servicio.value}
                                                label={servicio.name}
                                                checked={estadoUI.serviciosSeleccionados.includes(servicio.value)}
                                                onChange={handleServicioCheckboxChange}
                                                disabled={
                                                    estadoUI.serviciosSeleccionados.length >= estadoUI.maxServicios &&
                                                    !estadoUI.serviciosSeleccionados.includes(servicio.value)
                                                }
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
                                {estadoUI.mostrarCantidadDecos && (
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

                                    value={formData.adicionales}
                                    onChange={handleInputChange}
                                />

                                {estadoUI.mostrarCheckboxesAdicionales && (
                                    <div className="mb-3">
                                        <label className="form-label">Seleccione los Adicionales</label>
                                        {opcionesAdicionales.map((adicional) => (
                                            <Checkbox
                                                key={adicional.value} id={`adicional-${adicional.value}`}
                                                name="adicionales_seleccionados"
                                                value={adicional.value}
                                                label={adicional.label}
                                                checked={adicionalesSeleccionadosUI.includes(adicional.value)}
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
                                    value={formData.todo_claro ? "SI" : "NO"}
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
                                    value={
                                        formData.persona_recibe_instalacion?.startsWith("Tercero")
                                            ? "Tercero"
                                            : formData.persona_recibe_instalacion
                                    }
                                    onChange={handleInputChange}
                                />

                                {estadoUI.mostrarTerceroCampos && (
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
                                            error={estadoUI.errores.telefono_tercero}
                                        />
                                    </>
                                )}
                                <Select
                                    label="Estado"
                                    name="estado"
                                    required
                                    value={formData.estado}
                                    options={estadosOptions}
                                    onChange={handleInputChange}
                                />

                                <Select
                                    label="Detalle / Subestado"
                                    name="detalles"

                                    value={formData.subestado}
                                    options={subestadosOptions[formData.estado] || []}
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
                                    label="Orden de Trabajo"name="orden_trabajo"
                                    value={formData.orden_trabajo}
                                    onChange={handleInputChange}
                                />

<div className="mb-3">
                                    <label htmlFor="fecha_instalacion" className="form-label-separated">
                                        Fecha de Agenda
                                    </label>
                                    <DatePicker
                                        id="fecha_instalacion"
                                        name="fecha_instalacion"
                                        selected={formData.fecha_instalacion ? new Date(formData.fecha_instalacion) : null}
                                        onChange={(date) =>
                                            setFormData({
                                                ...formData,
                                                fecha_instalacion: date ? date.toISOString().split("T")[0] : "",
                                            })
                                        }
                                        minDate={new Date()}
                                        filterDate={(date) => {
                                            const day = date.getDay();
                                            const dateStr = date.toISOString().split("T")[0];
                                            return day !== 0 && !estadoUI.festivos.some((f) => f.date === dateStr);
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control-separated"
                                    />
                                </div>
                                <Select
                                    label="Franja"
                                    name="franja_instalacion"
                                    options={opcionesFranjaInstalacion}
                                    required
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
                                    label="Observacion del Backoffice"
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
                                {formData.link && (
                                    <div className="mb-3">
                                        <label className="form-label-separated">Validación de Identidad Actual</label>
                                        <img
                                            src={formData.link}
                                            alt="Validación de Identidad Actual"
                                            className="img-thumbnail clickable-image"
                                            style={{ maxWidth: "300px", maxHeight: "300px", display: "block" }}
                                            onClick={() => window.open(formData.link, "_blank")}
                                        />
                                    </div>
                                )}
                                <FileInput
                                    label="Reemplazar Imagen de Validación de Identidad"
                                    name="link"
                                    onChange={handleFileChange}
                                />
                                {formData.link2 && (
                                    <div className="mb-3">
                                        <label className="form-label-separated">Validación de Créditos Actual</label>
                                        <img
                                            src={formData.link2}
                                            alt="Validación de Créditos Actual"
                                            className="img-thumbnail clickable-image"
                                            style={{ maxWidth: "300px", maxHeight: "300px", display: "block" }}
                                            onClick={() => window.open(formData.link2, "_blank")}
                                        />
                                    </div>
                                )}
                                <FileInput
                                    label="Reemplazar Imagen de Validación de Créditos"
                                    name="link2"
                                    onChange={handleFileChange}
                                />
                                {formData.link3 && formData.link3 !== "N/A" && (
                                    <div className="mb-3">
                                        <label className="form-label-separated">Motivo no venta digital Actual</label>
                                        <img
                                            src={formData.link3}
                                            alt="Validación de Identidad Actual"
                                            className="img-thumbnail clickable-image"
                                            onClick={() => window.open(formData.link3, "_blank")}
                                        />

                                    </div>
                                )}
                                {formData.link3 === "N/A" && (
                                    <div className="mb-3">
                                        <label className="form-label-separated">Motivo no venta digital Actual</label>
                                        <p>N/A</p>
                                    </div>
                                )}
                                <FileInput
                                    label="Reemplazar Imagen de Motivo no Venta Digital"
                                    name="link3"
                                    onChange={handleFileChange}
                                />
                                {/* crear que lo campos de cuenta y orden de trabajo sean de ocho y nueve digitos
                                
                                Tambien, crea fecha agenda y franja
                                
                                */}
                                
                            </div>
                        </details>
                    </div>
                </div>
                <div className="form-buttons-wrapper mt-4">
                    <button type="submit" className="big-btn">
                        Guardar Cambios
                    </button>
                    <button type="button" onClick={() => navigate("/ventas")} className="big-btn">
                        Cancelar
                    </button>
                </div>

            </form>
        </div>
    );
}