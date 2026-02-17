import React from 'react';
import { NodeState } from '@/lib/algorithms';

interface GridNodeProps {
  state: NodeState;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
}

const stateClasses: Record<NodeState, string> = {
  empty: 'bg-background border-border/30',
  wall: 'bg-[hsl(var(--node-wall))]',
  start: 'bg-[hsl(var(--node-start))]',
  end: 'bg-[hsl(var(--node-end))]',
  visited: 'animate-node-visited',
  path: 'animate-node-path',
  weight: 'bg-[hsl(var(--node-weight))]',
};

const GridNodeComponent: React.FC<GridNodeProps> = React.memo(
  ({ state, onMouseDown, onMouseEnter, onMouseUp }) => {
    return (
      <div
        className={`w-full aspect-square border border-border/20 ${stateClasses[state]}`}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
      />
    );
  }
);

GridNodeComponent.displayName = 'GridNode';
export default GridNodeComponent;
