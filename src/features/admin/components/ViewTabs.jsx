const tabs = [
    { id: "tasks", label: "Mis tareas" },
    { id: "summary", label: "Resumen" },
];

/**
 * Navegación entre "Mis tareas" y "Resumen". Solo se muestra al rol ADMIN; la restricción real
 * la aplica el backend (/admin/summary responde 403 a un USER).
 */
export function ViewTabs({ view, onChange }) {
    return (
        <nav style={{
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            gap: '8px',
            paddingTop: '8px',
        }}>
            {tabs.map((tab) => {
                const active = view === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        aria-pressed={active}
                        style={{
                            padding: '8px 14px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: active ? '#fff' : 'var(--text-h)',
                            backgroundColor: active ? 'var(--accent)' : 'transparent',
                            border: active ? 'none' : '1px solid var(--border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </nav>
    );
}
