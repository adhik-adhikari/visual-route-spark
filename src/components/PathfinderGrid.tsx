import React, { useState, useCallback, useRef } from 'react';
import GridNodeComponent from './GridNode';
import ControlPanel from './ControlPanel';
import StatsOverlay from './StatsOverlay';
import { GridNode, NodeState, AlgorithmType, BrushMode, AlgorithmResult, runAlgorithm, generateMaze } from '@/lib/algorithms';

const ROWS = 25;
const COLS = 50;
const DEFAULT_START: [number, number] = [12, 10];
const DEFAULT_END: [number, number] = [12, 40];

function createGrid(startPos: [number, number], endPos: [number, number]): GridNode[][] {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      row: r,
      col: c,
      state: (r === startPos[0] && c === startPos[1]) ? 'start' as NodeState
        : (r === endPos[0] && c === endPos[1]) ? 'end' as NodeState
        : 'empty' as NodeState,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      previousNode: null,
      isProcessed: false,
    }))
  );
}

function cloneGridLayout(grid: GridNode[][]): GridNode[][] {
  return grid.map(row => row.map(node => ({ ...node })));
}

interface SingleGridProps {
  grid: GridNode[][];
  onMouseDown: (r: number, c: number) => void;
  onMouseEnter: (r: number, c: number) => void;
  onMouseUp: () => void;
  label?: string;
  result: AlgorithmResult | null;
}

const SingleGrid: React.FC<SingleGridProps> = React.memo(({ grid, onMouseDown, onMouseEnter, onMouseUp, label, result }) => (
  <div className="relative flex-1 min-w-0">
    {label && <StatsOverlay label={label} result={result} />}
    <div
      className="grid w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        aspectRatio: `${COLS}/${ROWS}`,
      }}
    >
      {grid.map((row, r) =>
        row.map((node, c) => (
          <GridNodeComponent
            key={`${r}-${c}`}
            state={node.state}
            onMouseDown={() => onMouseDown(r, c)}
            onMouseEnter={() => onMouseEnter(r, c)}
            onMouseUp={onMouseUp}
          />
        ))
      )}
    </div>
  </div>
));
SingleGrid.displayName = 'SingleGrid';

const PathfinderGrid: React.FC = () => {
  const [startPos, setStartPos] = useState<[number, number]>(DEFAULT_START);
  const [endPos, setEndPos] = useState<[number, number]>(DEFAULT_END);
  const [grid, setGrid] = useState<GridNode[][]>(() => createGrid(DEFAULT_START, DEFAULT_END));
  const [grid2, setGrid2] = useState<GridNode[][]>(() => createGrid(DEFAULT_START, DEFAULT_END));
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [speed, setSpeed] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [brushMode, setBrushMode] = useState<BrushMode>('wall');
  const [compareMode, setCompareMode] = useState(false);
  const [result1, setResult1] = useState<AlgorithmResult | null>(null);
  const [result2, setResult2] = useState<AlgorithmResult | null>(null);
  const mouseDown = useRef(false);
  const dragging = useRef<'start' | 'end' | 'draw' | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const updateNodeState = useCallback((row: number, col: number, state: NodeState) => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = { ...next[row][col], state };
      return next;
    });
    if (compareMode) {
      setGrid2(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = { ...next[row][col], state };
        return next;
      });
    }
  }, [compareMode]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    if (isRunning) return;
    mouseDown.current = true;
    const node = grid[row][col];
    if (node.state === 'start') {
      dragging.current = 'start';
    } else if (node.state === 'end') {
      dragging.current = 'end';
    } else {
      dragging.current = 'draw';
      if (node.state === 'wall' || node.state === 'weight') {
        updateNodeState(row, col, 'empty');
      } else {
        updateNodeState(row, col, brushMode === 'weight' ? 'weight' : 'wall');
      }
    }
  }, [grid, isRunning, updateNodeState, brushMode]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!mouseDown.current || isRunning) return;
    if (dragging.current === 'start') {
      if (grid[row][col].state !== 'end' && grid[row][col].state !== 'wall') {
        updateNodeState(startPos[0], startPos[1], 'empty');
        updateNodeState(row, col, 'start');
        setStartPos([row, col]);
      }
    } else if (dragging.current === 'end') {
      if (grid[row][col].state !== 'start' && grid[row][col].state !== 'wall') {
        updateNodeState(endPos[0], endPos[1], 'empty');
        updateNodeState(row, col, 'end');
        setEndPos([row, col]);
      }
    } else if (dragging.current === 'draw') {
      if (grid[row][col].state === 'empty') {
        updateNodeState(row, col, brushMode === 'weight' ? 'weight' : 'wall');
      } else if (grid[row][col].state === 'wall' || grid[row][col].state === 'weight') {
        updateNodeState(row, col, 'empty');
      }
    }
  }, [grid, isRunning, startPos, endPos, updateNodeState, brushMode]);

  const handleMouseUp = useCallback(() => {
    mouseDown.current = false;
    dragging.current = null;
  }, []);

  const clearPath = useCallback(() => {
    setResult1(null);
    setResult2(null);
    const cleaner = (prev: GridNode[][]) => prev.map(row => row.map(node =>
      node.state === 'visited' || node.state === 'path'
        ? { ...node, state: 'empty' as NodeState }
        : node
    ));
    setGrid(cleaner);
    setGrid2(cleaner);
  }, []);

  const clearBoard = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsRunning(false);
    setResult1(null);
    setResult2(null);
    setStartPos(DEFAULT_START);
    setEndPos(DEFAULT_END);
    const fresh = createGrid(DEFAULT_START, DEFAULT_END);
    setGrid(fresh);
    setGrid2(cloneGridLayout(fresh));
  }, []);

  const animateResult = (
    result: AlgorithmResult,
    setter: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    baseSpeed: number
  ) => {
    result.visitedOrder.forEach(([r, c], i) => {
      const id = window.setTimeout(() => {
        setter(prev => {
          const next = prev.map(row => [...row]);
          next[r][c] = { ...next[r][c], state: 'visited' };
          return next;
        });
      }, i * baseSpeed);
      timeoutsRef.current.push(id);
    });

    const pathStart = result.visitedOrder.length * baseSpeed;
    result.path.forEach(([r, c], i) => {
      const id = window.setTimeout(() => {
        setter(prev => {
          const next = prev.map(row => [...row]);
          next[r][c] = { ...next[r][c], state: 'path' };
          return next;
        });
      }, pathStart + i * baseSpeed * 3);
      timeoutsRef.current.push(id);
    });

    return pathStart + result.path.length * baseSpeed * 3;
  };

  const visualize = useCallback(() => {
    setResult1(null);
    setResult2(null);

    const cleaner = (g: GridNode[][]) => g.map(row => row.map(node =>
      node.state === 'visited' || node.state === 'path'
        ? { ...node, state: 'empty' as NodeState }
        : node
    ));

    const cleanGrid1 = cleaner(grid);
    setGrid(cleanGrid1);
    setIsRunning(true);
    timeoutsRef.current = [];

    if (compareMode) {
      const cleanGrid2 = cleaner(grid2);
      setGrid2(cleanGrid2);

      const r1 = runAlgorithm(cleanGrid1, startPos, endPos, 'dijkstra');
      const r2 = runAlgorithm(cleanGrid2, startPos, endPos, 'astar');
      setResult1(r1);
      setResult2(r2);

      const t1 = animateResult(r1, setGrid, speed);
      const t2 = animateResult(r2, setGrid2, speed);

      const doneId = window.setTimeout(() => setIsRunning(false), Math.max(t1, t2) + 100);
      timeoutsRef.current.push(doneId);
    } else {
      const r1 = runAlgorithm(cleanGrid1, startPos, endPos, algorithm);
      setResult1(r1);
      const t1 = animateResult(r1, setGrid, speed);
      const doneId = window.setTimeout(() => setIsRunning(false), t1 + 100);
      timeoutsRef.current.push(doneId);
    }
  }, [grid, grid2, startPos, endPos, algorithm, speed, compareMode]);

  const handleGenerateMaze = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setResult1(null);
    setResult2(null);

    const fresh = createGrid(startPos, endPos);
    setGrid(fresh);
    setGrid2(cloneGridLayout(fresh));

    const walls = generateMaze(ROWS, COLS, startPos, endPos);
    setIsRunning(true);

    walls.forEach(([r, c], i) => {
      const id = window.setTimeout(() => {
        setGrid(prev => {
          const next = prev.map(row => [...row]);
          if (next[r][c].state === 'empty') {
            next[r][c] = { ...next[r][c], state: 'wall' };
          }
          return next;
        });
        if (compareMode) {
          setGrid2(prev => {
            const next = prev.map(row => [...row]);
            if (next[r][c].state === 'empty') {
              next[r][c] = { ...next[r][c], state: 'wall' };
            }
            return next;
          });
        }
      }, i * 5);
      timeoutsRef.current.push(id);
    });

    const doneId = window.setTimeout(() => setIsRunning(false), walls.length * 5 + 100);
    timeoutsRef.current.push(doneId);
  }, [startPos, endPos, compareMode]);

  const handleCompareModeChange = useCallback((v: boolean) => {
    setCompareMode(v);
    if (v) {
      setGrid2(cloneGridLayout(grid));
    }
  }, [grid]);

  // Dummy handlers for grid2 (read-only in compare mode)
  const noop = useCallback(() => {}, []);
  const noopRC = useCallback((_r: number, _c: number) => {}, []);

  return (
    <div className="flex h-screen" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <ControlPanel
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        speed={speed}
        onSpeedChange={setSpeed}
        onVisualize={visualize}
        onClearBoard={clearBoard}
        onClearPath={clearPath}
        onGenerateMaze={handleGenerateMaze}
        isRunning={isRunning}
        brushMode={brushMode}
        onBrushModeChange={setBrushMode}
        compareMode={compareMode}
        onCompareModeChange={handleCompareModeChange}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-muted/30">
        <div className="px-4 py-2 border-b border-border bg-card">
          <p className="text-xs text-muted-foreground">
            Click & drag to draw {brushMode === 'weight' ? 'mud (weighted)' : 'walls'}. Drag the green/red markers to reposition.
          </p>
        </div>

        <div className={`flex-1 flex ${compareMode ? 'gap-1' : ''} p-2 overflow-auto items-start select-none`}>
          <SingleGrid
            grid={grid}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            label={compareMode ? "Dijkstra's" : undefined}
            result={result1}
          />
          {compareMode && (
            <SingleGrid
              grid={grid2}
              onMouseDown={noopRC}
              onMouseEnter={noopRC}
              onMouseUp={noop}
              label="A* Search"
              result={result2}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PathfinderGrid;
