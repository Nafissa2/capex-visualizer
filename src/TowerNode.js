import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerNode({ data }) {
  return (
    <div
      style={{
        width: 400,
        height: 400,
        position: 'relative',
        background: 'transparent',
      }}
    >
      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0C154B',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: 4,
          fontWeight: 'bold',
          zIndex: 10,
        }}
      >
        {data.label}
      </div>

      {/* Image */}
      <img
        src={data.image}
        alt="Tower"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {/* ✅ Handles */}
      {/* Source à droite */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#0C154B' }}
      />
      {/* ✅ Source à gauche aussi */}
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: '#0C154B' }}
      />
      {/* Target à gauche */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#0C154B' }}
      />
      {/* (optionnel) Target à droite si besoin */}
      <Handle
        type="target"
        position={Position.Right}
        style={{ background: '#0C154B' }}
      />
    </div>
  );
}
