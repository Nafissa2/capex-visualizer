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
      border: '1px solid black',
      borderRadius: 8,
      width: 200,     // ✅ Largeur fixe du conteneur
      height: 200,    // ✅ Hauteur fixe du conteneur
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: 5,
        background: '#0C154B',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: 4
      }}>
        {data.label}
      </div>
      <img 
        src={data.image} 
        alt="Tower" 
        style={{ 
          width: '100%',   // ✅ Prend toute la largeur du conteneur
          height: '100%',  // ✅ Prend toute la hauteur
          objectFit: 'contain'  // ✅ Ne déforme pas l’image
        }} 
      />
      <Handle type="source" position={Position.Right} style={{ background: '#0C154B' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#0C154B' }} />
    </div>
  );
}
