import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OpsDashboard from './components/OpsDashboard';
import MainContent from './components/MainContent';
import TransportView from './components/TransportView';
import AccessibilityView from './components/AccessibilityView';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OpsDashboard />} />
          <Route path="overview" element={<MainContent />} />
          <Route path="transport" element={<TransportView />} />
          <Route path="accessibility" element={<AccessibilityView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
