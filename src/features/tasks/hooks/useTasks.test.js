import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import * as taskApi from '../../../api/taskApi'

vi.mock('../../../api/taskApi')

const TASK_A = { id: 1, title: 'Tarea A', status: 'PENDING', priority: 'LOW' }
const TASK_B = { id: 2, title: 'Tarea B', status: 'PENDING', priority: 'HIGH' }

async function renderLoaded() {
    const hook = renderHook(() => useTasks())
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    return hook
}

/** Ejecuta una acción del hook y devuelve el error que lanzó (o undefined si no lanzó). */
async function captureError(action) {
    let captured
    await act(async () => {
        try {
            await action()
        } catch (err) {
            captured = err
        }
    })
    return captured
}

describe('useTasks', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        taskApi.getTasks.mockResolvedValue([TASK_A])
    })

    test('carga las tareas al montar', async () => {
        const { result } = renderHook(() => useTasks())
        expect(result.current.loading).toBe(true)

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.tasks).toEqual([TASK_A])
        expect(result.current.error).toBeNull()
    })

    test('guarda el mensaje de error si la carga falla', async () => {
        taskApi.getTasks.mockRejectedValue(new Error('Sin conexión'))

        const { result } = await renderLoaded()

        expect(result.current.error).toBe('Sin conexión')
        expect(result.current.tasks).toEqual([])
    })

    test('loadTasks vuelve a consultar la API', async () => {
        const { result } = await renderLoaded()
        taskApi.getTasks.mockResolvedValue([TASK_A, TASK_B])

        await act(async () => {
            await result.current.loadTasks()
        })

        expect(result.current.tasks).toEqual([TASK_A, TASK_B])
        expect(taskApi.getTasks).toHaveBeenCalledTimes(2)
    })

    test('addTask agrega la tarea creada al final de la lista', async () => {
        taskApi.createTask.mockResolvedValue(TASK_B)
        const { result } = await renderLoaded()

        await act(async () => {
            await result.current.addTask({ title: 'Tarea B' })
        })

        expect(taskApi.createTask).toHaveBeenCalledWith({ title: 'Tarea B' })
        expect(result.current.tasks).toEqual([TASK_A, TASK_B])
    })

    test('addTask guarda el error y lo vuelve a lanzar', async () => {
        taskApi.createTask.mockRejectedValue(new Error('Datos inválidos'))
        const { result } = await renderLoaded()

        const err = await captureError(() => result.current.addTask({ title: '' }))

        expect(err.message).toBe('Datos inválidos')
        expect(result.current.error).toBe('Datos inválidos')
        expect(result.current.tasks).toEqual([TASK_A])
    })

    test('editTask reemplaza la tarea actualizada', async () => {
        const updated = { ...TASK_A, title: 'Tarea A editada' }
        taskApi.updateTask.mockResolvedValue(updated)
        const { result } = await renderLoaded()

        await act(async () => {
            await result.current.editTask(1, { title: 'Tarea A editada' })
        })

        expect(taskApi.updateTask).toHaveBeenCalledWith(1, { title: 'Tarea A editada' })
        expect(result.current.tasks).toEqual([updated])
    })

    test('editTask guarda el error y lo vuelve a lanzar', async () => {
        taskApi.updateTask.mockRejectedValue(new Error('Tarea no encontrada'))
        const { result } = await renderLoaded()

        const err = await captureError(() => result.current.editTask(99, {}))

        expect(err.message).toBe('Tarea no encontrada')
        expect(result.current.error).toBe('Tarea no encontrada')
        expect(result.current.tasks).toEqual([TASK_A])
    })

    test('removeTask quita la tarea eliminada', async () => {
        taskApi.deleteTask.mockResolvedValue(null)
        const { result } = await renderLoaded()

        await act(async () => {
            await result.current.removeTask(1)
        })

        expect(taskApi.deleteTask).toHaveBeenCalledWith(1)
        expect(result.current.tasks).toEqual([])
    })

    test('removeTask guarda el error y conserva la lista', async () => {
        taskApi.deleteTask.mockRejectedValue(new Error('No tienes permisos'))
        const { result } = await renderLoaded()

        const err = await captureError(() => result.current.removeTask(1))

        expect(err.message).toBe('No tienes permisos')
        expect(result.current.error).toBe('No tienes permisos')
        expect(result.current.tasks).toEqual([TASK_A])
    })
})
