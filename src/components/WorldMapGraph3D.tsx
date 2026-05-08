import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const data = {
  nodes: [
    { id: '1', type: 'city', label: '咸阳' },
    { id: '2', type: 'office', label: '廷尉府' },
    { id: '3', type: 'port', label: '渭水码头' },
    { id: '4', type: 'palace', label: '咸阳宫' },
    { id: '5', type: 'camp', label: '上郡大营' },
    { id: '6', type: 'canal', label: '郑国渠' },
    { id: '7', type: 'pass', label: '函谷关' },
  ],
  links: [
    { source: '1', target: '4', value: 4 },
    { source: '1', target: '2', value: 3 },
    { source: '1', target: '3', value: 3 },
    { source: '1', target: '5', value: 5 },
    { source: '1', target: '6', value: 2 },
    { source: '1', target: '7', value: 1 },
    { source: '4', target: '2', value: 2 },
  ]
};

export default function WorldMapGraph3D() {
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
        nodeColor={(node: any) => node.type === 'city' ? '#DC2626' : '#737373'}
        linkOpacity={0.2}
        linkColor={() => '#ffffff'}
        linkDirectionalParticles={1}
      />
    </div>
  );
}
