import { useState } from 'react';
import { Camera, MapPin, Upload, CheckCircle2, Filter, Sparkles, Image as ImageIcon } from 'lucide-react';
import SimulationBanner from '../components/shared/SimulationBanner';
import { ZONES } from '../data/zones';

interface ReportItem {
  id: string;
  type: 'crack' | 'slope_movement' | 'rockfall' | 'road_blockage' | 'seepage';
  title: string;
  location: string;
  lat: number;
  lng: number;
  zoneId: string;
  zoneName: string;
  reporterName: string;
  reporterRole: 'Citizen' | 'Field Inspector' | 'PWD Engineer' | 'Disaster Volunteer';
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  aiRiskScore: number;
  aiDetectedFeature: string;
  status: 'pending' | 'verified' | 'action_taken' | 'rejected';
  imagePlaceholderColor: string;
  description: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'REP-2026-089',
    type: 'crack',
    title: '15cm Tension Crack along NH-27 Cut-Slope',
    location: 'Km 42, Guwahati-Shillong Highway',
    lat: 25.85,
    lng: 91.88,
    zoneId: 'Z1',
    zoneName: 'Guwahati - Shillong Highway (NH-27)',
    reporterName: 'Sunil Basumatary',
    reporterRole: 'PWD Engineer',
    timestamp: '2026-09-22 09:15',
    severity: 'high',
    aiRiskScore: 88,
    aiDetectedFeature: 'Lateral shear crack, progressive separation',
    status: 'verified',
    imagePlaceholderColor: '#ea580c',
    description: 'Fresh transverse tension cracks noticed following 3 hours of intense rainfall. Road surface showing 3cm differential displacement.'
  },
  {
    id: 'REP-2026-088',
    type: 'rockfall',
    title: 'Minor Rockfall and Scree Accumulation',
    location: 'Near Chumoukedima Village Pass',
    lat: 25.79,
    lng: 93.76,
    zoneId: 'Z2',
    zoneName: 'Kohima - Dimapur Road (NH-29)',
    reporterName: 'Tiameren Ao',
    reporterRole: 'Field Inspector',
    timestamp: '2026-09-22 08:30',
    severity: 'medium',
    aiRiskScore: 64,
    aiDetectedFeature: 'Angular rock fragments < 0.5m diameter',
    status: 'action_taken',
    imagePlaceholderColor: '#eab308',
    description: 'Debris cleared by local maintenance team. Slope retains loose boulders above overhanging ledge.'
  },
  {
    id: 'REP-2026-087',
    type: 'seepage',
    title: 'Heavy Muddy Water Seepage from Hill Toe',
    location: 'Champhai Bypass Road, Slope 4',
    lat: 23.47,
    lng: 93.32,
    zoneId: 'Z5',
    zoneName: 'Champhai Slope Corridor',
    reporterName: 'Lalthanpuia',
    reporterRole: 'Citizen',
    timestamp: '2026-09-22 07:45',
    severity: 'high',
    aiRiskScore: 92,
    aiDetectedFeature: 'Turbid pore-pressure seepage, soil liquification sign',
    status: 'pending',
    imagePlaceholderColor: '#dc2626',
    description: 'Continuous brown water discharge from soil embankment right above residential cluster.'
  },
  {
    id: 'REP-2026-086',
    type: 'slope_movement',
    title: 'Retaining Wall Bulging and Cracking',
    location: 'Upper Gangtok Secretariat Slope',
    lat: 27.33,
    lng: 88.61,
    zoneId: 'Z4',
    zoneName: 'Gangtok East District Slope',
    reporterName: 'Karma Bhutia',
    reporterRole: 'Disaster Volunteer',
    timestamp: '2026-09-21 17:10',
    severity: 'medium',
    aiRiskScore: 71,
    aiDetectedFeature: 'Structural tilt 12 degrees outward',
    status: 'verified',
    imagePlaceholderColor: '#eab308',
    description: 'Gabion wall section bulging out into lower terrace road.'
  }
];

export default function FieldReports() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Form state
  const [formType, setFormType] = useState<'crack' | 'slope_movement' | 'rockfall' | 'road_blockage' | 'seepage'>('crack');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formZone, setFormZone] = useState('Z1');
  const [formReporter, setFormReporter] = useState('');
  const [formRole, setFormRole] = useState<'Citizen' | 'Field Inspector' | 'PWD Engineer' | 'Disaster Volunteer'>('Citizen');
  const [formDesc, setFormDesc] = useState('');
  const [formLat, setFormLat] = useState('25.8500');
  const [formLng, setFormLng] = useState('91.8800');
  const [simulatedAiAnalysis, setSimulatedAiAnalysis] = useState<{ score: number; feature: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSimulateAI = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const mockScores = [74, 85, 91, 62, 89];
      const mockFeatures = [
        'Surface strain crack pattern matching active slip-plane',
        'Saturated slope slumping with toe upheaval',
        'Unconsolidated talus movement on steep gradient'
      ];
      setSimulatedAiAnalysis({
        score: mockScores[Math.floor(Math.random() * mockScores.length)],
        feature: mockFeatures[Math.floor(Math.random() * mockFeatures.length)]
      });
      setAnalyzing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLocation) return;

    const selectedZone = ZONES.find(z => z.id === formZone);
    const newRep: ReportItem = {
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: formType,
      title: formTitle,
      location: formLocation,
      lat: parseFloat(formLat) || 25.85,
      lng: parseFloat(formLng) || 91.88,
      zoneId: formZone,
      zoneName: selectedZone ? selectedZone.name : 'NER Slope Zone',
      reporterName: formReporter || 'Anonymous Reporter',
      reporterRole: formRole,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      severity: (simulatedAiAnalysis?.score || 70) > 80 ? 'high' : 'medium',
      aiRiskScore: simulatedAiAnalysis?.score || Math.floor(65 + Math.random() * 25),
      aiDetectedFeature: simulatedAiAnalysis?.feature || 'AI-analyzed slope distress image',
      status: 'pending',
      imagePlaceholderColor: '#ea580c',
      description: formDesc || 'Field report submitted via mobile portal.'
    };

    setReports([newRep, ...reports]);
    setShowSubmitModal(false);
    // Reset
    setFormTitle('');
    setFormLocation('');
    setFormDesc('');
    setSimulatedAiAnalysis(null);
  };

  const filteredReports = reports.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationBanner />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera style={{ color: '#ea580c' }} size={22} />
            Citizen & Field Crowd-Sourced Slope Distress Reports
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
            Geo-tagged photos/videos of tension cracks, rockfalls, seepages, and road blockages analyzed automatically by Computer Vision model.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowSubmitModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Upload size={16} /> Submit Geo-Tagged Report
        </button>
      </div>

      {/* Filters & Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Reports</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>{reports.length}</div>
          <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 2 }}>+2 submitted today</div>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending Verification</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b', marginTop: 2 }}>
            {reports.filter(r => r.status === 'pending').length}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Awaiting district engineer check</div>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>High AI Hazard Score (&gt;80%)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444', marginTop: 2 }}>
            {reports.filter(r => r.aiRiskScore >= 80).length}
          </div>
          <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>Priority inspection flagged</div>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Verified / Resolved</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#22c55e', marginTop: 2 }}>
            {reports.filter(r => r.status === 'verified' || r.status === 'action_taken').length}
          </div>
          <div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>Action taken in field</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8' }}>
          <Filter size={15} /> Filters:
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#cbd5e1' }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="action_taken">Action Taken</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#cbd5e1' }}>Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {filteredReports.map((rep) => (
          <div key={rep.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <span className={`badge badge-${rep.severity === 'high' ? 'danger' : rep.severity === 'medium' ? 'warning' : 'info'}`}>
                  {rep.type.toUpperCase().replace('_', ' ')}
                </span>
                <span style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: rep.status === 'verified' ? '#166534' : rep.status === 'action_taken' ? '#075985' : '#854d0e',
                  color: '#f8fafc'
                }}>
                  {rep.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 6, color: '#f1f5f9', marginBottom: 4 }}>
                {rep.title}
              </h3>

              <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                <MapPin size={13} style={{ color: '#38bdf8' }} />
                {rep.location} ({rep.lat}, {rep.lng})
              </div>

              {/* Mock Photo Thumbnail */}
              <div style={{
                height: 120,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${rep.imagePlaceholderColor}22, #1e293b)`,
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 6,
                marginBottom: 12,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <ImageIcon size={28} style={{ color: rep.imagePlaceholderColor, opacity: 0.8 }} />
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>Geo-tagged Field Photo Artifact</span>
                <span style={{ fontSize: 10, color: '#64748b' }}>GPS EXIF Verified • {rep.timestamp}</span>

                {/* AI Overlay Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 6,
                  right: 6,
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #ea580c',
                  borderRadius: 6,
                  padding: '2px 6px',
                  fontSize: 10,
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Sparkles size={11} /> AI Confidence: {rep.aiRiskScore}%
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 12 }}>
                {rep.description}
              </p>

              {/* AI Detection Callout */}
              <div style={{
                background: '#0f172a',
                borderLeft: '3px solid #ea580c',
                padding: '8px 10px',
                borderRadius: 4,
                fontSize: 11.5,
                color: '#94a3b8',
                marginBottom: 12
              }}>
                <div style={{ color: '#f97316', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={12} /> Computer Vision Detection:
                </div>
                <div>{rep.aiDetectedFeature}</div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #334155', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b' }}>
              <div>
                Reported by <strong style={{ color: '#94a3b8' }}>{rep.reporterName}</strong> ({rep.reporterRole})
              </div>
              <div>{rep.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Geo-Tagged Report Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 16
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 550, padding: 20, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #334155', paddingBottom: 10 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera style={{ color: '#ea580c' }} size={20} /> Field Geo-Tagged Report Submission
              </h2>
              <button onClick={() => setShowSubmitModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Distress Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                >
                  <option value="crack">Tension Crack in Ground / Slope</option>
                  <option value="slope_movement">Active Soil Slumping / Movement</option>
                  <option value="rockfall">Rockfall / Debris Accumulation</option>
                  <option value="road_blockage">Road Blockage / Debris Fall</option>
                  <option value="seepage">Muddy Water Seepage from Toe</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Title / Short Summary</label>
                <input
                  type="text"
                  placeholder="e.g. 10cm crack appearing along highway shoulder"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Zone Corridor</label>
                  <select
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                  >
                    {ZONES.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Location Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Km 34 near bypass bridge"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Latitude (GPS)</label>
                  <input
                    type="text"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Longitude (GPS)</label>
                  <input
                    type="text"
                    value={formLng}
                    onChange={(e) => setFormLng(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Reporter Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formReporter}
                    onChange={(e) => setFormReporter(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Field Inspector">Field Inspector</option>
                    <option value="PWD Engineer">PWD Engineer</option>
                    <option value="Disaster Volunteer">Disaster Volunteer</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Upload Photo / Video (Mock EXIF Tagging)</label>
                <div style={{
                  border: '2px dashed #334155', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer', background: '#0f172a'
                }}>
                  <Upload size={24} style={{ color: '#ea580c', marginBottom: 6 }} />
                  <div style={{ fontSize: 12, color: '#cbd5e1' }}>Click or drag image file here</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>GPS metadata will be automatically parsed</div>
                </div>
              </div>

              {/* AI Analysis trigger */}
              <div style={{ background: '#1e293b', padding: 12, borderRadius: 8, border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ea580c', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} /> AI Computer Vision Pre-Analysis
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSimulateAI}
                    disabled={analyzing}
                    style={{ fontSize: 11, padding: '4px 8px' }}
                  >
                    {analyzing ? 'Scanning...' : 'Run Vision Scan'}
                  </button>
                </div>
                {simulatedAiAnalysis && (
                  <div style={{ marginTop: 8, fontSize: 11.5, color: '#cbd5e1' }}>
                    <div><strong>Hazard Score:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>{simulatedAiAnalysis.score}%</span></div>
                    <div><strong>Detected:</strong> {simulatedAiAnalysis.feature}</div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Detailed Observations</label>
                <textarea
                  rows={3}
                  placeholder="Describe crack length, depth, water runoff, surrounding infrastructure at risk..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Submit & Broadcast Alert Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
