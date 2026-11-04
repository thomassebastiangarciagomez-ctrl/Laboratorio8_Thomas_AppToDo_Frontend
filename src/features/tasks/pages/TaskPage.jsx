import { useState } from 'react'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { useTasks } from '../hooks/useTasks'

export function TaskPage() {
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks()
  const [editingTask, setEditingTask] = useState(null)

  async function handleSubmit(taskData) {
    try {
      if (editingTask) {
        await editTask(editingTask.id, taskData)
        setEditingTask(null)
      } else {
        await addTask(taskData)
      }
    } catch (err) {
      console.error(err)
      alert("No se pudo guardar la tarea: " + err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await removeTask(id)
    } catch (err) {
      console.error(err)
      alert("No se pudo eliminar la tarea: " + err.message)
    }
  }

  function handleEdit(task) {
    setEditingTask(task)
  }

  function handleCancelEdit() {
    setEditingTask(null)
  }

  async function handleChangeStatus(task, newStatus) {
    try {
      await editTask(task.id, { ...task, status: newStatus })
    } catch (err) {
      console.error(err)
      alert("No se pudo actualizar la tarea: " + err.message)
    }
  }

  return (
    <>
      <TaskForm
        onSubmit={handleSubmit}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
      />
    </>
  )
}
