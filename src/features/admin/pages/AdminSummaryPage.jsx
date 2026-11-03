import { useAdminSummary } from "../hooks/useAdminSummary";

const STATUS_LABELS = {
    PENDING: "Pendientes",
    IN_PROGRESS: "En progreso",
    COMPLETED: "Completadas",
};

const STATUS_COLORS = {
    PENDING: '#faad14',
    IN_PROGRESS: 'var(--accent)',
    COMPLETED: '#52c41a',
};

const cardStyle = {
    backgroundColor: 'var(--code-bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: 'var(--shadow)',
    flex: 1,
    minWidth: '180px',
};

const captionStyle = { margin: 0, fontSize: '15px', color: 'var(--text)' };

function StatCard({ id, label, value, color, percent }) {
    return (
        <div style={cardStyle}>
            <p style={captionStyle}>{label}</p>
            <p
                data-testid={`stat-${id}`}
                style={{ margin: '4px 0 0', fontSize: '40px', fontWeight: '600', color: color || 'var(--text-h)' }}
            >
                {value}
            </p>
            {percent !== undefined && (
                <>
                    <div style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--border)',
                        marginTop: '10px',
                        overflow: 'hidden',
                    }}>
                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: color }} />
                    </div>
                    <p style={{ ...captionStyle, fontSize: '13px', marginTop: '6px' }}>{percent}% del total</p>
                </>
            )}
        </div>
    );
}

/**
 * Vista del rol ADMIN: métricas agregadas del sistema (sin tareas privadas de nadie).
 */
export function AdminSummaryPage() {
    const { summary, loading, error, reload } = useAdminSummary();

    const total = summary?.totalTasks ?? 0;
    const percentOf = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
            <hr style={{
                border: 'none',
                height: '2px',
                width: '100%',
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                margin: '24px 0',
            }} />
            <h1 style={{ textAlign: 'center' }}>TO DO</h1>
            <hr style={{
                border: 'none',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                margin: '24px 0',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Resumen general</h2>
                <button
                    onClick={reload}
                    disabled={loading}
                    style={{
                        padding: '8px 14px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--text-h)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    Actualizar
                </button>
            </div>

            {loading && !summary && <p style={{ fontSize: '16px' }}>Cargando resumen...</p>}
            {error && <p role="alert" style={{ fontSize: '16px', color: '#ff4d4f' }}>Error: {error}</p>}

            {summary && (
                <>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        <StatCard id="users" label="Usuarios registrados" value={summary.totalUsers} />
                        <StatCard id="tasks" label="Tareas en el sistema" value={summary.totalTasks} />
                    </div>

                    <h2 style={{ fontSize: '20px', margin: '20px 0 12px' }}>Tareas por estado</h2>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        {Object.keys(STATUS_LABELS).map((status) => {
                            const count = summary.tasksByStatus?.[status] ?? 0;
                            return (
                                <StatCard
                                    key={status}
                                    id={status}
                                    label={STATUS_LABELS[status]}
                                    value={count}
                                    color={STATUS_COLORS[status]}
                                    percent={percentOf(count)}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
