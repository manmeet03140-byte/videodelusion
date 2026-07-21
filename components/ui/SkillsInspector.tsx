'use client';

interface SkillsInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillsInspector({ isOpen, onClose }: SkillsInspectorProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        left: '400px', // Display next to the node graph
        width: '340px',
        background: '#1c1c1c',
        border: '1px solid #333',
        borderRadius: '8px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        zIndex: 100,
        pointerEvents: 'auto',
        overflow: 'hidden',
        animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .skill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #222;
          transition: background 0.2s;
        }
        .skill-row:hover {
          background: #252525;
        }
        .skill-bar-bg {
          width: 100px;
          height: 4px;
          background: #333;
          border-radius: 2px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 2px;
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', background: '#242424', borderBottom: '1px solid #111',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffaa00', boxShadow: '0 0 4px #ffaa00' }} />
          <span style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: '0.05em', color: '#ccc' }}>
            Properties: Skills
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            fontSize: '14px', color: '#888', background: 'none', border: 'none', cursor: 'pointer',
            lineHeight: 1, padding: '0 4px'
          }}
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <h3 style={{ fontSize: '10px', fontFamily: 'monospace', color: '#00FFE0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Offerings
          </h3>
          <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5 }}>
            I am a high-level video editor and motion graphics specialist. I craft avant-garde visual experiences, blending technical precision with striking artistry to deeply engage your audience.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '10px', fontFamily: 'monospace', color: '#00FFE0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Industry Tools
          </h3>
          <div style={{ border: '1px solid #222', borderRadius: '4px', overflow: 'hidden' }}>
            
            <div className="skill-row">
              <span style={{ fontSize: '11px', color: '#ddd' }}>DaVinci Resolve</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: '95%', background: '#ff4d4d' }} />
              </div>
            </div>
            
            <div className="skill-row">
              <span style={{ fontSize: '11px', color: '#ddd' }}>Nuke / Fusion</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: '90%', background: '#ffaa00' }} />
              </div>
            </div>

            <div className="skill-row">
              <span style={{ fontSize: '11px', color: '#ddd' }}>After Effects</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: '100%', background: '#9933ff' }} />
              </div>
            </div>

            <div className="skill-row">
              <span style={{ fontSize: '11px', color: '#ddd' }}>Cinema 4D</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: '85%', background: '#3399ff' }} />
              </div>
            </div>

            <div className="skill-row" style={{ borderBottom: 'none' }}>
              <span style={{ fontSize: '11px', color: '#ddd' }}>Premiere Pro</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: '95%', background: '#ff33cc' }} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
