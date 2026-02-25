import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm';

describe('SearchForm Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  describe('Full Form (non-compact)', () => {
    it('should render all form inputs', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
    });

    it('should render trip type radio buttons', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/round trip/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/one way/i)).toBeInTheDocument();
    });

    it('should default to one-way trip type', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      const oneWayRadio = screen.getByLabelText(/one way/i) as HTMLInputElement;
      expect(oneWayRadio.checked).toBe(true);
    });

    it('should show return date input when round trip is selected', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const roundTripRadio = screen.getByLabelText(/round trip/i);
      await user.click(roundTripRadio);

      expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    });

    it('should hide return date input when one way is selected', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const roundTripRadio = screen.getByLabelText(/round trip/i);
      await user.click(roundTripRadio);
      expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();

      const oneWayRadio = screen.getByLabelText(/one way/i);
      await user.click(oneWayRadio);
      expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();
    });

    it('should render search button', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
    });

    it('should disable search button when required fields are empty', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search flights/i });
      expect(searchButton).toBeDisabled();
    });

    it('should convert origin input to uppercase', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const originInput = screen.getByLabelText(/from/i) as HTMLInputElement;
      await user.type(originInput, 'jfk');

      expect(originInput.value).toBe('JFK');
    });

    it('should convert destination input to uppercase', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const destInput = screen.getByLabelText(/to/i) as HTMLInputElement;
      await user.type(destInput, 'lhr');

      expect(destInput.value).toBe('LHR');
    });

    it('should limit airport code input to 3 characters', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const originInput = screen.getByLabelText(/from/i) as HTMLInputElement;
      await user.type(originInput, 'JFKAA');

      expect(originInput.value).toBe('JFK');
    });

    it('should show airport suggestions when typing', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const originInput = screen.getByLabelText(/from/i);
      await user.type(originInput, 'New');

      await waitFor(() => {
        expect(screen.getByText('JFK')).toBeInTheDocument();
      });
    });

    it('should call onSearch with correct values on submit', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const originInput = screen.getByLabelText(/from/i);
      const destInput = screen.getByLabelText(/to/i);
      const dateInput = screen.getByLabelText(/departure date/i);

      await user.type(originInput, 'JFK');
      await user.type(destInput, 'LHR');
      fireEvent.change(dateInput, { target: { value: '2026-06-15' } });

      const searchButton = screen.getByRole('button', { name: /search flights/i });
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        returnDate: undefined,
        adults: 1,
      });
    });

    it('should include returnDate when round trip is selected', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      await user.click(screen.getByLabelText(/round trip/i));

      const originInput = screen.getByLabelText(/from/i);
      const destInput = screen.getByLabelText(/to/i);
      const departureInput = screen.getByLabelText(/departure date/i);
      const returnInput = screen.getByLabelText(/return date/i);

      await user.type(originInput, 'JFK');
      await user.type(destInput, 'LHR');
      fireEvent.change(departureInput, { target: { value: '2026-06-15' } });
      fireEvent.change(returnInput, { target: { value: '2026-06-22' } });

      await user.click(screen.getByRole('button', { name: /search flights/i }));

      expect(mockOnSearch).toHaveBeenCalledWith({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        returnDate: '2026-06-22',
        adults: 1,
      });
    });

    it('should update adults count when selecting from dropdown', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} />);

      const passengersSelect = screen.getByLabelText(/passengers/i);
      await user.selectOptions(passengersSelect, '3');

      expect((passengersSelect as HTMLSelectElement).value).toBe('3');
    });

    it('should display loading state when loading prop is true', () => {
      render(<SearchForm onSearch={mockOnSearch} loading={true} />);

      expect(screen.getByText(/searching.../i)).toBeInTheDocument();
    });

    it('should disable button when loading', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} loading={true} />);

      const originInput = screen.getByLabelText(/from/i);
      const destInput = screen.getByLabelText(/to/i);
      const dateInput = screen.getByLabelText(/departure date/i);

      await user.type(originInput, 'JFK');
      await user.type(destInput, 'LHR');
      fireEvent.change(dateInput, { target: { value: '2026-06-15' } });

      const searchButton = screen.getByRole('button', { name: /searching.../i });
      expect(searchButton).toBeDisabled();
    });

    it('should populate initial values when provided', () => {
      render(
        <SearchForm
          onSearch={mockOnSearch}
          initialValues={{
            origin: 'LAX',
            destination: 'NRT',
            departureDate: '2026-07-01',
            adults: 2,
          }}
        />
      );

      expect((screen.getByLabelText(/from/i) as HTMLInputElement).value).toBe('LAX');
      expect((screen.getByLabelText(/to/i) as HTMLInputElement).value).toBe('NRT');
      expect((screen.getByLabelText(/departure date/i) as HTMLInputElement).value).toBe('2026-07-01');
      expect((screen.getByLabelText(/passengers/i) as HTMLSelectElement).value).toBe('2');
    });
  });

  describe('Compact Form', () => {
    it('should render compact form when compact prop is true', () => {
      render(<SearchForm onSearch={mockOnSearch} compact={true} />);

      expect(screen.getByPlaceholderText(/from/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/to/i)).toBeInTheDocument();
    });

    it('should render Search button in compact mode', () => {
      render(<SearchForm onSearch={mockOnSearch} compact={true} />);

      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('should call onSearch with values in compact mode', async () => {
      const user = userEvent.setup();
      const { container } = render(<SearchForm onSearch={mockOnSearch} compact={true} />);

      const originInput = screen.getByPlaceholderText(/from/i);
      const destInput = screen.getByPlaceholderText(/to/i);
      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;

      await user.type(originInput, 'JFK');
      await user.type(destInput, 'LHR');
      fireEvent.change(dateInput, { target: { value: '2026-06-15' } });

      await user.click(screen.getByRole('button', { name: /search/i }));

      expect(mockOnSearch).toHaveBeenCalled();
    });
  });
});
