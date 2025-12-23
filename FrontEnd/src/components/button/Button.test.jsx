import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from './Button';

// Mock LoadingSpinner
jest.mock('../loading/LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders as Link when to prop is provided', () => {
    renderWithRouter(<Button to="/home">Go Home</Button>);
    const link = screen.getByText('Go Home').closest('a');
    expect(link).toHaveAttribute('href', '/home');
  });

  test('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading={true}>Submit</Button>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  test('applies secondary background style', () => {
    render(<Button bg="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toBeInTheDocument();
  });

  test('button is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });
});