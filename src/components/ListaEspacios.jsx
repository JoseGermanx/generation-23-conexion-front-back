export default function ListaEspacios({ espacios }) {
  if (!espacios.length)
    return <p className="empty">No hay espacios disponibles.</p>;

  return (
    <ul className="card-list">
      {espacios.map((e) => (
        <li key={e.id} className="card">
          <h3>{e.nombre}</h3>
          <p>
            <span className="label">Capacidad:</span> {e.capacidad} personas
          </p>
          <p>
            <span className="label">Ubicación:</span> {e.ubicación}
          </p>
          <span className={`badge ${e.disponibilidad ? "available" : "busy"}`}>
            {e.disponibilidad ? "Disponible" : "No disponible"}
          </span>
        </li>
      ))}
    </ul>
  );
}
