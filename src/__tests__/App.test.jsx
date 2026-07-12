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
    expect(screen.getByText(/Operations Overview/i)).toBeInTheDocument();
  });

  test('OpsDashboard: empty submit does not trigger loading', () => {
    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const runBtn = screen.getByText(/Run query/i);
    fireEvent.click(runBtn);
    expect(screen.queryByText(/Generating response/i)).not.toBeInTheDocument();
  });

  test('OpsDashboard: clears query and response', () => {
    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Is Gate C likely to congest/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    const clearBtn = screen.getByText(/Clear/i);
    fireEvent.click(clearBtn);
    expect(textarea.value).toBe('');
    expect(screen.getByText(/Response will appear here/i)).toBeInTheDocument();
  });

  test('OpsDashboard: handles successful API response (LIVE mode)', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ 
        reply: "Gate A is clear right now with only a 2 minute wait.", 
        mode: "live",
      }),
    });

    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Is Gate C likely to congest/i);
    fireEvent.change(textarea, { target: { value: 'Status of Gate A?' } });
    
    const runBtn = screen.getByText(/Run query/i);
    fireEvent.click(runBtn);

    expect(screen.getByText(/Generating response/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Gate A is clear/i)).toBeInTheDocument();
      expect(screen.getByText(/Live response/i)).toBeInTheDocument();
    });
  });

  test('OpsDashboard: handles network error / timeout gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Is Gate C likely to congest/i);
    fireEvent.change(textarea, { target: { value: 'Status of Gate B?' } });
    
    const runBtn = screen.getByText(/Run query/i);
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText(/Fallback/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Live status of transit options/i)).toBeInTheDocument();
  });
});
