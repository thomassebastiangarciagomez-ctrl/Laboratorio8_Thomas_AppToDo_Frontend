import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../../../api/taskApi"

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    async function addTask(taskData) {
        setError(null);
        try {
            const newTask = await createTask(taskData);
            setTasks((prev) => [...prev, newTask]);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function editTask(id, taskData) {
        setError(null);
        try {
            const updated = await updateTask(id, taskData);
            setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function removeTask(id) {
        setError(null);
        try {
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    return { tasks, loading, error, loadTasks, addTask, editTask, removeTask };
}
