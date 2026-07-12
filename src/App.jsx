import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import OpsDashboard from './components/OpsDashboard';
import TransportView from './components/TransportView';
import AccessibilityView from './components/AccessibilityView';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainContent />} />
        <Route path="ops" element={<OpsDashboard />} />
        <Route path="transport" element={<TransportView />} />
        <Route path="accessibility" element={<AccessibilityView />} />
      </Route>
    </Routes>
  );
}

export default App;
