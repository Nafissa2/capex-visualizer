import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerNode({ data }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      padding: 10,
      background: '#0C154B',
      border: 'none',
      borderRadius: 8,
      outline: 'none',
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: 5,
        background: '#0C154B',
        padding: '2px 6px',
        borderRadius: 4,
        outline: 'none',
      }}>
        {data.label}
      </div>
      <img src={data.image} alt="Tower" style={{ width: 1000 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#0C154B' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#0C154B' }} />
    </div>
  );
}
