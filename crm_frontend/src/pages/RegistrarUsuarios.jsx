import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi.js";
import "../assets/styles/creacionVenta.css";

function RegistrarUsuario() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    cedula: "",
    usuario: "",
    password: "",
    estado: true,
    nuevo: true,
    permisos: [],
    is_staff: false,
  });

  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "permisos") {
      const permisosArray = value.split(",").map((num) => parseInt(num.trim()));
      setFormData({ ...formData, permisos: permisosArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await registerUser(formData, token);
      setMensaje("Usuario registrado correctamente.");
      setTimeout(() => navigate("/asesores"), 2000);
    } catch (error) {
      console.error(error);
      setMensaje("Hubo un error al registrar el usuario.");
    }
  };

  if (!user?.permisos?.includes("administrador")) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return (
    <div className="container">
      <h1 className="form-title">Registrar Nuevo Usuario</h1>
      {mensaje && <p className="form-text text-danger">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="form-section">
        <div className="form-group">
          <label className="form-label-separated">Nombres</label>
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
            className="form-control-separated"
          />
        </div>
        <div className="form-group">
          <label className="form-label-separated">Cédula</label>
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            required
            className="form-control-separated"
          />
        </div>
        <div className="form-group">
          <label className="form-label-separated">Usuario</label>
          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
            className="form-control-separated"
          />
        </div>
        <div className="form-group">
          <label className="form-label-separated">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control-separated"
          />
        </div>
        <div className="form-group">
          <label className="form-label-separated">Permisos</label>
          <input
            type="text"
            name="permisos"
            placeholder="Permisos"
            value={formData.permisos.join(",")}
            onChange={handleChange}
            required
            className="form-control-separated"
          />
        </div>
        <div className="form-group">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
            />
            <span>Activo</span>
          </label>
        </div>
        <div className="form-group">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="nuevo"
              checked={formData.nuevo}
              onChange={handleChange}
            />
            <span>Nuevo</span>
          </label>
        </div>
        <div className="form-group">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
            <span>Staff</span>
          </label>
        </div>
        <div className="form-buttons-wrapper">
          <button type="submit" className="btn-submit">
            Registrar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrarUsuario;
