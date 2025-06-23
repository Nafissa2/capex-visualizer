import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function RanInfoBox({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 220,
          height: 40,
          background: '#C14F78',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          cursor: 'pointer',
          userSelect: 'none',
          fontWeight: 'bold',
          fontSize: 25,
        }}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 0,
            display: 'block',      // ✅ disposition verticale
            padding: '10px',
            maxWidth: '800px',
          }}
        >
          {data.details.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffffee',
                border: '1px solid #ddd',
                borderRadius: 6,
                padding: '8px 16px',
                margin: '8px 0',           // ✅ espace vertical entre blocs
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',      // ✅ empêche le texte de casser en plusieurs lignes
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              {item.name} — {item.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
