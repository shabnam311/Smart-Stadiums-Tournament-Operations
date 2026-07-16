import React from 'react';
import { accessibility } from '../data/stadiumState';

const ICONS = {
  accessibility: <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="2"/><path d="M6 9h12M12 9v6M9 21l3-6 3 6"/></svg>,
};

function AccessibilityView() {
  return (
    <div>
      <div className="page-head">
        <div className="page-title">Accessibility</div>
        <div className="page-sub">Step-free routes and assistance points</div>
      </div>
      <div className="panel">
        {accessibility.map((r, i) => (
          <div className="list-row" key={i}>
            <div className="list-icon">{ICONS.accessibility}</div>
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

export default AccessibilityView;
