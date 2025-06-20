import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerInfoBox({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* ✅ Carré principal */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 60,
          height: 60,
          background: '#ffc107',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          cursor: 'pointer',
          userSelect: 'none',
          fontWeight: 'bold',
        }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />

      {/* ✅ Sous-sections : Build & Lease */}
      {open && (
        <div style={{ position: 'absolute', top: 70, left: 0 }}>
          {/* Build */}
          <div
            style={{
              background: '#ffffffee',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: '8px 12px',
              margin: '6px 0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              minWidth: 180,
              fontWeight: 'bold',
            }}
          >
            <strong>Build</strong>
            <ul style={{ padding: 0, margin: '6px 0 0 0', listStyle: 'none' }}>
              <li>Total Price Tower — {data.build.totalPrice}</li>
              <li>Upgrade Price/year — {data.build.upgradePrice}</li>
            </ul>
          </div>

          {/* Lease */}
          <div
            style={{
              background: '#ffffffee',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: '8px 12px',
              margin: '6px 0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              minWidth: 180,
              fontWeight: 'bold',
            }}
          >
            <strong>Lease</strong>
            <div>Lease Price — {data.lease.price}</div>
          </div>
        </div>
      )}
    </div>
  );
}
