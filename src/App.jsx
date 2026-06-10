import { useState, useEffect, useRef } from "react";

// ============================================================
// PANTALLA MAESTRA — OPERACIÓN: CÓDIGO VERDE
// Técnico Superior en Operaciones Logísticas
// Grupos OL-2-1 / OL-2-2 | EDA1001 | II Cuatrimestre 2026
// Instructora: Marilyn Ho Diéguez
// ============================================================

const GRUPOS = {
  "OL-2-2": {
    versiones: {
      A: { contrasena: "CONTENEDOR", equipos: ["ALFA", "GAMMA", "ÉPSILON"], color: "#00C896" },
      B: { contrasena: "ALMACENAJE", equipos: ["BETA", "DELTA"], color: "#FF9F1C" }
    }
  },
  "OL-2-1": {
    versiones: {
      A: { contrasena: "TRANSPORTE", equipos: ["ALFA", "GAMMA", "ÉPSILON"], color: "#00C896" },
      B: { contrasena: "INVENTARIO", equipos: ["BETA", "DELTA"], color: "#FF9F1C" }
    }
  }
};

const RETO_NOMBRES = [
  "La Huella que Deja Mover una Caja",
  "Marco Legal Ambiental Logístico",
  "Sostenibilidad Tridimensional",
  "Matriz de Aspectos e Impactos",
  "Economía Circular y Embalajes",
  "ISO 14001:2015 y el SGA",
  "Huella Hídrica / Ecológica",
  "KPIs Verdes",
  "Rutas Sostenibles y Multimodalidad",
  "Plan de Gestión Ambiental"
];

const TIEMPOS = [10,10,10,8,8,8,8,5,5,5];

export default function PantallaMaestra() {
  const [grupoActivo, setGrupoActivo] = useState("OL-2-2");
  const [timer, setTimer] = useState(90 * 60);
  const [activo, setActivo] = useState(false);
  const [retoActual, setRetoActual] = useState(0);
  const [timerReto, setTimerReto] = useState(TIEMPOS[0] * 60);
  const [progresos, setProgresos] = useState({});
  const intervalRef = useRef(null);
  const retoRef = useRef(null);

  const grupo = GRUPOS[grupoActivo];
  const todosEquipos = [...grupo.versiones.A.equipos, ...grupo.versiones.B.equipos];

  useEffect(() => {
    resetTodo();
  }, [grupoActivo]);

  const resetTodo = () => {
    setTimer(90 * 60);
    setActivo(false);
    setRetoActual(0);
    setTimerReto(TIEMPOS[0] * 60);
    setProgresos({});
    clearInterval(intervalRef.current);
    clearInterval(retoRef.current);
  };

  useEffect(() => {
    if (activo) {
      intervalRef.current = setInterval(() => {
        setTimer(t => { if (t <= 1) { clearInterval(intervalRef.current); return 0; } return t - 1; });
      }, 1000);
      retoRef.current = setInterval(() => {
        setTimerReto(t => { if (t <= 1) { clearInterval(retoRef.current); return 0; } return t - 1; });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(retoRef.current);
    }
    return () => { clearInterval(intervalRef.current); clearInterval(retoRef.current); };
  }, [activo]);

  const avanzarReto = () => {
    if (retoActual + 1 < 10) {
      const nuevo = retoActual + 1;
      setRetoActual(nuevo);
      setTimerReto(TIEMPOS[nuevo] * 60);
      clearInterval(retoRef.current);
      if (activo) {
        retoRef.current = setInterval(() => {
          setTimerReto(t => { if (t <= 1) { clearInterval(retoRef.current); return 0; } return t - 1; });
        }, 1000);
      }
    }
  };

  const marcarProgreso = (equipo, reto) => {
    setProgresos(prev => {
      const clave = `${equipo}-${reto}`;
      const nuevo = { ...prev };
      nuevo[clave] = !nuevo[clave];
      return nuevo;
    });
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const colorTimer = (s) => s < 300 ? "#F44336" : s < 1200 ? "#FF9800" : "#00C896";
  const colorReto = (s, max) => s < 60 ? "#F44336" : s < max * 0.3 ? "#FF9800" : "#64B5F6";
  const bloque = retoActual < 3 ? "CALENTAMIENTO" : retoActual < 7 ? "NÚCLEO TÉCNICO" : "SPRINT FINAL";
  const colorBloque = retoActual < 3 ? "#1B5E20" : retoActual < 7 ? "#0D47A1" : "#B71C1C";

  return (
    <div style={{ minHeight: "100vh", background: "#050D1A", color: "#E8F4F8", fontFamily: "'Segoe UI', Arial, sans-serif", padding: 16 }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8BA7C0", letterSpacing: 3, marginBottom: 4 }}>PANTALLA MAESTRA · DIRECTORA OPERATIVA</div>
        <h1 style={{ fontSize: 22, color: "#00C896", fontWeight: 900, margin: "0 0 4px", letterSpacing: 2 }}>OPERACIÓN: CÓDIGO VERDE</h1>
        <div style={{ fontSize: 11, color: "#8BA7C0" }}>Técnico Superior en Operaciones Logísticas · EDA1001 · II Cuatrimestre 2026</div>
      </div>

      {/* Selector de grupo */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {Object.keys(GRUPOS).map(g => (
          <button key={g} onClick={() => setGrupoActivo(g)}
            style={{ padding: "8px 20px", borderRadius: 8, border: `2px solid ${grupoActivo === g ? "#00C896" : "#1E3A5F"}`, background: grupoActivo === g ? "#00C89622" : "#112240", color: grupoActivo === g ? "#00C896" : "#8BA7C0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {g}
          </button>
        ))}
      </div>

      {/* Contraseñas */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.entries(grupo.versiones).map(([ver, data]) => (
          <div key={ver} style={{ flex: 1, background: "#112240", border: `1px solid #1E3A5F`, borderRadius: 10, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#8BA7C0", letterSpacing: 2, marginBottom: 4 }}>VERSIÓN {ver} · {data.equipos.join(" · ")}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: data.color, letterSpacing: 3, fontFamily: "monospace" }}>{data.contrasena}</div>
          </div>
        ))}
      </div>

      {/* Timers principales */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 2, background: "#0D2137", border: "2px solid #1E3A5F", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#8BA7C0", letterSpacing: 3, marginBottom: 4 }}>⏱ TIEMPO GLOBAL</div>
          <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "monospace", color: colorTimer(timer) }}>{fmt(timer)}</div>
        </div>
        <div style={{ flex: 1, background: colorBloque, borderRadius: 12, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, marginBottom: 2 }}>{bloque}</div>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>RETO {retoActual + 1}/10</div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace", color: colorReto(timerReto, TIEMPOS[retoActual] * 60) }}>{fmt(timerReto)}</div>
        </div>
      </div>

      {/* Reto activo */}
      <div style={{ background: "#112240", border: `1px solid ${colorBloque}`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#8BA7C0", marginBottom: 4, letterSpacing: 2 }}>RETO ACTIVO</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#E8F4F8" }}>🔒 {RETO_NOMBRES[retoActual]}</div>
        <div style={{ fontSize: 11, color: "#8BA7C0", marginTop: 4 }}>Tiempo asignado: {TIEMPOS[retoActual]} minutos</div>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setActivo(!activo)}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "none", background: activo ? "#F44336" : "#00C896", color: "#000", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
          {activo ? "⏸ PAUSAR" : "▶ INICIAR"}
        </button>
        <button onClick={avanzarReto} disabled={retoActual >= 9}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "none", background: retoActual >= 9 ? "#1E3A5F" : "#0D47A1", color: retoActual >= 9 ? "#8BA7C0" : "#FFF", fontWeight: 700, fontSize: 13, cursor: retoActual >= 9 ? "default" : "pointer" }}>
          ⏭ SIGUIENTE RETO
        </button>
        <button onClick={resetTodo}
          style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #1E3A5F", background: "transparent", color: "#8BA7C0", fontSize: 12, cursor: "pointer" }}>
          ↺ RESET
        </button>
      </div>

      {/* Tablero de equipos */}
      <div style={{ background: "#112240", border: "1px solid #1E3A5F", borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 11, color: "#8BA7C0", letterSpacing: 2, marginBottom: 10 }}>📊 TABLERO DE PROGRESO — {grupoActivo}</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 8px", textAlign: "left", color: "#8BA7C0", fontWeight: 600 }}>EQUIPO</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i} style={{ padding: "4px", textAlign: "center", color: i < 3 ? "#4CAF50" : i < 7 ? "#64B5F6" : "#FF7043", fontWeight: 700, minWidth: 28 }}>{i + 1}</th>
                ))}
                <th style={{ padding: "6px 8px", textAlign: "center", color: "#FFD700" }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {todosEquipos.map(eq => {
                const ver = grupo.versiones.A.equipos.includes(eq) ? "A" : "B";
                const total = Array.from({ length: 10 }, (_, i) => progresos[`${eq}-${i}`] ? 1 : 0).reduce((a, b) => a + b, 0);
                return (
                  <tr key={eq}>
                    <td style={{ padding: "6px 8px", fontWeight: 700, color: grupo.versiones[ver].color }}>{eq} <span style={{ fontSize: 9, color: "#8BA7C0" }}>V{ver}</span></td>
                    {Array.from({ length: 10 }, (_, i) => (
                      <td key={i} style={{ padding: "3px", textAlign: "center" }}>
                        <button onClick={() => marcarProgreso(eq, i)}
                          style={{ width: 22, height: 22, borderRadius: 4, border: "none", background: progresos[`${eq}-${i}`] ? "#00C896" : "#1E3A5F", cursor: "pointer", fontSize: 9, color: progresos[`${eq}-${i}`] ? "#000" : "#8BA7C0", fontWeight: 700 }}>
                          {progresos[`${eq}-${i}`] ? "✓" : i + 1}
                        </button>
                      </td>
                    ))}
                    <td style={{ padding: "6px 8px", textAlign: "center", fontSize: 16, fontWeight: 900, color: total >= 8 ? "#00C896" : total >= 5 ? "#FFD700" : "#FF7043" }}>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 10, color: "#8BA7C0", marginTop: 8 }}>Toca los cuadros para marcar el avance de cada equipo en tiempo real.</div>
      </div>
    </div>
  );
}
