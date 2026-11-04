import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

/**
 * Se muestra cuando no hay una sesión válida: alterna entre inicio de sesión y registro.
 */
export function AuthPage() {
    const { login, register, sessionNotice } = useAuth();
    const [mode, setMode] = useState("login");
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(false);

    function switchTo(newMode) {
        setError(null);
        setMode(newMode);
    }

    async function handleLogin(credentials) {
        setLoading(true);
        setError(null);
        try {
            await login(credentials);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(data) {
        setLoading(true);
        setError(null);
        try {
            await register(data);
            setNotice("Cuenta creada. Ya puedes iniciar sesión.");
            setMode("login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (mode === "register") {
        return (
            <RegisterForm
                onSubmit={handleRegister}
                onSwitchToLogin={() => switchTo("login")}
                error={error}
                loading={loading}
            />
        );
    }

    return (
        <LoginForm
            onSubmit={handleLogin}
            onSwitchToRegister={() => { setNotice(null); switchTo("register"); }}
            notice={notice ?? sessionNotice}
            error={error}
            loading={loading}
        />
    );
}
