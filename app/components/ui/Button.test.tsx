import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button, buttonClasses } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeDefined()
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Ok</Button>)
    expect(screen.getByRole('button').getAttribute('type')).toBe('button')
  })

  it('is disabled and busy while loading', () => {
    render(<Button loading>Guardar</Button>)
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(btn.getAttribute('aria-busy')).toBe('true')
  })

  it('maps variants to the semantic color tokens', () => {
    expect(buttonClasses({ variant: 'danger' })).toContain('bg-danger')
    expect(buttonClasses({ variant: 'accent' })).toContain('bg-accent')
    expect(buttonClasses()).toContain('bg-primary')
  })
})
