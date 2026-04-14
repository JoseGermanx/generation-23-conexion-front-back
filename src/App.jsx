import { useEffect, useState } from "react";
import { getEspacios, getReservas } from "./api";
import ListaEspacios from "./components/ListaEspacios";
import ListaReservas from "./components/ListaReservas";
import FormReserva from "./components/FormReserva";
import "./App.css";

export default function App() {
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [tab, setTab] = useState("espacios");
  const [loadingEspacios, setLoadingEspacios] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [errorEspacios, setErrorEspacios] = useState("");
  const [errorReservas, setErrorReservas] = useState("");

  useEffect(() => {
    getEspacios()
      .then(setEspacios)
      .catch((e) => setErrorEspacios(e.message))
      .finally(() => setLoadingEspacios(false));
  }, []);

  const cargarReservas = () => {
    setLoadingReservas(true);
    getReservas()
      .then(setReservas)
      .catch((e) => setErrorReservas(e.message))
      .finally(() => setLoadingReservas(false));
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <div className="app">
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
            className={tab === "nueva" ? "active" : ""}
            onClick={() => setTab("nueva")}
          >
            Nueva reserva
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
              <ListaReservas reservas={reservas} espacios={espacios} />
            )}
          </section>
        )}

        {tab === "nueva" && (
          <section>
            <h2>Nueva reserva</h2>
            <FormReserva
              espacios={espacios}
              onCreada={() => {
                cargarReservas();
                setTab("reservas");
              }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
