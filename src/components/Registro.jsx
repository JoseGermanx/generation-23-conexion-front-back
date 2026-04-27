import { useState } from "react";
import { registro, login } from "../api";
import { useAuth, AUTH_ACTIONS } from "../context/AuthContext";

export default function Registro({ onIrALogin }) {
  const { dispatch } = useAuth();
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registro(form.nombre, form.email, form.password);
      // Tras registrarse, hacemos login automático
      const data = await login(form.email, form.password);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      dispatch({
        type: AUTH_ACTIONS.LOGIN,
        payload: {
          token: data.token,
          usuario: { id: payload.id, email: payload.email, rol: payload.rol },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>

        <div className="field">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className="msg error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{" "}
          <button type="button" className="link-btn" onClick={onIrALogin}>
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
}
