import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import OpsDashboard from '../components/OpsDashboard';

describe('Smart Stadium Application - Redesign', () => {
  test('renders the new OpsDashboard shell', () => {
    render(<App />);
    expect(screen.getByText(/Ask the stadium/i)).toBeInTheDocument();
    expect(screen.getByText(/what happens next/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PITCHSIDE/i)[0]).toBeInTheDocument();
  });

  test('OpsDashboard handles query input and chips', () => {
    render(<OpsDashboard />);
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Is Gate C congested?' } });
    expect(textarea.value).toBe('Is Gate C congested?');
    
    // Click chip
    const chip = screen.getByText(/GATE C RISK/i);
    fireEvent.click(chip);
    expect(textarea.value).toBe('Is Gate C likely to congest before kickoff?');
  });

  test('OpsDashboard clears query', () => {
    render(<OpsDashboard />);
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    const clearBtn = screen.getByText(/CLEAR/i);
    fireEvent.click(clearBtn);
    expect(textarea.value).toBe('');
  });
});
