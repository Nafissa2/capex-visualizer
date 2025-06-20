import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerNode({ data }) {
  return (
    <div
      tabIndex={-1}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        padding: 0,
        background: 'transparent',
        border: 'none',
        outline: 'none',
      }}
    >
      {/* ✅ CONTENEUR FIXE */}
      <div style={{ width: '250px' }}>
        <img
          src={data.image}
          alt="Tower"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            userSelect: 'none',
          }}
          draggable={false}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#0C154B', width: 10, height: 10 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#0C154B', width: 10, height: 10 }}
      />
    </div>
  );
}
