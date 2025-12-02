/**
 * Citation Network Graph
 * Visualizes citation relationships between cases
 * Can be enhanced with D3.js for more advanced visualizations
 */

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, RefreshCw } from 'lucide-react';
import type { CitationGraph as CitationGraphType, CitationNode, CitationEdge } from '../api/research.types';
import { KeyciteBadge } from './KeyciteIndicator';

interface CitationGraphProps {
  graph: CitationGraphType;
  onNodeClick?: (nodeId: string) => void;
  height?: number;
}

export const CitationGraph: React.FC<CitationGraphProps> = ({
  graph,
  onNodeClick,
  height = 600,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(graph.centerNodeId);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate node positions (simple force-directed layout simulation)
  const calculateLayout = () => {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    const centerNode = graph.nodes.find(n => n.id === graph.centerNodeId);
    const otherNodes = graph.nodes.filter(n => n.id !== graph.centerNodeId);

    const positions: Record<string, { x: number; y: number }> = {};

    // Center node in the middle
    if (centerNode) {
      positions[centerNode.id] = { x: centerX, y: centerY };
    }

    // Arrange other nodes in a circle
    otherNodes.forEach((node, index) => {
      const angle = (index / otherNodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return positions;
  };

  const positions = calculateLayout();

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setSelectedNode(graph.centerNodeId);
  };

  const getEdgeColor = (type: CitationEdge['type']) => {
    const colors = {
      'cites': '#3b82f6', // blue
      'cited-by': '#10b981', // green
      'follows': '#8b5cf6', // purple
      'distinguishes': '#f59e0b', // orange
      'overrules': '#ef4444', // red
    };
    return colors[type] || '#6b7280';
  };

  const getNodeSize = (node: CitationNode) => {
    if (node.isTarget) return 80;
    const baseSize = 50;
    const citationBonus = Math.min(node.citationCount * 0.5, 30);
    return baseSize + citationBonus;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Controls */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Citation Network</h3>
          <p className="text-sm text-gray-600">{graph.nodes.length} cases, {graph.edges.length} connections</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 min-w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Fullscreen">
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        ref={canvasRef}
        className="relative overflow-auto bg-gray-50"
        style={{ height: `${height}px` }}
      >
        <svg
          width="800"
          height="600"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          className="transition-transform duration-200"
        >
          {/* Edges */}
          <g className="edges">
            {graph.edges.map((edge, index) => {
              const sourcePos = positions[edge.source];
              const targetPos = positions[edge.target];
              if (!sourcePos || !targetPos) return null;

              return (
                <g key={`edge-${index}`}>
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={getEdgeColor(edge.type)}
                    strokeWidth={edge.strength ? edge.strength * 2 : 1.5}
                    strokeOpacity={0.6}
                    markerEnd={`url(#arrow-${edge.type})`}
                  />
                  {/* Edge label */}
                  <text
                    x={(sourcePos.x + targetPos.x) / 2}
                    y={(sourcePos.y + targetPos.y) / 2}
                    fill={getEdgeColor(edge.type)}
                    fontSize="10"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {edge.type}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Arrow markers */}
          <defs>
            {['cites', 'cited-by', 'follows', 'distinguishes', 'overrules'].map(type => (
              <marker
                key={type}
                id={`arrow-${type}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={getEdgeColor(type as CitationEdge['type'])} />
              </marker>
            ))}
          </defs>

          {/* Nodes */}
          <g className="nodes">
            {graph.nodes.map(node => {
              const pos = positions[node.id];
              if (!pos) return null;

              const size = getNodeSize(node);
              const isSelected = selectedNode === node.id;
              const isCenter = node.isTarget;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node.id)}
                >
                  {/* Node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size / 2}
                    fill={isCenter ? '#3b82f6' : isSelected ? '#10b981' : '#ffffff'}
                    stroke={isCenter ? '#1e40af' : isSelected ? '#059669' : '#d1d5db'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Citation count badge */}
                  {node.citationCount > 0 && (
                    <g>
                      <circle
                        cx={pos.x + size / 3}
                        cy={pos.y - size / 3}
                        r="12"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={pos.x + size / 3}
                        y={pos.y - size / 3 + 1}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {node.citationCount > 99 ? '99+' : node.citationCount}
                      </text>
                    </g>
                  )}

                  {/* Node label */}
                  <foreignObject
                    x={pos.x - size / 2}
                    y={pos.y + size / 2 + 5}
                    width={size * 2}
                    height="60"
                    className="pointer-events-none"
                  >
                    <div className="text-center">
                      <div className={`text-xs font-medium ${isCenter || isSelected ? 'text-gray-900' : 'text-gray-700'} line-clamp-2 mb-1`}>
                        {node.title}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {node.citation}
                      </div>
                      <div className="text-xs text-gray-400">
                        {node.year}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {(() => {
            const node = graph.nodes.find(n => n.id === selectedNode);
            if (!node) return null;

            return (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{node.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-mono">{node.citation}</span>
                    <span>•</span>
                    <span>{node.court}</span>
                    <span>•</span>
                    <span>{node.year}</span>
                    <span>•</span>
                    <span>{node.citationCount} citations</span>
                  </div>
                </div>
                {node.treatment && (
                  <KeyciteBadge status={node.treatment} />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Cites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Cited By</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-600">Follows</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Distinguishes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Overrules</span>
          </div>
        </div>
      </div>
    </div>
  );
};
