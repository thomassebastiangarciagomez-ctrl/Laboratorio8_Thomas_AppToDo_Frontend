import { useState, useEffect } from "react";

export function TaskForm({ onSubmit, editingTask, onCancelEdit }){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("PENDING");

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || "");
            setPriority(editingTask.priority);
            setDueDate(editingTask.dueDate || "");
            setStatus(editingTask.status);
        }
    }, [editingTask]);

    function resetForm() {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDueDate("");
        setStatus("PENDING");
    }

    function handleSubmit(e) {
        e.preventDefault();
        const taskData = { title, description, priority, dueDate: dueDate || null, status };
        onSubmit(taskData);
        resetForm();
    }

    return(
    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
        <hr 
          style={{
            border: 'none',
            height: '2px',
            width: '100%',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            margin: '24px 0'
          }}
        />
        <h1 style={{ textAlign: 'center' }}>TO DO</h1>
        <hr 
            style={{
            border: 'none',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            margin: '24px 0'
        }}/>

        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>{editingTask ? "Editar tarea" : "Nueva tarea"}</h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-h)' }}>
              Título *:
            </label>
            <input 
              type="text"
              placeholder="Escribe el título de la tarea..."
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{
                width: '50%',
                padding: '10px 14px',
                fontSize: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--code-bg)',
                color: 'var(--text-h)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-h)' }}>
              Descripción *:
            </label>
            <textarea 
              placeholder="Escribe la descripción..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--code-bg)',
                color: 'var(--text-h)',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-h)' }}>
                Prioridad:
            </label>
            <select value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                style={{
                    width: '50%',
                    padding: '10px 14px',
                    fontSize: '15px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--code-bg)',
                    color: 'var(--text-h)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                }}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
            </select>
          </div>

          {editingTask && (
          <div>
              <label style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-h)' }}>
                  Estado:
              </label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '10px 14px',
                    fontSize: '15px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--code-bg)',
                    color: 'var(--text-h)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
          </div>
          )}

          <div>
            <label style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-h)' }}>
                Fecha límite *:
            </label>
            <input type="date"
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                width: '50%',
                padding: '10px 14px',
                fontSize: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--code-bg)',
                color: 'var(--text-h)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button type="submit"
                style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow)',
                transition: 'transform 0.1s ease, opacity 0.2s ease',
                }}
            >
            Guardar
            </button>
            {editingTask && (
                <button type="button" onClick={onCancelEdit}>Cancelar</button>
            )}
          </div>
          <h2 style={{opacity: 0.0}}>------------------------- == ------------------------- == -------------------------</h2>
          <hr 
              style={{
                border: 'none',
                height: '2px',
                width: '100%',
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                margin: '24px 0'
               }}
           />

        </form>
    </div>
    )
}