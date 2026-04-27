const BASE_URL = import.meta.env.API;;

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || "Credenciales inválidas.");
  return json;
}

export async function registro(nombre, email, password) {
  const res = await fetch(`${BASE_URL}/usuario/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || "Error al registrar usuario.");
  return json;
}

// ── Espacios ─────────────────────────────────────────────────────────────────

export async function getEspacios() {
  const res = await fetch(`${BASE_URL}/espacios`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener espacios.");
  return res.json();
}

// ── Reservas ─────────────────────────────────────────────────────────────────

export async function getReservas(usuarioId) {
  const res = await fetch(`${BASE_URL}/reservas/usuario/${usuarioId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener reservas.");
  return res.json();
}

export async function crearReserva(data) {
  const res = await fetch(`${BASE_URL}/reservas`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || "Error al crear reserva.");
  return json;
}
