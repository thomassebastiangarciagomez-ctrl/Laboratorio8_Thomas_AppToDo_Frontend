// Estilos compartidos por los formularios de autenticación. Reutilizan las variables CSS del sistema
// (--accent, --border, --code-bg, --text-h, --shadow) para mantener la misma identidad visual.

export const cardStyle = {
    maxWidth: '420px',
    margin: '40px auto',
    padding: '8px 32px 28px',
    backgroundColor: 'var(--code-bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    textAlign: 'left',
};

export const dividerStyle = {
    border: 'none',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
    margin: '8px 0 20px',
};

export const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '14px',
};

export const labelStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--text-h)',
};

export const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    outline: 'none',
    boxSizing: 'border-box',
};

export const hintStyle = {
    fontSize: '13px',
    color: 'var(--text)',
};

export const primaryButtonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow)',
};

export const linkButtonStyle = {
    padding: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--accent)',
    backgroundColor: 'transparent',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
};

export const footerTextStyle = {
    textAlign: 'center',
    fontSize: '15px',
    color: 'var(--text)',
    marginTop: '18px',
};

export const errorStyle = {
    fontSize: '15px',
    color: '#ff4d4f',
    margin: '4px 0 0',
};

export const noticeStyle = {
    fontSize: '15px',
    color: 'var(--accent)',
    textAlign: 'center',
    margin: '0 0 16px',
};
