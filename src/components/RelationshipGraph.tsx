import { useRef, useEffect, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { ThemeMode } from '../types';

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
    { source: '1', target: '2', value: 5 },
    { source: '1', target: '4', value: 5 },
    { source: '1', target: '3', value: 2 },
    { source: '3', target: '5', value: 4 },
    { source: '1', target: '5', value: 3 },
    { source: '4', target: '6', value: 3 },
    { source: '1', target: '7', value: 2 },
  ]
};

export default function RelationshipGraph({ 
  theme = 'ink',
  highlightedIds = []
}: { 
  theme?: ThemeMode;
  highlightedIds?: string[];
}) {
  const isDarkMode = theme === 'ink';
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
        nodeColor={(node: any) => {
          const isHighlighted = highlightedIds.includes(node.id);
          if (hasContext && !isHighlighted) return isDarkMode ? 'rgba(115, 115, 115, 0.2)' : 'rgba(115, 115, 115, 0.1)';
          if (node.group === 1) return '#34D399';
          if (node.group === 2) return '#60A5FA';
          return '#A855F7';
        }}
        nodeRelSize={4}
        linkDirectionalParticles={hasContext ? 0 : 2}
        linkDirectionalParticleSpeed={0.005}
        linkColor={(link: any) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const isRelated = highlightedIds.includes(sourceId) && highlightedIds.includes(targetId);
          
          if (hasContext) {
            return isRelated 
              ? (isDarkMode ? 'rgba(220, 38, 38, 0.6)' : 'rgba(153, 27, 27, 0.5)') 
              : (isDarkMode ? 'rgba(115, 115, 115, 0.05)' : 'rgba(115, 115, 115, 0.05)');
          }
          return isDarkMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(153, 27, 27, 0.15)';
        }}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale) => {
          const isHighlighted = highlightedIds.includes(node.id);
          const opacity = hasContext && !isHighlighted ? 0.2 : 1;
          
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px JetBrains Mono`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.globalAlpha = opacity;
          ctx.fillStyle = isDarkMode ? 'rgba(15, 15, 15, 0.8)' : 'rgba(255, 255, 255, 0.95)';
          
          if (isHighlighted && hasContext) {
            ctx.shadowColor = '#DC2626';
            ctx.shadowBlur = 10 / globalScale;
            ctx.strokeStyle = '#DC2626';
            ctx.lineWidth = 2 / globalScale;
          } else if (!isDarkMode) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
            ctx.shadowBlur = 4;
          }
          
          const rectX = node.x - bckgDimensions[0] / 2;
          const rectY = node.y - bckgDimensions[1] / 2;
          const rectW = bckgDimensions[0] as number;
          const rectH = bckgDimensions[1] as number;
          
          ctx.fillRect(rectX, rectY, rectW, rectH);
          if (isHighlighted && hasContext) {
             ctx.strokeRect(rectX, rectY, rectW, rectH);
          }
          
          ctx.shadowBlur = 0;

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = (isHighlighted && hasContext) ? (isDarkMode ? '#DC2626' : '#991B1B') : (isDarkMode ? '#FFFFFF' : '#1A1A1A');
          ctx.fillText(label, node.x, node.y);

          // Node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y - 12 / globalScale, 3 / globalScale, 0, 2 * Math.PI, false);
          ctx.fillStyle = (node.group === 1 ? '#34D399' : node.group === 2 ? '#60A5FA' : '#A855F7');
          ctx.fill();
          ctx.globalAlpha = 1;
        }}
      />
    </div>
  );
}

