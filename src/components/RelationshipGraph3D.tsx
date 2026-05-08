import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const data = {
  nodes: [
    { id: '1', group: 1, label: '赢扶苏' },
    { id: '2', group: 1, label: '张苍' },
    { id: '3', group: 2, label: '赵高' },
    { id: '4', group: 1, label: '蒙恬' },
    { id: '5', group: 3, label: '李斯' },
    { id: '6', group: 1, label: '王离' },
    { id: '7', group: 1, label: '郑国' },
  ],
  links: [
    { source: '1', target: '2', value: 10 },
    { source: '1', target: '4', value: 10 },
    { source: '1', target: '3', value: 5 },
    { source: '3', target: '5', value: 8 },
    { source: '5', target: '1', value: 6 },
    { source: '4', target: '6', value: 6 },
    { source: '1', target: '7', value: 4 },
  ]
};

export default function RelationshipGraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph3D
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        backgroundColor="rgba(15, 15, 15, 0.5)"
        nodeLabel="label"
        nodeAutoColorBy="group"
        linkOpacity={0.3}
        linkColor={() => '#DC2626'}
        linkDirectionalParticles={1}
      />
    </div>
  );
}
