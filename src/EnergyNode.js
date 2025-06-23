import React from 'react';
import { Handle, Position } from 'reactflow';

export default function EnergyNode({ data }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      padding: 0,             // ✅ plus de padding
      background: 'transparent', // ✅ plus de fond blanc
      border: 'none',         // ✅ pas de bordure
      borderRadius: 0,        // ✅ pas d'arrondi
    }}>
      <img src={data.image} alt="Energy" style={{ width: 200 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    </div>
  );
}
