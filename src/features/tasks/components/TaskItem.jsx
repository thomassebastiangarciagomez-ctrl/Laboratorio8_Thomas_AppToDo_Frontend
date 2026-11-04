
export function TaskItem({ task, onEdit, onDelete, onChangeStatus }) {
    const nextStatus = {
        PENDING: "IN_PROGRESS",
        IN_PROGRESS: "COMPLETED",
    }[task.status];

    const actionLabel = {
        PENDING: "Iniciar",
        IN_PROGRESS: "Completar",
    }[task.status];

    const priorityColors = {
        HIGH: '#ff4d4f',
        MEDIUM: '#faad14',
        LOW: '#52c41a'
    };

    return (
        <div style={{
                backgroundColor: 'var(--code-bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: 'var(--shadow)',
                transition: 'transform 0.15s ease, border-color 0.2s ease',
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: priorityColors[task.priority] || 'var(--text-h)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${priorityColors[task.priority] || 'var(--border)'}`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                    }}>
                        {task.priority}
                    </span>
                    <h4 style={{ 
                        margin: 0, 
                        fontSize: '30px', 
                        fontWeight: '600', 
                        color: 'var(--text-h)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {task.title}
                    </h4>
                </div>
                {task.description && (
                    <p style={{ margin: 0, fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>
                        {task.description}
                    </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    <span>
                        Estado: <strong style={{ color: 'var(--text-h)' }}>{task.status}</strong>
                    </span>
                    {task.dueDate && (
                    <span>
                    {task.dueDate}
                    </span>
                )}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {nextStatus && (
                    <button 
                        onClick={() => onChangeStatus(task, nextStatus)}
                        style={{
                        padding: '8px 14px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#fff',
                        backgroundColor: 'var(--accent)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease'
                        }}
                    >
                        {actionLabel}
                    </button>
                )}
                <button 
                onClick={() => onEdit(task)}
                style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-h)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                }}
                >
                Editar
                </button>
                <button 
                onClick={() => onDelete(task.id)}
                style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#ff4d4f',
                    backgroundColor: 'rgba(255, 77, 79, 0.1)',
                    border: '1px solid rgba(255, 77, 79, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                }}
                >
                Eliminar
                </button>
            </div>
        </div>
    );
}