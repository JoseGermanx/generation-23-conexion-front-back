import { useState } from "react";
import "./CalendarioReservas.css";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Convierte cualquier formato de fecha a "YYYY-MM-DD"
function normalizarFecha(fecha) {
  if (!fecha) return "";
  // ISO timestamp: "2026-04-17T10:00:00.000Z" → toma los primeros 10 chars
  if (/^\d{4}-\d{2}-\d{2}T/.test(fecha)) return fecha.slice(0, 10);
  // DD-MM-YYYY → YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
    const [dd, mm, yyyy] = fecha.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  // DD/MM/YYYY → YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
    const [dd, mm, yyyy] = fecha.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  // Ya es YYYY-MM-DD
  return fecha;
}

export default function CalendarioReservas({ reservas, espacios }) {
  const hoy = new Date();
  const [año, setAño] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const nombreEspacio = (id) =>
    espacios.find((e) => e._id === id)?.nombre ?? `Espacio #${id}`;

  // Agrupar reservas por "YYYY-MM-DD"
  const reservasPorFecha = reservas.reduce((acc, r) => {
    const key = normalizarFecha(r.fecha);
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  // Meses que tienen al menos una reserva (para el indicador de navegación)
  const mesesConReservas = new Set(
    Object.keys(reservasPorFecha).map((k) => k.slice(0, 7)) // "YYYY-MM"
  );

  const mesKey = `${año}-${String(mes + 1).padStart(2, "0")}`;
  const mesActualTieneReservas = mesesConReservas.has(mesKey);

  // Construir celdas del mes
  const primerDia = new Date(año, mes, 1);
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const offsetInicio = (primerDia.getDay() + 6) % 7;

  const celdas = [];
  for (let i = 0; i < offsetInicio; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

  const mesAnterior = () => {
    setDiaSeleccionado(null);
    if (mes === 0) { setMes(11); setAño((a) => a - 1); }
    else setMes((m) => m - 1);
  };

  const mesSiguiente = () => {
    setDiaSeleccionado(null);
    if (mes === 11) { setMes(0); setAño((a) => a + 1); }
    else setMes((m) => m + 1);
  };

  const fechaKey = (d) =>
    `${año}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const esHoy = (d) =>
    d === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear();

  const reservasDelDia =
    diaSeleccionado ? (reservasPorFecha[fechaKey(diaSeleccionado)] ?? []) : [];

  // Lista completa ordenada cronológicamente
  const todasOrdenadas = Object.entries(reservasPorFecha)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="calendario">
      <div className="calendario-header">
        <button onClick={mesAnterior} aria-label="Mes anterior">‹</button>
        <div className="calendario-titulo">
          <h3>{MESES[mes]} {año}</h3>
          {!mesActualTieneReservas && mesesConReservas.size > 0 && (
            <span className="sin-reservas-mes">Sin reservas este mes</span>
          )}
        </div>
        <button onClick={mesSiguiente} aria-label="Mes siguiente">›</button>
      </div>

      <div className="calendario-grid">
        {DIAS.map((d) => (
          <div key={d} className="calendario-dia-nombre">{d}</div>
        ))}
        {celdas.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const key = fechaKey(d);
          const cantidad = reservasPorFecha[key]?.length ?? 0;
          const seleccionado = diaSeleccionado === d;
          return (
            <button
              key={key}
              className={[
                "calendario-celda",
                cantidad > 0 ? "tiene-reservas" : "",
                seleccionado ? "seleccionado" : "",
                esHoy(d) ? "hoy" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setDiaSeleccionado(seleccionado ? null : d)}
              aria-label={`${d} de ${MESES[mes]}${cantidad ? `, ${cantidad} reserva${cantidad > 1 ? "s" : ""}` : ""}`}
            >
              <span className="numero-dia">{d}</span>
              {cantidad > 0 && <span className="badge">{cantidad}</span>}
            </button>
          );
        })}
      </div>

      {diaSeleccionado && (
        <div className="calendario-detalle">
          <h4>{diaSeleccionado} de {MESES[mes]} de {año}</h4>
          {reservasDelDia.length === 0 ? (
            <p className="empty">Sin reservas este día.</p>
          ) : (
            <ul className="detalle-lista">
              {reservasDelDia.map((r) => (
                <li key={r._id} className="detalle-item">
                  <span className="detalle-espacio">{nombreEspacio(r.espacioId)}</span>
                  <span className="detalle-horario">{r.horaInicio} – {r.horaFin}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Lista de todas las reservas */}
      {todasOrdenadas.length > 0 && (
        <div className="todas-reservas">
          <h4>Todas las reservas ({reservas.length})</h4>
          {todasOrdenadas.map(([fecha, lista]) => {
            const [yyyy, mm, dd] = fecha.split("-");
            const label = `${dd} de ${MESES[Number(mm) - 1]} de ${yyyy}`;
            return (
              <div key={fecha} className="todas-grupo">
                <p className="todas-fecha">{label}</p>
                <ul className="detalle-lista">
                  {lista.map((r) => (
                    <li key={r._id} className="detalle-item">
                      <span className="detalle-espacio">{nombreEspacio(r.espacioId)}</span>
                      <span className="detalle-horario">{r.horaInicio} – {r.horaFin}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
