import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm';

describe('SearchForm Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  describe('Rendering', () => {
    it('renders all input fields', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
    });

    it('renders trip type radio buttons', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByLabelText(/round trip/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/one way/i)).toBeInTheDocument();
    });

    it('renders search button', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('renders return date field when round trip is selected', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      fireEvent.click(screen.getByLabelText(/round trip/i));

      expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    });

    it('hides return date field when one way is selected', () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      fireEvent.click(screen.getByLabelText(/one way/i));

      expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();
    });
  });

  describe('Initial Values', () => {
    it('populates fields with initial values', () => {
      render(
        <SearchForm
          onSearch={mockOnSearch}
          initialValues={{
            origin: 'JFK',
            destination: 'LHR',
            departureDate: '2026-04-01',
            adults: 2,
          }}
        />
      );

      expect(screen.getByLabelText(/from/i)).toHaveValue('JFK');
      expect(screen.getByLabelText(/to/i)).toHaveValue('LHR');
      expect(screen.getByLabelText(/departure date/i)).toHaveValue('2026-04-01');
      expect(screen.getByLabelText(/passengers/i)).toHaveValue('2');
    });

    it('selects round trip when returnDate is provided', () => {
      render(
        <SearchForm
          onSearch={mockOnSearch}
          initialValues={{
            returnDate: '2026-04-08',
          }}
        />
      );

      expect(screen.getByLabelText(/round trip/i)).toBeChecked();
    });
  });

  describe('Input Handling', () => {
    it('converts origin input to uppercase', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);
      const user = userEvent.setup();

      const originInput = screen.getByLabelText(/from/i) as HTMLInputElement;
      await user.clear(originInput);
      await user.type(originInput, 'jfk');

      expect(originInput.value).toBe('JFK');
    });

    it('converts destination input to uppercase', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);
      const user = userEvent.setup();

      const destInput = screen.getByLabelText(/^to$/i) as HTMLInputElement;
      await user.clear(destInput);
      await user.type(destInput, 'lhr');

      expect(destInput.value).toBe('LHR');
    });

    it('limits airport code input to 3 characters', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);
      const user = userEvent.setup();

      const originInput = screen.getByLabelText(/from/i) as HTMLInputElement;
      await user.clear(originInput);
      await user.type(originInput, 'JFKX');

      expect(originInput.value).toBe('JFK');
    });
  });

  describe('Form Submission', () => {
    it('calls onSearch with form values on submit', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/from/i), 'JFK');
      await user.type(screen.getByLabelText(/to/i), 'LHR');
      fireEvent.change(screen.getByLabelText(/departure date/i), {
        target: { value: '2026-04-01' },
      });

      fireEvent.click(screen.getByRole('button', { name: /search/i }));

      expect(mockOnSearch).toHaveBeenCalledWith({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        returnDate: undefined,
        adults: 1,
      });
    });

    it('includes returnDate when round trip is selected', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);
      const user = userEvent.setup();

      fireEvent.click(screen.getByLabelText(/round trip/i));

      await user.type(screen.getByLabelText(/from/i), 'JFK');
      await user.type(screen.getByLabelText(/to/i), 'LHR');
      fireEvent.change(screen.getByLabelText(/departure date/i), {
        target: { value: '2026-04-01' },
      });
      fireEvent.change(screen.getByLabelText(/return date/i), {
        target: { value: '2026-04-08' },
      });

      fireEvent.click(screen.getByRole('button', { name: /search/i }));

      expect(mockOnSearch).toHaveBeenCalledWith({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        returnDate: '2026-04-08',
        adults: 1,
      });
    });

    it('does not submit when required fields are empty', async () => {
      render(<SearchForm onSearch={mockOnSearch} />);

      fireEvent.click(screen.getByRole('button', { name: /search/i }));

      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading text when loading prop is true', () => {
      render(<SearchForm onSearch={mockOnSearch} loading={true} />);

      const buttons = screen.getAllByRole('button');
      const searchButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('search'));
      expect(searchButton).toBeDefined();
    });

    it('disables submit button when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} loading={true} />);

      const buttons = screen.getAllByRole('button');
      const searchButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('search'));
      expect(searchButton).toBeDisabled();
    });
  });

  describe('Compact Mode', () => {
    it('renders compact version when compact prop is true', () => {
      render(<SearchForm onSearch={mockOnSearch} compact={true} />);

      const inputs = document.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });
  });
});
