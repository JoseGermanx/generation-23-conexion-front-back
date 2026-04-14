const BASE_URL = "http://localhost:3000"; // url del backend

export async function getEspacios() {
  const res = await fetch(`${BASE_URL}/espacios`); // get espacios
  if (!res.ok) throw new Error("Error al obtener espacios.");
  return res.json();
}

export async function getReservas() {
  const res = await fetch(`${BASE_URL}/reservas`); // get reservas
  if (!res.ok) throw new Error("Error al obtener reservas.");
  return res.json();
}

export async function crearReserva(data) {
  const res = await fetch(`${BASE_URL}/reservas`, { // post a reservas
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || "Error al crear reserva.");
  return json;
}
