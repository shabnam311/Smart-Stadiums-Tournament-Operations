import React, { useState, useEffect } from 'react';
import { 
  subscribe, 
  activeEventId, 
  setEventId, 
  parseAndLoadCSV, 
  kpis, 
  zones, 
  incidents 
} from '../data/stadiumState';

function MainContent() {
  const colors = { ok: "var(--turf)", warn: "var(--amber)", high: "var(--red)" };
  
  // Local state listener for stadiumState updates
  const [, setTick] = useState(0);
  useEffect(() => {
    return subscribe(() => setTick(t => t + 1));
  }, []);

  // UI State for ingestion upload errors and active file upload progress
  const [ingestError, setIngestError] = useState("");
  const [ingestSuccess, setIngestSuccess] = useState("");
  const [uploadingType, setUploadingType] = useState(null); // 'metadata' | 'clusters' | 'edges'

  const getLevel = (pct) => {
    if (pct >= 90) return "high";
    if (pct >= 75) return "warn";
    return "ok";
  };

  const density = zones.map(z => {
    const pct = Math.round((z.occ / z.cap) * 100);
    return { name: z.name, pct, level: getLevel(pct) };
  });

  const highIncidents = incidents.filter(i => i.sev === 'high' || i.sev === 'med').length;

  const handleFileUpload = (type, file) => {
    if (!file) return;
    setIngestError("");
    setIngestSuccess("");
    setUploadingType(type);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        parseAndLoadCSV(type, text);
        setIngestSuccess(`Successfully ingested ${type} dataset!`);
        setTimeout(() => setIngestSuccess(""), 4000);
      } catch (err) {
        console.error(err);
        setIngestError(err.message || `Failed to parse ${type} CSV.`);
      } finally {
        setUploadingType(null);
      }
    };
    reader.onerror = () => {
      setIngestError("Failed to read file.");
      setUploadingType(null);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Operations Overview</div>
        <div className="page-sub">Live status across all monitored sections</div>
      </div>
      
      {/* Dynamic KPI Row */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Occupancy</div>
          <div className="kpi-value">{kpis.occupancyPct}%</div>
          <div className="kpi-delta up">+6% vs last hour</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg entry wait</div>
          <div className="kpi-value">{kpis.avgEntryWait} min</div>
          <div className={`kpi-delta ${kpis.avgEntryWaitDelta > 0 ? "warn" : "up"}`}>
            {kpis.avgEntryWaitDelta > 0 ? "+1.5 min" : "-1.5 min"}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Open incidents</div>
          <div className="kpi-value">{incidents.length}</div>
          <div className={"kpi-delta " + (highIncidents > 0 ? "warn" : "")}>
            {highIncidents} severe alerts
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Staff on duty</div>
          <div className="kpi-value">{kpis.staffOnDuty}</div>
          <div className="kpi-delta">of {kpis.staffRostered} rostered</div>
        </div>
      </div>

      {/* CSV Ingest & Controls Panel */}
      <div className="panel" style={{ border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="panel-head">
          <div className="panel-title">Ingest Operations Data</div>
          <span className="tag">Live simulation settings</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
          
          {/* Active Event Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontSize: '14px', color: 'var(--c-zinc-400)', minWidth: '130px' }}>Active World Cup Event:</label>
            <select 
              id="eventSelector"
              value={activeEventId} 
              onChange={e => setEventId(Number(e.target.value))}
              style={{
                background: 'var(--c-zinc-800)',
                color: 'var(--c-zinc-100)',
                border: '1px solid var(--c-zinc-700)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {[201, 202, 203, 204, 205, 206, 207, 208, 209, 210].map(id => (
                <option key={id} value={id}>Event ID {id}</option>
              ))}
            </select>
            <span style={{ fontSize: '12px', color: 'var(--c-zinc-500)' }}>
              (Loads specific gate wait times, staff levels & congestion points from event_metadata.csv)
            </span>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--c-zinc-800)', margin: '5px 0' }} />

          {/* CSV File Uploaders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            
            {/* Metadata Upload */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '8px', border: '1px dashed var(--c-zinc-800)' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '8px' }}>1. Event Metadata CSV</div>
              <input 
                type="file" 
                accept=".csv"
                id="uploadMetadata"
                onChange={e => handleFileUpload('metadata', e.target.files[0])}
                style={{ fontSize: '11px', display: 'block', width: '100%' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--c-zinc-500)', display: 'block', marginTop: '5px' }}>
                Required: Event_ID, Staff_On_Duty, Gate_Status, Alerts
              </span>
            </div>

            {/* Clusters Upload */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '8px', border: '1px dashed var(--c-zinc-800)' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '8px' }}>2. Seat Clusters CSV</div>
              <input 
                type="file" 
                accept=".csv"
                id="uploadClusters"
                onChange={e => handleFileUpload('clusters', e.target.files[0])}
                style={{ fontSize: '11px', display: 'block', width: '100%' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--c-zinc-500)', display: 'block', marginTop: '5px' }}>
                Required: Event_ID, Seat_ID, People_Count, Zone_Capacity
              </span>
            </div>

            {/* Edges Upload */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '8px', border: '1px dashed var(--c-zinc-800)' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '8px' }}>3. Movement Edges CSV</div>
              <input 
                type="file" 
                accept=".csv"
                id="uploadEdges"
                onChange={e => handleFileUpload('edges', e.target.files[0])}
                style={{ fontSize: '11px', display: 'block', width: '100%' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--c-zinc-500)', display: 'block', marginTop: '5px' }}>
                Required: Event_ID, Source_Seat, Target_Seat, Congestion_Level
              </span>
            </div>

          </div>

          {/* Upload Status Messaging */}
          {ingestError && (
            <div id="ingestError" style={{ padding: '10px 15px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--c-incident)', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              ⚠ <b>Ingestion Error:</b> {ingestError}
            </div>
          )}

          {ingestSuccess && (
            <div id="ingestSuccess" style={{ padding: '10px 15px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--turf)', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              ✔ {ingestSuccess}
            </div>
          )}

        </div>
      </div>

      {/* Density Panel */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Section density</div>
          <span className="tag">{zones.length} sections</span>
        </div>
        {density.map(d => (
          <div className="density-row" key={d.name}>
            <span className="density-name">{d.name}</span>
            <div className="density-track">
              <div className="density-fill" style={{ width: d.pct + "%", background: colors[d.level] }}></div>
            </div>
            <span className="density-val">{d.pct}%</span>
          </div>
        ))}
      </div>

      {/* Incidents Panel */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Incident log</div>
          <span className="tag">{incidents.length} open</span>
        </div>
        {incidents.map((inc, i) => (
          <div className="incident-row" key={i}>
            <div className={"sev-bar " + inc.sev}></div>
            <div>
              <div className="incident-title">{inc.title}</div>
              <div className="incident-meta">{inc.time} · {inc.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainContent;
