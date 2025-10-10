import { render, screen, fireEvent } from '@/test-utils'
import { Input } from './Input'

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('input')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number" />)
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')

    rerender(<Input type="search" placeholder="Search" />)
    expect(screen.getByPlaceholderText('Search')).toHaveAttribute('type', 'search')
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} placeholder="Test input" />)
    const input = screen.getByPlaceholderText('Test input')
    
    fireEvent.change(input, { target: { value: 'test value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('input')
  })

  it('can be read-only', () => {
    render(<Input readOnly placeholder="Read-only input" />)
    const input = screen.getByPlaceholderText('Read-only input')
    expect(input).toHaveAttribute('readonly')
  })

  it('renders with error state', () => {
    render(<Input className="border-red-500" placeholder="Error input" />)
    const input = screen.getByPlaceholderText('Error input')
    expect(input).toHaveClass('border-red-500')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />)
    const input = screen.getByPlaceholderText('Custom input')
    expect(input).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Input ref={ref} placeholder="Ref input" />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Focus test" 
      />
    )
    const input = screen.getByPlaceholderText('Focus test')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    render(
      <Input 
        onKeyDown={handleKeyDown} 
        onKeyUp={handleKeyUp} 
        placeholder="Keyboard test" 
      />
    )
    const input = screen.getByPlaceholderText('Keyboard test')
    
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(input, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('supports all input HTML attributes', () => {
    render(
      <Input 
        name="test-input"
        id="test-input"
        required
        minLength={5}
        maxLength={20}
        pattern="[a-zA-Z]+"
        data-testid="test-input"
        placeholder="Test input"
      />
    )
    const input = screen.getByPlaceholderText('Test input')
    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('minLength', '5')
    expect(input).toHaveAttribute('maxLength', '20')
    expect(input).toHaveAttribute('pattern', '[a-zA-Z]+')
    expect(input).toHaveAttribute('data-testid', 'test-input')
  })

  it('renders with label when provided', () => {
    render(
      <div>
        <label htmlFor="test-input">Test Label</label>
        <Input id="test-input" placeholder="Test input" />
      </div>
    )
    const label = screen.getByText('Test Label')
    const input = screen.getByPlaceholderText('Test input')
    expect(label).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('handles controlled input correctly', () => {
    const { rerender } = render(<Input value="initial" placeholder="Controlled" />)
    const input = screen.getByPlaceholderText('Controlled')
    expect(input).toHaveValue('initial')

    rerender(<Input value="updated" placeholder="Controlled" />)
    expect(input).toHaveValue('updated')
  })
})
