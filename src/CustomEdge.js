import React from 'react';
import { getBezierPath, EdgeLabelRenderer } from 'reactflow';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) {
  // ✅ Décalage horizontal ET vertical
  const OFFSET_X = 30; // 👉 vers la droite (+) ou gauche (-)
  const OFFSET_Y = 0; // 👉 vers le bas (+) ou haut (-)

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: targetX + 1050, // ✅ décalage X appliqué
    targetY: targetY + 0, // ✅ décalage Y appliqué
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(
              ${(sourceX + targetX + OFFSET_X) / 2}px,
              ${(sourceY + targetY + OFFSET_Y) / 2}px
            )`,
            fontSize: 12,
            fontWeight: 'bold',
            pointerEvents: 'all',
            color: style.stroke,
          }}
        >
          {data?.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
