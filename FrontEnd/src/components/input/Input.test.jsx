import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import Input from './Input';

// Wrapper component để cung cấp control từ useForm
const InputWrapper = ({ name = 'testInput', ...props }) => {
  const { control } = useForm({
    defaultValues: {
      [name]: '',
    },
  });
  return <Input name={name} control={control} {...props} />;
};

describe('Input Component', () => {
  test('renders input field', () => {
    render(<InputWrapper name="testInput" placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  test('handles user input', async () => {
    const user = userEvent.setup();
    render(<InputWrapper name="testInput" />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  test('updates value when user types', async () => {
    const user = userEvent.setup();
    render(<InputWrapper name="testInput" />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test');
    expect(input).toHaveValue('test');
  });

  test('renders input with name attribute', () => {
    render(<InputWrapper name="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'email');
  });

  test('renders input with children (icon)', () => {
    render(
      <InputWrapper name="search">
        <span data-testid="icon">🔍</span>
      </InputWrapper>
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });

  test('renders input with different types', () => {
    render(<InputWrapper name="password" type="password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });
});