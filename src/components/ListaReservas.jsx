export default function ListaReservas({ reservas, espacios }) {
  if (!reservas.length)
    return <p className="empty">No hay reservas registradas.</p>;

  const nombreEspacio = (id) =>
    espacios.find((e) => e.id === id)?.nombre ?? `Espacio #${id}`;

  return (
    <ul className="card-list">
      {reservas.map((r) => (
        <li key={r.id} className="card">
          <h3>{nombreEspacio(r.espacioId)}</h3>
          <p>
            <span className="label">Fecha:</span> {r.fecha}
          </p>
          <p>
            <span className="label">Horario:</span> {r.horaInicio} – {r.horaFin}
          </p>
        </li>
      ))}
    </ul>
  );
}
