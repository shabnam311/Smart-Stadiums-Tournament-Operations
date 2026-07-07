import React from 'react';
import { AlertTriangle, Users, TrendingUp, ShieldAlert, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '14:00', density: 4000 },
  { time: '14:30', density: 5000 },
  { time: '15:00', density: 8500 },
  { time: '15:30', density: 12000 },
  { time: '16:00', density: 15500 },
  { time: '16:30', density: 18000 },
  { time: '17:00', density: 17500 },
];

const StaffDashboard = () => {
  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 className="title text-gradient">Operations Command</h2>
          <p className="subtitle">Real-time stadium intelligence and resource allocation.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <Activity size={18} color="#ef4444" />
            <span style={{ color: '#ef4444', fontWeight: 600 }}>Live Incident: Gate B</span>
          </div>
        </div>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel stat-card">
          <div className="flex-between">
            <span className="stat-label">Total Attendance</span>
            <Users size={20} color="var(--accent-cyan)" />
          </div>
          <span className="stat-value">54,230</span>
          <span style={{ color: '#4ade80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={14} /> +12% vs expected
          </span>
        </div>

        <div className="glass-panel stat-card">
          <div className="flex-between">
            <span className="stat-label">Crowd Density (East Wing)</span>
            <AlertTriangle size={20} color="#f59e0b" />
          </div>
          <span className="stat-value">89%</span>
          <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>Approaching capacity</span>
        </div>

        <div className="glass-panel stat-card">
          <div className="flex-between">
            <span className="stat-label">Active Staff</span>
            <ShieldAlert size={20} color="var(--accent-purple)" />
          </div>
          <span className="stat-value">1,204</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>94% deployed</span>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Predictive Crowd Influx</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-purple)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-darker)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-cyan)' }}
                />
                <Area type="monotone" dataKey="density" stroke="var(--accent-purple)" fillOpacity={1} fill="url(#colorDensity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>AI Actionable Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
              <h4 style={{ color: '#ef4444', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} /> High Priority
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Predicting bottleneck at Gate C in 15 mins due to sudden train arrival. Recommend redirecting 20% of traffic to Gate D.</p>
              <button className="glass-button" style={{ padding: '0.5rem 1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>Deploy Redirect Team</button>
            </div>
            
            <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '4px solid var(--accent-cyan)', borderRadius: '4px' }}>
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>Optimization</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Concession Stand 4 in North Wing experiencing low traffic. Suggest pushing localized promo via Fan App.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
