import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import OpsDashboard from '../components/OpsDashboard';

describe('Smart Stadium Application - Redesign', () => {
  test('renders the new OpsDashboard shell', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Ask the stadium/i)).toBeInTheDocument();
    expect(screen.getByText(/what happens next/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PITCHSIDE/i)[0]).toBeInTheDocument();
  });

  test('OpsDashboard handles query input and chips', () => {
    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Is Gate C congested?' } });
    expect(textarea.value).toBe('Is Gate C congested?');
  });

  test('OpsDashboard clears query', () => {
    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    const clearBtn = screen.getByText(/CLEAR/i);
    fireEvent.click(clearBtn);
    expect(textarea.value).toBe('');
  });
});
