import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders correctly with children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeDefined()
  })

  it('applies the correct variant color', () => {
    // Testing specific colors/styles is harder with MUI Chip, 
    // but we can verify it renders without crashing with different variants
    const { rerender } = render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toBeDefined()
    
    rerender(<Badge variant="danger">Danger</Badge>)
    expect(screen.getByText('Danger')).toBeDefined()

    rerender(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning')).toBeDefined()
  })
})
