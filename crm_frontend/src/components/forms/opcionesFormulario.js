export const opcionesTipoDocumento = [
    { value: "CC", label: "CC" },
    { value: "CE", label: "CE" },
  ];
  
  export const opcionesCorrespondencia = [
    { value: "SI", label: "SI" },
    { value: "NO", label: "NO" },
  ];
  
  export const opcionesVenta = [
    { value: "DIGITAL", label: "Digital" },
    { value: "GRABADO", label: "Grabado" },
  ];
  
  export const opcionesTipoGestion = [
    { value: "VENTA_NUEVA", label: "Venta Nueva" },
    { value: "EMPAQUETAMIENTO", label: "Empaquetamiento" },
  ];
  
  export const opcionesServicio = [
    { value: "SENCILLO", label: "Sencillo" },
    { value: "DOBLE", label: "Doble" },
    { value: "TRIPLE", label: "Triple" },
  ];
  
  export const opcionesDecoAdicional = [
    { value: "NO", label: "NO" },
    { value: "SI", label: "SI" },
  ];
  
  export const opcionesCantidadDecos = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];
  
  export const opcionesAdicionales = [
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
  
  export const opcionesTercerosInicial = [
    { value: "Titular", label: "Titular" },
    { value: "Tercero", label: "Tercero" },
  ];
  
  export const serviciosOptions = [
    { name: "TV", value: "TV" },
    { name: "INTERNET", value: "INTERNET" },
    { name: "TELEFONÍA", value: "TELEFONIA" },
  ];
  
  export const opcionesFranjaInstalacion = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];
  
  export const opcionTodoClaro = [
    { value: "SI", label: "SI" },
    { value: "NO", label: "NO" },
  ];
  
  export const estadosOptions = [
    { label: "AUDITADA", value: "AUDITADA" },
    { label: "DIGITADA", value: "DIGITADA" },
    { label: "EN GESTION BACK OFFICE", value: "EN GESTION BACK OFFICE" },
    { label: "PENDIENTE CANCELAR", value: "PENDIENTE CANCELAR" },
    { label: "CANCELADA CERRADA", value: "CANCELADA CERRADA" },
    { label: "RECHAZADA", value: "RECHAZADA" },
    { label: "RECLAMACIÓN", value: "RECLAMACIÓN" },
    { label: "REPROGRAMADA", value: "REPROGRAMADA" },
    { label: "INSTALADA", value: "INSTALADA" },
    { label: "LEGALIZADA", value: "LEGALIZADA" },
    { label: "CANTADA", value: "CANTADA" },
  ];
  
  export const subestadosOptions = {
    "EN GESTION BACK OFFICE": [
      { value: "Error aplicativos - Visor", label: "Error aplicativos - Visor" },
      { value: "Error aplicativos - RR", label: "Error aplicativos - RR" },
      { value: "Escalada - PEOG", label: "Escalada - PEOG" },
      { value: "Escalada - Cuenta Matriz", label: "Escalada - Cuenta Matriz" },
      { value: "Escalada - Cambio de Nodo", label: "Escalada - Cambio de Nodo" },
      { value: "Escalada - Cambio de estrato", label: "Escalada - Cambio de estrato" },
      { value: "Escalada - Creación de dirección", label: "Escalada - Creación de dirección" },
      { value: "Escalada - Pendiente traslado", label: "Escalada - Pendiente traslado" },
    ],
    "PENDIENTE CANCELAR": [
      { value: "Sus no desea servicio", label: "Sus no desea servicio" },
      { value: "Fuera de zona", label: "Fuera de zona" },
      { value: "Devuelta asesor", label: "Devuelta asesor" },
      { value: "Problema interno del sus", label: "Problema interno del sus" },
      { value: "Direccion o datos errados", label: "Direccion o datos errados" },
      { value: "Carrusel comercial", label: "Carrusel comercial" },
      { value: "Replantamiento acometida", label: "Replantamiento acometida" },
      { value: "Ptar no aplica", label: "Ptar no aplica" },
    ],
    "CANCELADA CERRADA": [
      { value: "Sus no desea servicio", label: "Sus no desea servicio" },
      { value: "Fuera de zona", label: "Fuera de zona" },
      { value: "Devuelta asesor", label: "Devuelta asesor" },
      { value: "Problema interno del sus", label: "Problema interno del sus" },
      { value: "Direccion o datos errados", label: "Direccion o datos errados" },
      { value: "Carrusel comercial", label: "Carrusel comercial" },
      { value: "Replantamiento acometida", label: "Replantamiento acometida" },
      { value: "Ptar no aplica", label: "Ptar no aplica" },
    ],
    "RECHAZADA": [
      "Hhpp en estado no valido", "No aplica mintic", "Cliente no aprobado en visor",
      "Carrusel comercial", "Tarifa errada", "Oferta comercial errada", "Digitada por otro canal",
      "No recuperable", "Hhpp bloqueado", "Hhpp atrapado", "Nodo inactivo",
      "Leg. Omite párrafos o contrato incompleto", "Leg. Altera Orden de contrato o cambia palabras",
      "Leg. Asesor confirma informacion", "Interferencia de llamada", "Leg. Voces de terceros",
      "Datos errados", "Leg. Tiempo de Ocio o Interrupción", "Sin llamada de contrato",
      "Leg. Cliente no acepta términos", "Informacion Incompleta", "Venta duplicada",
      "Suplantación titular"
    ].map(item => ({ value: item, label: item })),
    "REPROGRAMADA": [
      { value: "Cliente no atiende", label: "Cliente no atiende" },
      { value: "Problema interno del sus", label: "Problema interno del sus" },
      { value: "Lluvia", label: "Lluvia" },
      { value: "Cliente solicita reprogramar", label: "Cliente solicita reprogramar" },
      { value: "Permisos de administración", label: "Permisos de administración" },
    ]
  };

  
  export  const validarTelefono = (telefono) => {
    if (!/^\d+$/.test(telefono)) {
      return "El teléfono debe contener solo números.";
    }
    if (telefono.length > 10) {
      return "El teléfono no debe tener más de 10 dígitos.";
    }
    return null;
  };
  
  export  const validarTelefonosNoIguales = (tel1, tel2) => {
    if (tel1 && tel2 && tel1 === tel2) {
      return "El teléfono de contacto 1 no puede ser igual al teléfono de contacto 2.";
    }
    return null;
  };
  
  export  const validarUltimosCuatroDigitos = (tel1, tel2) => {
    if (tel1 && tel2 && tel1.length >= 4 && tel2.length >= 4) {
      const ultimosCuatroTel1 = tel1.slice(-4);
      const ultimosCuatroTel2 = tel2.slice(-4);
      if (ultimosCuatroTel1 === ultimosCuatroTel2) {
        return "Los últimos cuatro dígitos del teléfono de contacto 1 y 2 no pueden ser iguales.";
      }
    }
    return null;
  };
  
export const validarEstrato = (estrato) => {
    if (estrato && (!/^[1-6]$/.test(estrato) || isNaN(parseInt(estrato)))) {
      return "El estrato debe ser un número entre 1 y 6.";
    }
    return null;
  };
