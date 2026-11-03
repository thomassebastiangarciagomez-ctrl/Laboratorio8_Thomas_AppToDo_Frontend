import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from './TaskItem'

const baseTask = {
    id: 7,
    title: 'Entregar informe',
    description: 'Con evidencias',
    status: 'PENDING',
    priority: 'HIGH',
    dueDate: '2026-10-10',
}

function renderItem(overrides = {}) {
    const handlers = { onEdit: vi.fn(), onDelete: vi.fn(), onChangeStatus: vi.fn() }
    render(<TaskItem task={{ ...baseTask, ...overrides }} {...handlers} />)
    return handlers
}

describe('TaskItem', () => {
    test('muestra título, descripción, prioridad, estado y fecha', () => {
        renderItem()

        expect(screen.getByText('Entregar informe')).toBeTruthy()
        expect(screen.getByText('Con evidencias')).toBeTruthy()
        expect(screen.getByText('HIGH')).toBeTruthy()
        expect(screen.getByText('PENDING')).toBeTruthy()
        expect(screen.getByText('2026-10-10')).toBeTruthy()
    })

    test('no muestra descripción ni fecha cuando no existen', () => {
        renderItem({ description: null, dueDate: null })

        expect(screen.queryByText('Con evidencias')).toBeNull()
        expect(screen.queryByText('2026-10-10')).toBeNull()
    })

    test('una prioridad desconocida se muestra igualmente', () => {
        renderItem({ priority: 'URGENT' })

        expect(screen.getByText('URGENT')).toBeTruthy()
    })

    test('una tarea PENDING ofrece Iniciar y pasa a IN_PROGRESS', () => {
        const { onChangeStatus } = renderItem({ status: 'PENDING' })

        fireEvent.click(screen.getByRole('button', { name: 'Iniciar' }))

        expect(onChangeStatus).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }), 'IN_PROGRESS')
    })

    test('una tarea IN_PROGRESS ofrece Completar y pasa a COMPLETED', () => {
        const { onChangeStatus } = renderItem({ status: 'IN_PROGRESS' })

        fireEvent.click(screen.getByRole('button', { name: 'Completar' }))

        expect(onChangeStatus).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }), 'COMPLETED')
    })

    test('una tarea COMPLETED no ofrece avanzar de estado', () => {
        renderItem({ status: 'COMPLETED' })

        expect(screen.queryByRole('button', { name: 'Iniciar' })).toBeNull()
        expect(screen.queryByRole('button', { name: 'Completar' })).toBeNull()
        expect(screen.getByRole('button', { name: 'Editar' })).toBeTruthy()
    })

    test('Editar envía la tarea completa', () => {
        const { onEdit } = renderItem()

        fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

        expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 7, title: 'Entregar informe' }))
    })

    test('Eliminar envía el id de la tarea', () => {
        const { onDelete } = renderItem()

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

        expect(onDelete).toHaveBeenCalledWith(7)
    })
})
