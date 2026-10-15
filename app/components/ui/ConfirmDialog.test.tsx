import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { ConfirmDialogHost, confirmDialog } from './ConfirmDialog'

describe('confirmDialog', () => {
  afterEach(() => vi.restoreAllMocks())

  it('resolves true when the user confirms', async () => {
    render(<ConfirmDialogHost />)
    let result: Promise<boolean>
    act(() => {
      result = confirmDialog({ message: '¿Eliminar?', confirmText: 'Eliminar', tone: 'danger' })
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar' }))
    await expect(result!).resolves.toBe(true)
  })

  it('resolves false when the user cancels', async () => {
    render(<ConfirmDialogHost />)
    let result: Promise<boolean>
    act(() => {
      result = confirmDialog('¿Seguro?')
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar' }))
    await expect(result!).resolves.toBe(false)
  })

  it('falls back to window.confirm when no host is mounted', async () => {
    const spy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    await expect(confirmDialog('¿Seguro?')).resolves.toBe(true)
    expect(spy).toHaveBeenCalledWith('¿Seguro?')
  })
})
