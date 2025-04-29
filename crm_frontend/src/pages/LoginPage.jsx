import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css"; 

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ usuario, password });
      console.log("Token recibido:", data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        usuario: data.usuario,
        nombres: data.nombres,
        cedula: data.cedula,
        permisos: data.permisos,
        estado: data.estado,
        nuevo: data.nuevo,
      }));      

      alert("Login exitoso");
      navigate("/"); 
    } catch (error) {
      console.error(error);
      alert("Login fallido");
    }
  };

  return (
    <div className="login-wrapper"> {/* Nueva clase para aislar el fondo */}
      <div className="login-container">
        <form onSubmit={handleLogin} noValidate>
          <h1>Iniciar Sesión</h1>

          <div className="form-group">
            <input
              type="text"
              name="usuario"
              className="form-input"
              placeholder=" "
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
            />
            <label className="form-label">Usuario</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label className="form-label">Contraseña</label>
          </div>

          <button type="submit" className="form-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
