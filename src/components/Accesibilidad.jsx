import { useEffect, useState } from "react";
import "./Accesibilidad.css"

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    grayscale: false,
    underlineLinks: false,
  });

  // cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("a11y");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // aplicar clases al body + guardar
  useEffect(() => {
    const body = document.body;

    body.classList.toggle("large-text", settings.largeText);
    body.classList.toggle("high-contrast", settings.highContrast);
    body.classList.toggle("grayscale", settings.grayscale);
    body.classList.toggle("underline-links", settings.underlineLinks);

    localStorage.setItem("a11y", JSON.stringify(settings));
  }, [settings]);

  // cerrar con ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <button
        className="a11y-btn"
        aria-label="Abrir menú de accesibilidad"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Accesibilidad
      </button>

      {open && (
        <div className="a11y-panel" role="dialog">
          <h3>Opciones</h3>

          <button onClick={() => toggle("largeText")}>
            Texto grande
          </button>

          <button onClick={() => toggle("highContrast")}>
            Alto contraste
          </button>

          <button onClick={() => toggle("grayscale")}>
            Escala de grises
          </button>

          <button onClick={() => toggle("underlineLinks")}>
            Subrayar enlaces
          </button>
        </div>
      )}
    </>
  );
}