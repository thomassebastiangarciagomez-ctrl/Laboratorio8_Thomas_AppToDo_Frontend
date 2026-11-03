import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ViewTabs } from './ViewTabs'

describe('ViewTabs', () => {
    it('marca "Mis tareas" como pestaña activa', () => {
        render(<ViewTabs view="tasks" onChange={() => {}} />)

        expect(screen.getByRole('button', { name: 'Mis tareas' }).getAttribute('aria-pressed')).toBe('true')
        expect(screen.getByRole('button', { name: 'Resumen' }).getAttribute('aria-pressed')).toBe('false')
    })

    it('marca "Resumen" cuando esa es la vista activa', () => {
        render(<ViewTabs view="summary" onChange={() => {}} />)

        expect(screen.getByRole('button', { name: 'Resumen' }).getAttribute('aria-pressed')).toBe('true')
        expect(screen.getByRole('button', { name: 'Mis tareas' }).getAttribute('aria-pressed')).toBe('false')
    })

    it('avisa cuál pestaña eligió el usuario', () => {
        const onChange = vi.fn()
        render(<ViewTabs view="tasks" onChange={onChange} />)

        fireEvent.click(screen.getByRole('button', { name: 'Resumen' }))
        fireEvent.click(screen.getByRole('button', { name: 'Mis tareas' }))

        expect(onChange).toHaveBeenNthCalledWith(1, 'summary')
        expect(onChange).toHaveBeenNthCalledWith(2, 'tasks')
    })
})
