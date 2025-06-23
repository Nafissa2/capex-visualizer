import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerNode({ data }) {
  // 🔑 Sécurité : garantir un chemin absolu vers public/
  const imageSrc = data.image?.startsWith('/') ? data.image : `/${data.image}`;

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

      {/* ✅ Image avec chemin public correct */}
      <img
        src={imageSrc}
        alt="Tower"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {/* ✅ Handles */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#0C154B' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: '#0C154B' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#0C154B' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={{ background: '#0C154B' }}
      />
    </div>
  );
}
