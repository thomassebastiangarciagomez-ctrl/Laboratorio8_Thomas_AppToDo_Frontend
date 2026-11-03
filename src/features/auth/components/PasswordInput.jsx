import { useState } from "react";
import { inputStyle } from "./authStyles";

function EyeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.77 19.77 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a19.86 19.86 0 0 1-3.17 4.19M14.12 14.12A3 3 0 1 1 9.88 9.88" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

/**
 * Campo de contraseña con botón para alternar entre puntos y texto visible.
 */
export function PasswordInput({ id, value, onChange, placeholder, required, minLength, maxLength, autoComplete }) {
    const [visible, setVisible] = useState(false);
    const label = visible ? "Ocultar contraseña" : "Mostrar contraseña";

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input
                id={id}
                type={visible ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                autoComplete={autoComplete}
                style={{ ...inputStyle, paddingRight: '46px', margin: 0 }}
            />
            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                aria-label={label}
                aria-pressed={visible}
                title={label}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    color: 'var(--text)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    height: '24px', // Altura fija para evitar desbordamientos
                }}
            >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );
}