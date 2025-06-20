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
      width: 1000,
      height: 200,
      background: 'transparent',

    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: 5,
        background: '#0C154B',
        color: '#fff',
        padding: '2px 6px',
      }}>
        {data.label}
      </div>
      <img 
        src={data.image} 
        alt="Tower" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain' 
        }} 
      />
      <Handle type="source" position={Position.Right} style={{ background: '#0C154B' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#0C154B' }} />
    </div>
  );
}
