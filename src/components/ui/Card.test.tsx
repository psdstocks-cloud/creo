import { render, screen } from '@/test-utils'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card'

describe('Card', () => {
  it('renders Card component correctly', () => {
    render(
      <Card data-testid="card">
        <CardContent>Card content</CardContent>
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-xl border transition-all duration-200 bg-white border-gray-200 shadow-sm')
  })

  it('renders CardHeader correctly', () => {
    render(
      <Card>
        <CardHeader data-testid="card-header">
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    )
    const header = screen.getByTestId('card-header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex flex-col space-y-1.5 p-6')
  })

  it('renders CardTitle correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle data-testid="card-title">Test Title</CardTitle>
        </CardHeader>
      </Card>
    )
    const title = screen.getByTestId('card-title')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg font-semibold leading-none tracking-tight')
    expect(title).toHaveTextContent('Test Title')
  })

  it('renders CardDescription correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription data-testid="card-description">
            Test description
          </CardDescription>
        </CardHeader>
      </Card>
    )
    const description = screen.getByTestId('card-description')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-sm text-gray-600')
    expect(description).toHaveTextContent('Test description')
  })

  it('renders CardContent correctly', () => {
    render(
      <Card>
        <CardContent data-testid="card-content">
          Card content goes here
        </CardContent>
      </Card>
    )
    const content = screen.getByTestId('card-content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('p-6 pt-0')
    expect(content).toHaveTextContent('Card content goes here')
  })

  it('renders CardFooter correctly', () => {
    render(
      <Card>
        <CardFooter data-testid="card-footer">
          <button>Action</button>
        </CardFooter>
      </Card>
    )
    const footer = screen.getByTestId('card-footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('flex items-center p-6 pt-0')
  })

  it('renders complete card structure', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('complete-card')).toBeInTheDocument()
    expect(screen.getByText('Complete Card')).toBeInTheDocument()
    expect(screen.getByText('This is a complete card example')).toBeInTheDocument()
    expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
  })

  it('applies custom className to Card', () => {
    render(
      <Card className="custom-card-class" data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    )
    const card = screen.getByTestId('custom-card')
    expect(card).toHaveClass('custom-card-class')
  })

  it('applies custom className to CardHeader', () => {
    render(
      <Card>
        <CardHeader className="custom-header-class" data-testid="custom-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    const header = screen.getByTestId('custom-header')
    expect(header).toHaveClass('custom-header-class')
  })

  it('applies custom className to CardContent', () => {
    render(
      <Card>
        <CardContent className="custom-content-class" data-testid="custom-content">
          Content
        </CardContent>
      </Card>
    )
    const content = screen.getByTestId('custom-content')
    expect(content).toHaveClass('custom-content-class')
  })

  it('applies custom className to CardFooter', () => {
    render(
      <Card>
        <CardFooter className="custom-footer-class" data-testid="custom-footer">
          Footer
        </CardFooter>
      </Card>
    )
    const footer = screen.getByTestId('custom-footer')
    expect(footer).toHaveClass('custom-footer-class')
  })

  it('forwards ref correctly for Card', () => {
    const ref = jest.fn()
    render(
      <Card ref={ref} data-testid="ref-card">
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(ref).toHaveBeenCalled()
  })

  it('forwards ref correctly for CardHeader', () => {
    const ref = jest.fn()
    render(
      <Card>
        <CardHeader ref={ref} data-testid="ref-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(ref).toHaveBeenCalled()
  })

  it('forwards ref correctly for CardContent', () => {
    const ref = jest.fn()
    render(
      <Card>
        <CardContent ref={ref} data-testid="ref-content">
          Content
        </CardContent>
      </Card>
    )
    expect(ref).toHaveBeenCalled()
  })

  it('forwards ref correctly for CardFooter', () => {
    const ref = jest.fn()
    render(
      <Card>
        <CardFooter ref={ref} data-testid="ref-footer">
          Footer
        </CardFooter>
      </Card>
    )
    expect(ref).toHaveBeenCalled()
  })

  it('renders without CardHeader', () => {
    render(
      <Card data-testid="no-header-card">
        <CardContent>Content only</CardContent>
      </Card>
    )
    expect(screen.getByTestId('no-header-card')).toBeInTheDocument()
    expect(screen.getByText('Content only')).toBeInTheDocument()
  })

  it('renders without CardFooter', () => {
    render(
      <Card data-testid="no-footer-card">
        <CardHeader>
          <CardTitle>Title Only</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByTestId('no-footer-card')).toBeInTheDocument()
    expect(screen.getByText('Title Only')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders with multiple children in CardContent', () => {
    render(
      <Card>
        <CardContent>
          <h3>Heading</h3>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </CardContent>
      </Card>
    )
    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })
})
