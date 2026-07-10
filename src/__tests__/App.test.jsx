import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import OpsDashboard from '../components/OpsDashboard';
import Layout from '../components/Layout';
import TransportView from '../components/TransportView';
import AccessibilityView from '../components/AccessibilityView';

// Mock fetch for API testing
global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({})
}));

describe('Smart Stadium Application - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({})
    }));
  });

  test('renders the new OpsDashboard shell', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Ask the stadium/i)).toBeInTheDocument();
  });

  test('OpsDashboard: empty submit does not trigger loading', () => {
    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const runBtn = screen.getByText(/▸ RUN QUERY/i);
    fireEvent.click(runBtn);
    expect(screen.queryByText(/GENERATING/i)).not.toBeInTheDocument();
  });

  test('OpsDashboard: clears query and response', () => {
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
    expect(screen.getByText(/AWAITING QUERY/i)).toBeInTheDocument();
  });

  test('OpsDashboard: long input updates char count correctly', () => {
    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    const longString = 'a'.repeat(2500);
    fireEvent.change(textarea, { target: { value: longString } });
    expect(screen.getByText(/2500 chars/i)).toBeInTheDocument();
  });

  test('OpsDashboard: handles successful API response (LIVE mode)', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ reply: "Gate A is clear.", mode: "live" }),
    });

    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Status of Gate A?' } });
    
    const runBtn = screen.getByText(/▸ RUN QUERY/i);
    fireEvent.click(runBtn);

    expect(screen.getByText(/GENERATING/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Gate A is clear.")).toBeInTheDocument();
      expect(screen.getByText(/LIVE AI RESPONSE/i)).toBeInTheDocument();
    });
  });

  test('OpsDashboard: handles network error / timeout gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Ask about crowd flow/i);
    fireEvent.change(textarea, { target: { value: 'Status of Gate B?' } });
    
    const runBtn = screen.getByText(/▸ RUN QUERY/i);
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText(/Network error connecting to Hugging Face/i)).toBeInTheDocument();
      expect(screen.getByText(/DEMO MODE · API UNREACHABLE/i)).toBeInTheDocument();
    });
  });

  test('Routing: internal pages render their correct titles', () => {
    render(
      <MemoryRouter initialEntries={['/transport']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="transport" element={<TransportView />} />
            <Route path="accessibility" element={<AccessibilityView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Transport & Sustainability/i)).toBeInTheDocument();
  });
});
