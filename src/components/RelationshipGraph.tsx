import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  label: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

const data = {
  nodes: [
    { id: '1', group: 1, label: '林墨' },
    { id: '2', group: 1, label: '林墨奶奶' },
    { id: '3', group: 2, label: '张磊' },
    { id: '4', group: 2, label: '张磊父亲' },
    { id: '5', group: 3, label: '神秘老者' },
    { id: '6', group: 3, label: '苏清月' },
    { id: '7', group: 1, label: '王叔' },
  ],
  links: [
    { source: '1', target: '2', value: 5 },
    { source: '1', target: '3', value: 2 },
    { source: '3', target: '4', value: 5 },
    { source: '1', target: '5', value: 1 },
    { source: '5', target: '6', value: 3 },
    { source: '1', target: '7', value: 2 },
    { source: '1', target: '6', value: 1 },
  ]
};

export default function RelationshipGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(data.nodes as Node[])
      .force('link', d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(60))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .velocityDecay(0.4) // Increase friction to stabilize faster
      .alphaMin(0.005); // Stop earlier to save CPU

    const link = svg.append('g')
      .attr('stroke', '#3f3f46')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 6)
      .attr('fill', d => {
        if (d.group === 1) return '#34D399'; // Emerald (Text/Main)
        if (d.group === 2) return '#60A5FA'; // Blue (Antagonist)
        return '#A855F7'; // Purple (Mystic)
      })
      .attr('stroke', '#DC2626')
      .attr('stroke-width', d => d.id === '1' ? 2 : 0)
      .style('filter', 'drop-shadow(0 0 5px rgba(220, 38, 38, 0.4))');

    node.append('text')
      .text(d => d.label)
      .attr('x', 10)
      .attr('y', 4)
      .attr('fill', 'var(--text-main)')
      .style('font-size', '10px')
      .style('font-family', 'JetBrains Mono')
      .style('pointer-events', 'none')
      .style('text-transform', 'uppercase')
      .style('transition', 'fill 0.3s ease');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y)
        .attr('stroke', 'var(--brand-red)')
        .attr('stroke-opacity', 0.3);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, []);

  return (
    <svg ref={svgRef} className="w-full h-full flex bg-app-bg/50 transition-colors duration-300" />
  );
}
