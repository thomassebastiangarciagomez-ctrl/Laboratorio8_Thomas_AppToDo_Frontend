import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../../../api/authApi";
import { clearSession, setAuthToken, setUnauthorizedHandler } from "../../../api/session";

const AuthContext = createContext(null);

const SESSION_EXPIRED = "Tu sesión expiró. Inicia sesión de nuevo.";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [sessionNotice, setSessionNotice] = useState(null);

    // Si el backend responde 401 en una petición protegida, se cierra la sesión y se vuelve al login.
    useEffect(() => {
        setUnauthorizedHandler(() => {
            clearSession();
            setUser(null);
            setSessionNotice(SESSION_EXPIRED);
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    const login = useCallback(async ({ email, password }) => {
        const { accessToken } = await authApi.login({ email, password });
        setAuthToken(accessToken);
        try {
            const profile = await authApi.getProfile();
            setUser(profile);
            setSessionNotice(null);
        } catch (err) {
            clearSession();
            throw err;
        }
    }, []);

    const register = useCallback((data) => authApi.register(data), []);

    // El cierre de sesión es del lado del cliente: borra el token y el usuario del estado.
    const logout = useCallback(() => {
        clearSession();
        setUser(null);
        setSessionNotice(null);
    }, []);

    const value = useMemo(
        () => ({ user, isAuthenticated: user !== null, sessionNotice, login, register, logout }),
        [user, sessionNotice, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
