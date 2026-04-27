export default function ListaReservas({ reservas }) {
  if (!reservas.length)
    return <p className="empty">No hay reservas registradas.</p>;

  return (
    <ul className="card-list">
      {reservas.map((r) => (
        <li key={r._id} className="card">
          <h3>{r.espacio?.nombre ?? `Espacio #${r.espacio}`}</h3>
          <p>
            <span className="label">Usuario:</span>{" "}
            {r.usuario?.nombre ?? r.usuario?.email ?? r.usuario}
          </p>
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
