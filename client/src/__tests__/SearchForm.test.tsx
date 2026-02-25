import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render origin input', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    });

    it('should render destination input', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    });

    it('should render departure date input', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
    });

    it('should render passengers select', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
    });

    it('should render trip type radio buttons', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/round trip/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/one way/i)).toBeInTheDocument();
    });

    it('should render search button', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
    });

    it('should render compact form when compact prop is true', () => {
      render(<SearchForm onSearch={mockOnSearch} compact />);

      expect(screen.getByPlaceholderText(/from/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/to/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('should show return date field when round trip is selected', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      const roundTripRadio = screen.getByLabelText(/round trip/i);
      fireEvent.click(roundTripRadio);

      expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    });

    it('should hide return date field when one way is selected', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      const oneWayRadio = screen.getByLabelText(/one way/i);
      fireEvent.click(oneWayRadio);

      expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();
    });
  });

  describe('Initial values', () => {
    it('should populate fields with initial values', () => {
      render(
        <SearchForm
          onSearch={mockOnSearch}
          initialValues={{
            origin: 'JFK',
            destination: 'LHR',
            departureDate: '2025-06-15',
            adults: 2,
          }}
        />
      );

      expect(screen.getByLabelText(/from/i)).toHaveValue('JFK');
      expect(screen.getByLabelText(/to/i)).toHaveValue('LHR');
      expect(screen.getByLabelText(/departure date/i)).toHaveValue('2025-06-15');
      expect(screen.getByLabelText(/passengers/i)).toHaveValue('2');
    });

    it('should set round trip when returnDate is provided', () => {
      render(
        <SearchForm
          onSearch={mockOnSearch}
          initialValues={{
            returnDate: '2025-06-22',
          }}
        />
      );

      expect(screen.getByLabelText(/round trip/i)).toBeChecked();
    });
  });

  describe('Input handling', () => {
    it('should convert origin input to uppercase', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const originInput = screen.getByLabelText(/from/i);
      await user.type(originInput, 'jfk');

      expect(originInput).toHaveValue('JFK');
    });

    it('should convert destination input to uppercase', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const destInput = screen.getByLabelText(/to/i);
      await user.type(destInput, 'lhr');

      expect(destInput).toHaveValue('LHR');
    });

    it('should limit airport code to 3 characters', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const originInput = screen.getByLabelText(/from/i);
      await user.type(originInput, 'jfkextra');

      expect(originInput).toHaveValue('JFK');
    });

    it('should allow changing number of passengers', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const passengersSelect = screen.getByLabelText(/passengers/i);
      await user.selectOptions(passengersSelect, '3');

      expect(passengersSelect).toHaveValue('3');
    });
  });

  describe('Form submission', () => {
    it('should call onSearch with form values when submitted', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      fireEvent.change(screen.getByLabelText(/from/i), { target: { value: 'JFK' } });
      fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'LHR' } });
      fireEvent.change(screen.getByLabelText(/departure date/i), { target: { value: '2025-06-15' } });

      fireEvent.click(screen.getByLabelText(/one way/i));

      const form = screen.getByRole('button', { name: /search flights/i }).closest('form');
      fireEvent.submit(form!);

      expect(mockOnSearch).toHaveBeenCalledWith({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2025-06-15',
        returnDate: undefined,
        adults: 1,
      });
    });

    it('should include returnDate when round trip is selected', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      fireEvent.change(screen.getByLabelText(/from/i), { target: { value: 'JFK' } });
      fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'LHR' } });
      fireEvent.change(screen.getByLabelText(/departure date/i), { target: { value: '2025-06-15' } });
      
      fireEvent.click(screen.getByLabelText(/round trip/i));
      fireEvent.change(screen.getByLabelText(/return date/i), { target: { value: '2025-06-22' } });

      const form = screen.getByRole('button', { name: /search flights/i }).closest('form');
      fireEvent.submit(form!);

      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          returnDate: '2025-06-22',
        })
      );
    });

    it('should not submit when origin is empty', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      await user.type(screen.getByLabelText(/to/i), 'LHR');
      fireEvent.change(screen.getByLabelText(/departure date/i), {
        target: { value: '2025-06-15' },
      });

      const submitButton = screen.getByRole('button', { name: /search flights/i });
      await user.click(submitButton);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('should not submit when destination is empty', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      await user.type(screen.getByLabelText(/from/i), 'JFK');
      fireEvent.change(screen.getByLabelText(/departure date/i), {
        target: { value: '2025-06-15' },
      });

      const submitButton = screen.getByRole('button', { name: /search flights/i });
      await user.click(submitButton);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('should not submit when departure date is empty', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      await user.type(screen.getByLabelText(/from/i), 'JFK');
      await user.type(screen.getByLabelText(/to/i), 'LHR');

      const submitButton = screen.getByRole('button', { name: /search flights/i });
      await user.click(submitButton);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('should disable submit button when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} loading />);

      const submitButton = screen.getByRole('button', { name: /searching/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading text when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} loading />);

      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });

    it('should show loading text in compact form', () => {
      render(<SearchForm onSearch={mockOnSearch} compact loading />);

      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });
  });
});
