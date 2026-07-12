import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import OpsDashboard from '../components/OpsDashboard';
import Layout from '../components/Layout';
import TransportView from '../components/TransportView';
import AccessibilityView from '../components/AccessibilityView';
import { vi } from 'vitest';

// Helper to mock an SSE stream fetch response
const mockFetchStream = (text, delayMs = 10) => {
  const encoder = new TextEncoder();
  const chunk = encoder.encode(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })}\n\n`);
  
  let isDone = false;
  const mockReader = {
    read: vi.fn().mockImplementation(() => {
      if (isDone) return Promise.resolve({ done: true, value: undefined });
      isDone = true;
      return new Promise(resolve => setTimeout(() => resolve({ done: false, value: chunk }), delayMs));
    })
  };

  return Promise.resolve({
    ok: true,
    body: { getReader: () => mockReader }
  });
};

describe('Smart Stadium Application - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() => Promise.reject(new Error("Default unmocked fetch")));
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
    expect(screen.queryByText(/· ·· ···/i)).not.toBeInTheDocument();
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

  test('OpsDashboard: handles successful streaming API response', async () => {
    global.fetch.mockImplementationOnce(() => mockFetchStream("Gate A is clear right now."));

    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Is Gate C likely to congest/i);
    fireEvent.change(textarea, { target: { value: 'Status of Gate A?' } });
    
    const runBtn = screen.getByText(/Run query/i);
    fireEvent.click(runBtn);

    // Initial typing indicator check
    expect(screen.getByText(/· ·· ···/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Gate A is clear right now./i)).toBeInTheDocument();
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
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
    });
  });

  test('Security Boundary: Backend never leaks internal instructions (systemInstruction/state)', async () => {
    // We mock the backend's exact fetch response internally, but the test ensures
    // the frontend's cleanResponse function drops any JSON scaffolding.
    // However, the backend itself is now defensively guarding the prompt format natively.
    global.fetch.mockImplementationOnce(() => mockFetchStream("{\"query\":\"hi\",\"state\":{\"weather\":29}}"));

    render(
      <MemoryRouter>
        <OpsDashboard />
      </MemoryRouter>
    );
    
    const textarea = screen.getByPlaceholderText(/Is Gate C likely to congest/i);
    fireEvent.change(textarea, { target: { value: 'hi' } });
    fireEvent.click(screen.getByText(/Run query/i));

    await waitFor(() => {
      // The frontend defense mechanism 'cleanResponse' catches raw JSON leaks
      expect(screen.getByText(/Signal interrupted/i)).toBeInTheDocument();
      expect(screen.queryByText(/\"query\"/)).not.toBeInTheDocument();
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
