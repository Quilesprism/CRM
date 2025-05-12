import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/Login.css";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ usuario, password });
      login(data); 
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login fallido");
    }
  };

  return (
    <div className="login-wrapper">
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
