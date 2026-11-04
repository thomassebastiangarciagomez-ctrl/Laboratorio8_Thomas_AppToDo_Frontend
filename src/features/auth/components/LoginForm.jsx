import { useState } from "react";
import { PasswordInput } from "./PasswordInput";
import {
    cardStyle, dividerStyle, fieldStyle, labelStyle, inputStyle, primaryButtonStyle,
    linkButtonStyle, footerTextStyle, errorStyle, noticeStyle,
} from "./authStyles";

export function LoginForm({ onSubmit, onSwitchToRegister, notice, error, loading }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <div style={cardStyle}>
            <h1 style={{ textAlign: 'center' }}>TO DO</h1>
            <hr style={dividerStyle} />
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>INICIAR SESIÓN</h2>

            {notice && <p role="status" style={noticeStyle}>{notice}</p>}

            <form onSubmit={handleSubmit}>
                <div style={fieldStyle}>
                    <label htmlFor="login-email" style={labelStyle}>Correo</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={fieldStyle}>
                    <label htmlFor="login-password" style={labelStyle}>Contraseña</label>
                    <PasswordInput
                        id="login-password"
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {error && <p role="alert" style={errorStyle}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...primaryButtonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </div>
            </form>

            <p style={footerTextStyle}>
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={onSwitchToRegister} style={linkButtonStyle}>Regístrate</button>
            </p>
            <h2 style={{opacity: 0.0}}>------------------------- == ------------------------- == -------------------------</h2>
        </div>
    );
}
