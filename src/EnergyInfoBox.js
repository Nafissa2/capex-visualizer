import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function EnergyInfoBox({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 130,
          height: 45,
          background: '#9B395C',
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
            display: 'block',          // ✅ pour cohérence
            padding: '10px',
          }}
        >
          <div
            style={{
              background: '#ffffffee',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: '10px 16px',
              margin: '8px 0',          // ✅ même espacement que les autres
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',     // ✅ empêche le retour à la ligne interne
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Price — {data.price}
          </div>
        </div>
      )}
    </div>
  );
}
