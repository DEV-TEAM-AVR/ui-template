import { act, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { NotifierHost, notify } from './Notifier'

describe('notify', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows the message through the mounted host', async () => {
    render(<NotifierHost />)
    act(() => notify.error('No se pudo guardar'))
    expect(await screen.findByText('No se pudo guardar')).toBeDefined()
  })

  it('falls back to window.alert when no host is mounted', () => {
    const spy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    notify.info('Hola')
    expect(spy).toHaveBeenCalledWith('Hola')
  })
})
