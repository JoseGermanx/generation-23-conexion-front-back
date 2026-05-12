import { useState } from "react";
import { BASE_URL } from "../api";

const AMOUNT = 50000;

function formatMonto(n) {
  return `$${n.toLocaleString("es-CL")}`;
}

export default function PasoPago({ reserva, espacios, onCancelar }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const espacioNombre =
    espacios.find((e) => e._id === reserva.espacio)?.nombre ?? reserva.espacio;

  const handlePagar = async () => {
    setLoading(true);
    setError("");

    localStorage.setItem(
      "pagoPendiente",
      JSON.stringify({
        reservaId: reserva._id,
        espacioNombre,
        fecha: reserva.fecha,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        amount: AMOUNT,
      })
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/pagos/iniciar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservaId: reserva._id, amount: AMOUNT }),
      });

      const data = await res.json();

      if (!res.ok) {
        localStorage.removeItem("pagoPendiente");
        throw new Error(data.msg || "Error al iniciar el pago.");
      }

      // El backend debe devolver { url: "https://webpay3gint.transbank.cl/..." }
      // en vez de responder con 302 directamente.
      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="paso-pago">
      <h3>Confirmar reserva</h3>

      <div className="paso-pago-resumen">
        <div className="resumen-fila">
          <span className="resumen-label">Espacio</span>
          <span className="resumen-valor">{espacioNombre}</span>
        </div>
        <div className="resumen-fila">
          <span className="resumen-label">Fecha</span>
          <span className="resumen-valor">{reserva.fecha}</span>
        </div>
        <div className="resumen-fila">
          <span className="resumen-label">Horario</span>
          <span className="resumen-valor">
            {reserva.horaInicio} – {reserva.horaFin}
          </span>
        </div>
        <div className="resumen-fila resumen-monto">
          <span className="resumen-label">Monto a pagar</span>
          <span className="resumen-valor">{formatMonto(AMOUNT)}</span>
        </div>
      </div>

      <p className="paso-pago-nota">
        Serás redirigido al formulario de pago seguro de Transbank (Webpay Plus).
      </p>

      {error && <p className="msg error">{error}</p>}

      <div className="paso-pago-acciones">
        <button className="btn-pagar" onClick={handlePagar} disabled={loading}>
          {loading ? "Iniciando pago..." : "Proceder al pago"}
        </button>
        <button className="btn-cancelar" onClick={onCancelar} disabled={loading}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
