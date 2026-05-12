import { createContext, useContext, useReducer } from "react";

// ── Estado inicial ──────────────────────────────────────────────────────────
const tokenGuardado = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

const initialState = {
  token: tokenGuardado || null,
  usuario: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
};

// ── Tipos de acción (flux) ──────────────────────────────────────────────────
export const AUTH_ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

// ── Reducer ─────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("usuario", JSON.stringify(action.payload.usuario));
      return {
        token: action.payload.token,
        usuario: action.payload.usuario,
      };
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("pagoPendiente");
      return { token: null, usuario: null };
    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
