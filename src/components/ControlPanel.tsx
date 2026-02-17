import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlgorithmType, BrushMode } from '@/lib/algorithms';
import { Play, Trash2, Eraser, Grid3X3, Paintbrush, Weight, GitCompareArrows } from 'lucide-react';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  onAlgorithmChange: (a: AlgorithmType) => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  onVisualize: () => void;
  onClearBoard: () => void;
  onClearPath: () => void;
  onGenerateMaze: () => void;
  isRunning: boolean;
  brushMode: BrushMode;
  onBrushModeChange: (m: BrushMode) => void;
  compareMode: boolean;
  onCompareModeChange: (v: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm, onAlgorithmChange, speed, onSpeedChange,
  onVisualize, onClearBoard, onClearPath, onGenerateMaze,
  isRunning, brushMode, onBrushModeChange, compareMode, onCompareModeChange,
}) => {
  const speedLabel = speed <= 10 ? 'Fast' : speed <= 30 ? 'Medium' : 'Slow';

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-primary" />
          Pathfinder
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Interactive Algorithm Visualizer</p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Algorithm */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Algorithm</Label>
          <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)} disabled={isRunning || compareMode}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dijkstra">Dijkstra's</SelectItem>
              <SelectItem value="astar">A* Search</SelectItem>
            </SelectContent>
          </Select>
          {compareMode && <p className="text-[10px] text-muted-foreground">Compare mode runs both algorithms</p>}
        </div>

        <Separator />

        {/* Brush Mode */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Brush</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={brushMode === 'wall' ? 'default' : 'outline'}
              onClick={() => onBrushModeChange('wall')}
              disabled={isRunning}
              className="flex-1 gap-1 text-xs"
            >
              <Paintbrush className="h-3.5 w-3.5" /> Wall
            </Button>
            <Button
              size="sm"
              variant={brushMode === 'weight' ? 'default' : 'outline'}
              onClick={() => onBrushModeChange('weight')}
              disabled={isRunning}
              className="flex-1 gap-1 text-xs"
            >
              <Weight className="h-3.5 w-3.5" /> Mud (5×)
            </Button>
          </div>
        </div>

        <Separator />

        {/* Speed */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Speed</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[speed]}
              onValueChange={([v]) => onSpeedChange(v)}
              min={2}
              max={50}
              step={1}
              disabled={isRunning}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 text-right">{speedLabel}</span>
          </div>
        </div>

        <Separator />

        {/* Compare Mode */}
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <GitCompareArrows className="h-3.5 w-3.5" /> Compare
          </Label>
          <Switch checked={compareMode} onCheckedChange={onCompareModeChange} disabled={isRunning} />
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button onClick={onVisualize} disabled={isRunning} className="w-full gap-1.5">
            <Play className="h-4 w-4" /> Visualize
          </Button>
          <Button variant="outline" onClick={onGenerateMaze} disabled={isRunning} className="w-full gap-1.5">
            <Grid3X3 className="h-4 w-4" /> Generate Maze
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClearPath} disabled={isRunning} className="flex-1 gap-1 text-xs">
              <Eraser className="h-3.5 w-3.5" /> Path
            </Button>
            <Button variant="destructive" size="sm" onClick={onClearBoard} disabled={isRunning} className="flex-1 gap-1 text-xs">
              <Trash2 className="h-3.5 w-3.5" /> Board
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[hsl(var(--node-start))] rounded-sm" /> Start</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[hsl(var(--node-end))] rounded-sm" /> End</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[hsl(var(--node-wall))] rounded-sm" /> Wall</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[hsl(var(--node-weight))] rounded-sm" /> Mud</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[hsl(var(--node-visited))] rounded-sm" /> Visited</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[hsl(var(--node-path))] rounded-sm" /> Path</span>
        </div>
      </div>
    </aside>
  );
};

export default ControlPanel;
