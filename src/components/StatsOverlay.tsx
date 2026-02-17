import React from 'react';
import { AlgorithmResult } from '@/lib/algorithms';

interface StatsOverlayProps {
  label: string;
  result: AlgorithmResult | null;
}

const StatsOverlay: React.FC<StatsOverlayProps> = ({ label, result }) => {
  if (!result) return null;

  return (
    <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs shadow-lg z-10">
      <h4 className="font-semibold text-foreground mb-1">{label}</h4>
      <div className="space-y-0.5 text-muted-foreground">
        <p>Nodes visited: <span className="text-foreground font-medium">{result.totalNodesVisited}</span></p>
        <p>Path cost: <span className="text-foreground font-medium">{result.pathCost}</span></p>
        <p>Time: <span className="text-foreground font-medium">{result.executionTimeMs}ms</span></p>
      </div>
    </div>
  );
};

export default StatsOverlay;
