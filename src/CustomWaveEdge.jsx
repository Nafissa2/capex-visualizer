export default function CustomWaveEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    markerEnd,
    data
  }) {
    const amplitude = 20;  
    const frequency = 6;
  
    // ✅ Optionnel : offset pour corriger visuellement la source/target
    const offsetX = data?.offsetX || 0;
    const offsetY = data?.offsetY || 0;
  
    // Applique un petit décalage
    sourceX += offsetX;
    targetX += offsetX;
  
    sourceY += offsetY;
    targetY += offsetY;
  
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
  
    const numPoints = 50;
    let path = `M ${sourceX} ${sourceY} `;
  
    for (let i = 1; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = t * distance;
      const y = amplitude * Math.sin(t * frequency * 2 * Math.PI);
      const xRot = x * Math.cos(angle) - y * Math.sin(angle) + sourceX;
      const yRot = x * Math.sin(angle) + y * Math.cos(angle) + sourceY;
      path += `L ${xRot} ${yRot} `;
    }
  
    return (
      <path
        id={id}
        d={path}
        style={{
          ...style,
          fill: 'none',
          stroke: style?.stroke || '#007bff',
          strokeWidth: style?.strokeWidth || 2,
        }}
    
      />
    );
  }
  