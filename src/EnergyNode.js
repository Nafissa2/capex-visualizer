import React from 'react';
import { Handle, Position } from 'reactflow';

export default function EnergyNode({ data }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      padding: 10,
      background: '#fff',
      border: '1px solid black',
      borderRadius: 8,
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: 5,
        background: '#f0f0f0',
        padding: '2px 6px',
        borderRadius: 4
      }}>
        {data.label}
      </div>
      <img src={data.image} alt="Energy" style={{ width: 150 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    </div>
  );
}
