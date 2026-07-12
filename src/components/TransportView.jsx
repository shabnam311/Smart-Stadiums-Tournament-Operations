import React from 'react';
import { transport } from '../data/stadiumState';

const ICONS = {
  transport: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="6" width="16" height="10" rx="2"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>,
};

function TransportView() {
  return (
    <div>
      <div className="page-head">
        <div className="page-title">Transport</div>
        <div className="page-sub">Live status of transit options serving the venue</div>
      </div>
      <div className="panel">
        {transport.map((r, i) => (
          <div className="list-row" key={i}>
            <div className="list-icon">{ICONS.transport}</div>
            <div>
              <div className="list-title">{r.title}</div>
              <div className="list-meta">{r.meta}</div>
            </div>
            <span className={"status-pill " + (r.ok ? "ok" : "warn")}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransportView;
