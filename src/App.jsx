import { useEffect, useState } from "react";
import { getEspacios, getReservas } from "./api";
import { useAuth, AUTH_ACTIONS } from "./context/AuthContext";
import ListaEspacios from "./components/ListaEspacios";
import ListaReservas from "./components/ListaReservas";
import FormReserva from "./components/FormReserva";
import CalendarioReservas from "./components/CalendarioReservas";
import PasoPago from "./components/PasoPago";
import PagoResultado from "./components/PagoResultado";
import Login from "./components/Login";
import Registro from "./components/Registro";
import AccessibilityMenu from "./components/Accesibilidad";
import "./App.css";

export default function App() {
  const { state, dispatch } = useAuth();
  const [vistaAuth, setVistaAuth] = useState("login"); // "login" | "registro"

  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [tab, setTab] = useState("espacios");
  const [reservaPendientePago, setReservaPendientePago] = useState(null);
  const [loadingEspacios, setLoadingEspacios] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [errorEspacios, setErrorEspacios] = useState("");
  const [errorReservas, setErrorReservas] = useState("");

  useEffect(() => {
    if (!state.token) return;
    setLoadingEspacios(true);
    getEspacios()
      .then(setEspacios)
      .catch((e) => setErrorEspacios(e.message))
      .finally(() => setLoadingEspacios(false));
  }, [state.token]);

  const cargarReservas = () => {
    setLoadingReservas(true);
    getReservas(state.usuario.id)
      .then(setReservas)
      .catch((e) => setErrorReservas(e.message))
      .finally(() => setLoadingReservas(false));
  };

  useEffect(() => {
    if (!state.token) return;
    cargarReservas();
  }, [state.token]);

  useEffect(() => {
    if (!state.token) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("status")) setTab("resultado_pago");
  }, [state.token]);

  if (!state.token) {
    return (
      <div className="app">
        <AccessibilityMenu />
        {vistaAuth === "login" ? (
          <Login onIrARegistro={() => setVistaAuth("registro")} />
        ) : (
          <Registro onIrALogin={() => setVistaAuth("login")} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <AccessibilityMenu />
      <header>
        <h1>Reserva de Espacios</h1>
        <nav>
          <button
            className={tab === "espacios" ? "active" : ""}
            onClick={() => setTab("espacios")}
          >
            Espacios
          </button>
          <button
            className={tab === "reservas" ? "active" : ""}
            onClick={() => setTab("reservas")}
          >
            Reservas
          </button>
          <button
            className={tab === "calendario" ? "active" : ""}
            onClick={() => setTab("calendario")}
          >
            Calendario
          </button>
          <button
            className={tab === "nueva" ? "active" : ""}
            onClick={() => setTab("nueva")}
          >
            Nueva reserva
          </button>
          <button
            className="logout-btn"
            onClick={() => dispatch({ type: AUTH_ACTIONS.LOGOUT })}
          >
            Cerrar sesión ({state.usuario?.email})
          </button>
        </nav>
      </header>

      <main>
        {tab === "espacios" && (
          <section>
            <h2>Espacios disponibles</h2>
            {loadingEspacios ? (
              <p className="empty">Cargando...</p>
            ) : errorEspacios ? (
              <p className="msg error">{errorEspacios}</p>
            ) : (
              <ListaEspacios espacios={espacios} />
            )}
          </section>
        )}

        {tab === "reservas" && (
          <section>
            <h2>Reservas</h2>
            {loadingReservas ? (
              <p className="empty">Cargando...</p>
            ) : errorReservas ? (
              <p className="msg error">{errorReservas}</p>
            ) : (
              <ListaReservas reservas={reservas} />
            )}
          </section>
        )}

        {tab === "calendario" && (
          <section>
            <h2>Calendario de reservas</h2>
            {loadingReservas ? (
              <p className="empty">Cargando...</p>
            ) : errorReservas ? (
              <p className="msg error">{errorReservas}</p>
            ) : (
              <CalendarioReservas reservas={reservas} espacios={espacios} />
            )}
          </section>
        )}

        {tab === "nueva" && (
          <section>
            <h2>Nueva reserva</h2>
            <FormReserva
              espacios={espacios}
              onReservada={(reserva) => {
                setReservaPendientePago(reserva);
                setTab("pago");
              }}
            />
          </section>
        )}

        {tab === "pago" && reservaPendientePago && (
          <section>
            <h2>Confirmar y pagar</h2>
            <PasoPago
              reserva={reservaPendientePago}
              espacios={espacios}
              onCancelar={() => {
                setReservaPendientePago(null);
                setTab("nueva");
              }}
            />
          </section>
        )}

        {tab === "resultado_pago" && (
          <section>
            <h2>Resultado del pago</h2>
            <PagoResultado
              onVolver={(destino) => {
                if (destino === "reservas") {
                  cargarReservas();
                  setTab("reservas");
                } else {
                  setReservaPendientePago(null);
                  setTab("nueva");
                }
              }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
