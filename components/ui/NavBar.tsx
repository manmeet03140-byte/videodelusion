'use client';

import { useState, useRef, useEffect } from 'react';

type NodeConfig = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  parentId: 'root' | string;
  href?: string;
};

// Initial positions for the nodes, shifted down to prevent clipping at the top
const initialNodes: Record<string, NodeConfig> = {
  work: { id: 'work', label: 'Work', x: 200, y: 65, width: 80, parentId: 'root' },
  work_motion: { id: 'work_motion', label: 'Motion Graphic', x: 350, y: 25, width: 130, parentId: 'work' },
  work_color: { id: 'work_color', label: 'Color Grading', x: 350, y: 65, width: 120, parentId: 'work' },
  work_animation: { id: 'work_animation', label: 'Animation', x: 350, y: 105, width: 100, parentId: 'work' },

  skills: { id: 'skills', label: 'Skills', x: 200, y: 115, width: 80, parentId: 'root' },

  contact: { id: 'contact', label: 'Contact', x: 200, y: 165, width: 80, parentId: 'root' },
  contact_email: { id: 'contact_email', label: 'Email', x: 350, y: 125, width: 80, parentId: 'contact', href: 'mailto:manmeet03140@gmail.com' },
  contact_instagram: { id: 'contact_instagram', label: 'Instagram', x: 350, y: 165, width: 100, parentId: 'contact', href: 'https://youtube.com/shorts/GQNW1IlvhcY?si=HQdhOxmYOpX94HW8' },
  contact_call: { id: 'contact_call', label: 'Call', x: 350, y: 205, width: 80, parentId: 'contact', href: 'tel:+918264737223' },
};

type NodeId = keyof typeof initialNodes;

export default function NavBar({ onOpenSkills }: { onOpenSkills: () => void }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [draggingNode, setDraggingNode] = useState<NodeId | 'root' | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    work: true,
    contact: false,
  });

  // Root node position (Manmeet Singh), shifted down
  const [rootPos, setRootPos] = useState({ x: 24, y: 115 });
  const rootPort = { x: rootPos.x + 106, y: rootPos.y + 15 };

  // For pointer drag delta
  const dragStart = useRef({ x: 0, y: 0 });
  const nodeStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Make layout compact for mobile with specific coordinates to avoid overlaps
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRootPos({ x: 12, y: 110 });
      setNodes((prev) => ({
        ...prev,
        work: { ...prev.work, x: 130, y: 50 },
        work_motion: { ...prev.work_motion, x: 220, y: 10 },
        work_color: { ...prev.work_color, x: 220, y: 50 },
        work_animation: { ...prev.work_animation, x: 220, y: 90 },
        
        skills: { ...prev.skills, x: 130, y: 110 },
        
        contact: { ...prev.contact, x: 130, y: 170 },
        contact_email: { ...prev.contact_email, x: 220, y: 140 },
        contact_instagram: { ...prev.contact_instagram, x: 220, y: 180 },
        contact_call: { ...prev.contact_call, x: 220, y: 220 },
      }));
    }
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingNode) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      if (draggingNode === 'root') {
        setRootPos({
          x: nodeStart.current.x + dx,
          y: nodeStart.current.y + dy,
        });
      } else {
        setNodes(prev => ({
          ...prev,
          [draggingNode]: {
            ...prev[draggingNode],
            x: nodeStart.current.x + dx,
            y: nodeStart.current.y + dy,
          }
        }));
      }
    };

    const handlePointerUp = () => {
      setDraggingNode(null);
    };

    if (draggingNode) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingNode]);

  const handlePointerDown = (id: NodeId | 'root', e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingNode(id);
    dragStart.current = { x: e.clientX, y: e.clientY };
    if (id === 'root') {
      nodeStart.current = { x: rootPos.x, y: rootPos.y };
    } else {
      nodeStart.current = { x: nodes[id].x, y: nodes[id].y };
    }
  };

  const handleNodeClick = (id: NodeId, e: React.MouseEvent) => {
    if (id === 'skills') {
      e.preventDefault();
      onOpenSkills();
    }

    // Toggle expand/collapse if node has children
    const hasChildren = Object.values(nodes).some(n => n.parentId === id);
    if (hasChildren) {
      e.preventDefault();
      setExpandedNodes(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  return (
    <nav
      id="main-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        pointerEvents: 'none', // SVG is full screen, allow clicks to pass through
      }}
    >
      {/* Background SVG for drawing bezier wires */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {Object.values(nodes).map((node) => {
          if (node.parentId !== 'root' && !expandedNodes[node.parentId]) return null;

          const nodePort = { x: node.x, y: node.y + 15 };

          let parentPort = rootPort;
          if (node.parentId !== 'root') {
            const parentNode = nodes[node.parentId];
            parentPort = { x: parentNode.x + parentNode.width, y: parentNode.y + 15 };
          }

          const isHovered = hoveredNode === node.id || draggingNode === node.id || hoveredNode === node.parentId;

          // Cubic bezier from parent to node
          const cp1x = parentPort.x + Math.max(30, (nodePort.x - parentPort.x) / 2);
          const cp1y = parentPort.y;
          const cp2x = nodePort.x - Math.max(30, (nodePort.x - parentPort.x) / 2);
          const cp2y = nodePort.y;
          const pathD = `M ${parentPort.x} ${parentPort.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nodePort.x} ${nodePort.y}`;

          return (
            <path
              key={`wire-${node.id}`}
              d={pathD}
              fill="none"
              stroke={isHovered ? '#00FFE0' : 'rgba(255,255,255,0.15)'}
              strokeWidth={isHovered ? 2 : 1.5}
              style={{ transition: draggingNode ? 'none' : 'stroke 0.3s, stroke-width 0.3s' }}
            />
          );
        })}
      </svg>

      {/* Root Node (Manmeet Singh) */}
      <div
        onPointerDown={(e) => handlePointerDown('root', e)}
        style={{
          position: 'absolute',
          left: `${rootPos.x}px`,
          top: `${rootPos.y}px`,
          width: '106px',
          height: '30px',
          background: draggingNode === 'root' ? 'rgba(51, 51, 51, 0.7)' : 'rgba(42, 42, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: draggingNode === 'root' ? 'grabbing' : 'grab',
          pointerEvents: 'auto',
          userSelect: 'none',
          touchAction: 'none',
          transition: draggingNode === 'root' ? 'none' : 'background 0.2s, border-color 0.2s',
        }}
      >
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#fff', letterSpacing: '0.05em' }}>
          Manmeet Singh
        </span>
        {/* Output port */}
        <div style={{
          position: 'absolute',
          right: '-4px',
          top: '11px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#00FFE0',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }} />
      </div>

      {/* Navigation Nodes */}
      {Object.values(nodes).map((node) => {
        if (node.parentId !== 'root' && !expandedNodes[node.parentId]) return null;

        const isDragging = draggingNode === node.id;
        const isHovered = hoveredNode === node.id;
        const hasChildren = Object.values(nodes).some(n => n.parentId === node.id);
        const isExpanded = expandedNodes[node.id];

        return (
          <a
            key={node.id}
            href={node.href || `#${node.id}`}
            onClick={(e) => handleNodeClick(node.id as NodeId, e)}
            onPointerDown={(e) => handlePointerDown(node.id as NodeId, e)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: `${node.width}px`,
              height: '30px',
              background: isHovered || isDragging ? 'rgba(51, 51, 51, 0.7)' : 'rgba(34, 34, 34, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid',
              borderColor: isHovered || isDragging ? '#00FFE0' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: isDragging ? 'none' : 'background 0.2s, border-color 0.2s',
              cursor: isDragging ? 'grabbing' : 'grab',
              pointerEvents: 'auto',
              userSelect: 'none',
              touchAction: 'none',
            }}
            draggable={false}
          >
            {/* Input port */}
            <div style={{
              position: 'absolute',
              left: '-4px',
              top: '11px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isHovered || isDragging ? '#00FFE0' : '#555',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: isDragging ? 'none' : 'background 0.2s',
            }} />

            <span style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              color: isHovered || isDragging ? '#fff' : '#aaa',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: isDragging ? 'none' : 'color 0.2s',
            }}>
              {node.label}
            </span>

            {/* Output port (only if has children) */}
            {hasChildren && (
              <div style={{
                position: 'absolute',
                right: '-4px',
                top: '11px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isExpanded ? '#00FFE0' : '#555',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'background 0.2s',
              }} />
            )}
          </a>
        );
      })}
    </nav>
  );
}
