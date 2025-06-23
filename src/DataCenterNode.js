import React from 'react';
import { Handle, Position } from 'reactflow';

export default function DataCenterNode({ data }) {
  return (
    <div
      tabIndex={-1}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        borderRadius: 8,
        padding: 0,
        outline: 'none',
        textAlign: 'center',
      }}
    >
      <img
        src={data.image}
        alt="DC"
        style={{
          width: '500px',
          height: 'auto',
          display: 'block',
          border: 'none',
          outline: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* ✅ TARGET gauche */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#0C154B',
          width: 10,
          height: 10,
        }}
      />

      {/* ✅ TARGET droite */}
      <Handle
        type="target"
        position={Position.Right}
        style={{
          background: '#0C154B',
          width: 10,
          height: 10,
        }}
      />

      {/* ✅ SOURCE gauche */}
      <Handle
        type="source"
        position={Position.Left}
        style={{
          background: '#0C154B',
          width: 10,
          height: 10,
        }}
      />

      {/* ✅ SOURCE droite */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#0C154B',
          width: 10,
          height: 10,
        }}
      />

    </div>
  );
}
