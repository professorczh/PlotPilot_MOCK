import { useRef, useEffect, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';

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

export default function WorldMapGraph({ highlightedIds = [] }: { highlightedIds?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const hasContext = highlightedIds.length > 0;

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

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const timer = setTimeout(() => {
        fgRef.current?.zoomToFit(400);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dimensions, highlightedIds]);

  return (
    <div ref={containerRef} className="w-full h-full bg-transparent">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel="label"
        nodeRelSize={5}
        linkColor={(link: any) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const isRelated = highlightedIds.includes(sourceId) && highlightedIds.includes(targetId);
          
          if (hasContext) {
            return isRelated ? 'rgba(220, 38, 38, 0.4)' : 'rgba(220, 38, 38, 0.05)';
          }
          return 'rgba(220, 38, 38, 0.15)';
        }}
        linkDirectionalParticles={hasContext ? 0 : 1}
        linkDirectionalParticleSpeed={0.002}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale) => {
          const isHighlighted = highlightedIds.includes(node.id);
          const opacity = hasContext && !isHighlighted ? 0.2 : 1;
          
          const label = node.label;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px JetBrains Mono`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

          ctx.globalAlpha = opacity;
          // Box
          ctx.fillStyle = 'rgba(15, 15, 15, 0.9)';
          ctx.lineWidth = (isHighlighted && hasContext ? 2 : 1) / globalScale;
          
          if (isHighlighted && hasContext) {
            ctx.strokeStyle = '#DC2626';
            ctx.shadowColor = '#DC2626';
            ctx.shadowBlur = 10 / globalScale;
          } else {
            ctx.strokeStyle = node.type === 'city' ? '#DC2626' : 'rgba(255,255,255,0.1)';
            ctx.shadowBlur = 0;
          }
          
          const x = node.x - bckgDimensions[0] / 2;
          const y = node.y - bckgDimensions[1] / 2;
          const w = bckgDimensions[0] as number;
          const h = bckgDimensions[1] as number;
          
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          ctx.shadowBlur = 0;

          // Text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isHighlighted && hasContext ? '#DC2626' : '#FFFFFF';
          ctx.fillText(label, node.x, node.y);

          // Icon dot
          ctx.beginPath();
          ctx.arc(node.x, node.y - h/2 - 4/globalScale, 2/globalScale, 0, 2 * Math.PI);
          ctx.fillStyle = isHighlighted && hasContext ? '#DC2626' : (node.type === 'city' ? '#DC2626' : '#737373');
          ctx.fill();
          ctx.globalAlpha = 1;
        }}
      />
    </div>
  );
}

