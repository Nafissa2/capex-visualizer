import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerNode({ data }) {
  return (
    <div style={{
      width: 1000,     // ✅ Taille finale du nœud entier
      height: 1000,
      position: 'relative',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', // ✅ Centre tout
      padding: 0,               // ✅ AUCUN padding
    }}>
      {/* Label positionné en absolute au-dessus si tu veux */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        fontWeight: 'bold',
        color: '#fff',
        background: '#0C154B',
        padding: '2px 6px',
        borderRadius: 4,
      }}>
        {data.label}
      </div>
      
      <img 
        src={data.image} 
        alt="Tower"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      <Handle type="source" position={Position.Right} style={{ background: '#0C154B' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#0C154B' }} />
    </div>
  );
}

