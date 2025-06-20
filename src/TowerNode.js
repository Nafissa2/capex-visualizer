import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TowerNode({ data }) {
  return (
    <div
      tabIndex={-1} // 🔑 désactive focus
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
      <img
        src={data.image}
        alt="Tower"
        style={{
          width: '900px',  // ✅ Ici tu ajustes la taille à volonté (ex: 250px, 300px, 400px)
          height: 'auto',  // ✅ Préserve le ratio
          border: 'none',
          outline: 'none',
          userSelect: 'none',
          display: 'block',
        }}
        draggable={false}
      />

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
