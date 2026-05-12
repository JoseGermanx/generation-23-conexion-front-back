import { useEffect, useState } from "react";

function formatMonto(n) {
  return `$${Number(n).toLocaleString("es-CL")}`;
}

const TIPOS_PAGO = { VN: "Crédito normal", VC: "Crédito en cuotas", SI: "Sin interés", S2: "2 cuotas sin interés", NC: "N cuotas sin interés", VD: "Débito" };

export default function PagoResultado({ onVolver }) {
  const [params] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return {
      status: p.get("status"),
      order: p.get("order"),
      amount: p.get("amount"),
      paymentType: p.get("paymentType"),
    };
  });

  // Datos extra guardados antes de salir al pago (espacio, fecha, horario)
  const [pendiente] = useState(() =>
    JSON.parse(localStorage.getItem("pagoPendiente") || "null")
  );

  // Limpiar URL y localStorage una sola vez al montar
  useEffect(() => {
    localStorage.removeItem("pagoPendiente");
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const { status, order, amount, paymentType } = params;

  // ── Pantallas según status ─────────────────────────────────────────────────

  if (status === "aprobado") {
    return (
      <div className="pago-resultado pago-resultado--exito">
        <div className="pago-resultado-icono">✓</div>
        <h3>¡Pago aprobado!</h3>
        <p>Tu reserva ha sido confirmada exitosamente.</p>

        <div className="pago-resultado-detalle">
          {pendiente?.espacioNombre && (
            <div className="detalle-fila">
              <span>Espacio</span>
              <span>{pendiente.espacioNombre}</span>
            </div>
          )}
          {pendiente?.fecha && (
            <div className="detalle-fila">
              <span>Fecha</span>
              <span>{pendiente.fecha}</span>
            </div>
          )}
          {pendiente?.horaInicio && (
            <div className="detalle-fila">
              <span>Horario</span>
              <span>{pendiente.horaInicio} – {pendiente.horaFin}</span>
            </div>
          )}
          <div className="detalle-fila">
            <span>Monto</span>
            <span>{formatMonto(amount)}</span>
          </div>
          <div className="detalle-fila">
            <span>Orden de compra</span>
            <span className="detalle-mono">{order}</span>
          </div>
          <div className="detalle-fila">
            <span>Tipo de pago</span>
            <span>{TIPOS_PAGO[paymentType] ?? paymentType}</span>
          </div>
          <div className="detalle-fila">
            <span>Estado</span>
            <span className="estado-badge estado-badge--ok">AUTORIZADO</span>
          </div>
        </div>

        <button className="btn-primario" onClick={() => onVolver("reservas")}>
          Ver mis reservas
        </button>
      </div>
    );
  }

  if (status === "rechazado") {
    return (
      <div className="pago-resultado pago-resultado--fallo">
        <div className="pago-resultado-icono">✕</div>
        <h3>Pago rechazado</h3>
        <p>El pago no fue aprobado. La reserva fue eliminada automáticamente.</p>

        <div className="pago-resultado-detalle">
          {order && (
            <div className="detalle-fila">
              <span>Orden de compra</span>
              <span className="detalle-mono">{order}</span>
            </div>
          )}
          {amount && (
            <div className="detalle-fila">
              <span>Monto intentado</span>
              <span>{formatMonto(amount)}</span>
            </div>
          )}
          <div className="detalle-fila">
            <span>Estado</span>
            <span className="estado-badge estado-badge--err">RECHAZADO</span>
          </div>
        </div>

        <button className="btn-secundario" onClick={() => onVolver("nueva")}>
          Intentar nueva reserva
        </button>
      </div>
    );
  }

  if (status === "abortado") {
    return (
      <div className="pago-resultado pago-resultado--fallo">
        <div className="pago-resultado-icono">✕</div>
        <h3>Pago cancelado</h3>
        <p>Cancelaste el proceso de pago. La reserva fue eliminada.</p>
        <button className="btn-secundario" onClick={() => onVolver("nueva")}>
          Intentar nueva reserva
        </button>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="pago-resultado pago-resultado--fallo">
        <div className="pago-resultado-icono">✕</div>
        <h3>Sesión expirada</h3>
        <p>La sesión de pago expiró sin completarse. La reserva fue eliminada.</p>
        <button className="btn-secundario" onClick={() => onVolver("nueva")}>
          Intentar nueva reserva
        </button>
      </div>
    );
  }

  // error u otro valor desconocido
  return (
    <div className="pago-resultado pago-resultado--error">
      <div className="pago-resultado-icono">✕</div>
      <h3>Error en el pago</h3>
      <p>Ocurrió un error durante el proceso de pago.</p>
      <button className="btn-secundario" onClick={() => onVolver("nueva")}>
        Intentar nueva reserva
      </button>
    </div>
  );
}
