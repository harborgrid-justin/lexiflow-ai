/**
 * WorkflowCanvas Component
 * Interactive canvas for building workflows with drag-and-drop
 */

import React, { useRef, useState, useEffect } from 'react';
import { WorkflowStage } from './WorkflowStage';
import { useWorkflowBuilderStore } from '../store/workflow.store';
import { WorkflowStage as WorkflowStageType } from '../types';

export const WorkflowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connecting, setConnecting] = useState<{ fromId: string; startX: number; startY: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    stages,
    selectedStageId,
    isDragging,
    zoom,
    canvasOffset,
    selectStage,
    setStagePosition,
    setIsDragging,
    setZoom,
    setCanvasOffset,
    connectStages,
  } = useWorkflowBuilderStore();

  const [draggedStage, setDraggedStage] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleStageSelectClick = (stageId: string) => {
    selectStage(stageId);
  };

  const handleStageDragStart = (e: React.DragEvent, stageId: string) => {
    setDraggedStage(stageId);
    setIsDragging(true);
    const stage = stages.find((s) => s.id === stageId);
    if (stage && stage.position) {
      setDragStartPos({ x: e.clientX - stage.position.x, y: e.clientY - stage.position.y });
    }
  };

  const handleStageDrag = (e: React.DragEvent) => {
    if (draggedStage && dragStartPos && e.clientX !== 0 && e.clientY !== 0) {
      const newX = e.clientX - dragStartPos.x;
      const newY = e.clientY - dragStartPos.y;
      setStagePosition(draggedStage, { x: Math.max(0, newX), y: Math.max(0, newY) });
    }
  };

  const handleStageDragEnd = () => {
    setDraggedStage(null);
    setDragStartPos(null);
    setIsDragging(false);
  };

  const handleCanvasClick = () => {
    selectStage(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(zoom + delta);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (connecting) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // Draw connections between stages
  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    stages.forEach((stage) => {
      if (stage.nextStages && stage.position) {
        stage.nextStages.forEach((nextId) => {
          const nextStage = stages.find((s) => s.id === nextId);
          if (nextStage && nextStage.position) {
            const startX = stage.position.x + 120; // Center of stage (240/2)
            const startY = stage.position.y + 80; // Approximate vertical center
            const endX = nextStage.position.x + 120;
            const endY = nextStage.position.y + 80;

            // Calculate control points for curved line
            const controlX1 = startX + (endX - startX) / 3;
            const controlY1 = startY;
            const controlX2 = startX + (2 * (endX - startX)) / 3;
            const controlY2 = endY;

            const pathD = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

            connections.push(
              <g key={`${stage.id}-${nextId}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          }
        });
      }
    });

    return connections;
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gray-100 overflow-auto"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
      }}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
    >
      {/* SVG for connections */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
          </marker>
        </defs>
        {renderConnections()}
      </svg>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          zIndex: 0,
        }}
      />

      {/* Workflow Stages */}
      <div className="relative" style={{ zIndex: 2 }}>
        {stages.map((stage) => (
          <WorkflowStage
            key={stage.id}
            stage={stage}
            isSelected={selectedStageId === stage.id}
            onSelect={() => handleStageSelectClick(stage.id)}
            onDragStart={(e) => handleStageDragStart(e, stage.id)}
            onDrag={handleStageDrag}
            onDragEnd={handleStageDragEnd}
          />
        ))}
      </div>

      {/* Empty State */}
      {stages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Building Your Workflow
            </h3>
            <p className="text-gray-600">
              Drag stages from the library onto the canvas
            </p>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg border p-2">
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded font-bold"
          title="Zoom In"
        >
          +
        </button>
        <div className="text-center text-xs text-gray-600 font-medium">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded font-bold"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-xs"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
