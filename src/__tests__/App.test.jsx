import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import MainContent from '../components/MainContent';
import OpsIntelligence from '../components/OpsIntelligence';

describe('Smart Stadium Application', () => {
  test('renders the shell and topbar', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/PITCH/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/SIDE/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Match 38/i)).toBeInTheDocument();
  });

  test('sidebar navigation switches routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    // Initial route is Overview (MainContent)
    expect(screen.getByText(/Operations Overview/i)).toBeInTheDocument();
    
    // Click Ops Intelligence
    const opsButton = screen.getByLabelText(/Ops Intelligence/i);
    fireEvent.click(opsButton);
    
    // Should now show OpsIntelligence component
    expect(screen.getByText(/Query live stadium signals using GenAI/i)).toBeInTheDocument();
  });

  test('MainContent renders KPI metrics', () => {
    render(<MainContent />);
    expect(screen.getAllByText(/Occupancy/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Avg. Entry Wait/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Incidents/i)).toBeInTheDocument();
  });

  test('OpsIntelligence handles query input', () => {
    render(<OpsIntelligence />);
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Is Gate C congested?' } });
    expect(textarea.value).toBe('Is Gate C congested?');
    
    // Click chip
    const chip = screen.getByText(/GATE C RISK/i);
    fireEvent.click(chip);
    expect(textarea.value).toBe('Is Gate C likely to congest before kickoff?');
  });
});
