import React from 'react';
import { Handle, Position } from 'reactflow';

export default function DataCenterNode({ data }) {
  return (
    <div
      tabIndex={-1}
      style={{
        position: 'relative',
        background: 'transparent', // ✅ plus de fond parasite
        border: 'none',            // ✅ plus de contour
        borderRadius: 8,
        padding: 0,                // ✅ pas de padding autour
        outline: 'none',
        textAlign: 'center',
      }}
    >
      <img
        src={data.image}
        alt="DC"
        style={{
          width: '1100px', // ✅ Ajuste ici la taille finale de ton DataCenter
          height: 'auto',
          display: 'block',
          border: 'none',
          outline: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      <Handle
        type="target"
        position={Position.Left}
        style={{
          position: 'absolute',
          top: '50%',
          left: -8,
          transform: 'translateY(-50%)',
          background: '#0C154B',
          width: 10,
          height: 10,
        }}
      />

      <Handle
        type="target"
        position={Position.Right}
        style={{
          position: 'absolute',
          top: '50%',
          right: -8,
          transform: 'translateY(-50%)',
          background: '#0C154B',
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}
