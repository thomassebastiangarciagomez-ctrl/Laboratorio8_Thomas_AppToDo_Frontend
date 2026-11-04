import { TaskItem } from "./TaskItem";

export function TaskList({ tasks, onEdit, onDelete, onChangeStatus }) {
    if (tasks.length === 0) {
        return <p>No hay tareas registradas.</p>;
    }

    return (
        <div>
            <h2 style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>Tareas</h2>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onChangeStatus={onChangeStatus}
                    
                />
            ))}
        </div>
    );
}
