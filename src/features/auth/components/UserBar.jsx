import { useAuth } from "../context/AuthContext";

/**
 * Barra superior de la vista autenticada: nombre del usuario, insignia de rol ADMIN y botón Cerrar sesión.
 */
export function UserBar() {
    const { user, logout } = useAuth();

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '16px 0 0',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '16px',
        }}>
            {user.role === "ADMIN" && (
                <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                }}>
                    ADMIN
                </span>
            )}
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-h)' }}>{user.name}</span>
            <button
                onClick={logout}
                style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-h)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                }}
            >
                Cerrar sesión
            </button>
        </div>
    );
}
