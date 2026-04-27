import { useState } from "react";
import { crearReserva } from "../api";
import { useAuth } from "../context/AuthContext";

const hoy = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function FormReserva({ espacios, onCreada }) {
  const { state } = useAuth();
  const [form, setForm] = useState({
    espacio: "",
    fecha: hoy(),
    horaInicio: "",
    horaFin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {
        usuario: state.usuario.id,
        espacio: form.espacio,
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
      };
      const nueva = await crearReserva(payload);
      setSuccess(`Reserva creada con éxito (ID: ${nueva._id})`);
      setForm({ espacio: "", fecha: hoy(), horaInicio: "", horaFin: "" });
      onCreada();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="reserva-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Espacio</label>
        <select name="espacio" value={form.espacio} onChange={handleChange} required>
          <option value="">-- Selecciona un espacio --</option>
          {espacios.map((e) => (
            <option key={e._id} value={e._id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Fecha (DD-MM-YYYY)</label>
        <input
          type="text"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          placeholder="14-04-2026"
          pattern="\d{2}-\d{2}-\d{4}"
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Hora inicio</label>
          <input
            type="time"
            name="horaInicio"
            value={form.horaInicio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Hora fin</label>
          <input
            type="time"
            name="horaFin"
            value={form.horaFin}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {error && <p className="msg error">{error}</p>}
      {success && <p className="msg success">{success}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Crear reserva"}
      </button>
    </form>
  );
}
