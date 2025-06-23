import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function DataCenterInfoBox({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 230,
          height: 45,
          background: '#304E98',
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
            top: 80,
            left: 0,
            display: 'block',          // ✅ disposition verticale
            padding: '10px',
            maxWidth: '600px',         // optionnel, ajuste selon tes besoins
          }}
        >
          {data.details.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffffee',
                border: '1px solid #ddd',
                borderRadius: 6,
                padding: '10px 16px',
                margin: '8px 0',        // ✅ espacement vertical
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap',   // ✅ empêche retour à la ligne interne
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
