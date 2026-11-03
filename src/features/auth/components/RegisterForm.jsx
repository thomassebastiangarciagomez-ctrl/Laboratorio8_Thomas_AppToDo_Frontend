import { useState } from "react";
import { PasswordInput } from "./PasswordInput";
import {
    cardStyle, dividerStyle, fieldStyle, labelStyle, inputStyle, hintStyle, primaryButtonStyle,
    linkButtonStyle, footerTextStyle, errorStyle,
} from "./authStyles";

export function RegisterForm({ onSubmit, onSwitchToLogin, error, loading }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ name, email, password });
    }

    return (
        <div style={cardStyle}>
            <h1 style={{ textAlign: 'center' }}>TO DO</h1>
            <hr style={dividerStyle} />
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>CREAR CUENTA</h2>

            <form onSubmit={handleSubmit}>
                <div style={fieldStyle}>
                    <label htmlFor="register-name" style={labelStyle}>Nombre</label>
                    <input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                        style={inputStyle}
                    />
                </div>

                <div style={fieldStyle}>
                    <label htmlFor="register-email" style={labelStyle}>Correo</label>
                    <input
                        id="register-email"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={fieldStyle}>
                    <label htmlFor="register-password" style={labelStyle}>Contraseña</label>
                    <PasswordInput
                        id="register-password"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={72}
                        autoComplete="new-password"
                    />
                    <span style={hintStyle}>Mínimo 8 caracteres.</span>
                </div>

                {error && <p role="alert" style={errorStyle}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...primaryButtonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                </div>
            </form>

            <p style={footerTextStyle}>
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={onSwitchToLogin} style={linkButtonStyle}>Inicia sesión</button>
            </p>
            <h2 style={{opacity: 0.0}}>------------------------- == ------------------------- == -------------------------</h2>
        </div>
    );
}
