export type NodeState = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'weight';

export interface GridNode {
  row: number;
  col: number;
  state: NodeState;
  distance: number;
  heuristic: number;
  totalCost: number;
  previousNode: GridNode | null;
  isProcessed: boolean;
}

export type AlgorithmType = 'dijkstra' | 'astar';

export type BrushMode = 'wall' | 'weight';

function getNeighbors(grid: GridNode[][], node: GridNode): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of dirs) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      neighbors.push(grid[r][c]);
    }
  }
  return neighbors;
}

function manhattanDistance(a: GridNode, b: GridNode): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export interface AlgorithmResult {
  visitedOrder: [number, number][];
  path: [number, number][];
  totalNodesVisited: number;
  pathCost: number;
  executionTimeMs: number;
}

export function runAlgorithm(
  grid: GridNode[][],
  startPos: [number, number],
  endPos: [number, number],
  algorithm: AlgorithmType
): AlgorithmResult {
  const t0 = performance.now();

  const rows = grid.length;
  const cols = grid[0].length;
  const nodes: GridNode[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      state: grid[r][c].state,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      previousNode: null,
      isProcessed: false,
    }))
  );

  const start = nodes[startPos[0]][startPos[1]];
  const end = nodes[endPos[0]][endPos[1]];
  start.distance = 0;
  start.totalCost = 0;

  const visitedOrder: [number, number][] = [];
  const unvisited: GridNode[] = [start];

  while (unvisited.length > 0) {
    unvisited.sort((a, b) => {
      if (algorithm === 'astar') return a.totalCost - b.totalCost;
      return a.distance - b.distance;
    });

    const current = unvisited.shift()!;
    if (current.state === 'wall') continue;
    if (current.distance === Infinity) break;
    current.isProcessed = true;

    if (current !== start && current !== end) {
      visitedOrder.push([current.row, current.col]);
    }

    if (current === end) break;

    for (const neighbor of getNeighbors(nodes, current)) {
      if (neighbor.isProcessed || neighbor.state === 'wall') continue;
      const moveCost = neighbor.state === 'weight' ? 5 : 1;
      const newDist = current.distance + moveCost;
      if (newDist < neighbor.distance) {
        neighbor.distance = newDist;
        neighbor.heuristic = algorithm === 'astar' ? manhattanDistance(neighbor, end) : 0;
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;
        neighbor.previousNode = current;
        if (!unvisited.includes(neighbor)) {
          unvisited.push(neighbor);
        }
      }
    }
  }

  // Backtrack path
  const path: [number, number][] = [];
  let pathCost = 0;
  let current: GridNode | null = end;
  if (end.previousNode !== null || end === start) {
    pathCost = end.distance;
  }
  while (current && current !== start) {
    if (current !== end) path.unshift([current.row, current.col]);
    current = current.previousNode;
  }

  const t1 = performance.now();

  return {
    visitedOrder,
    path,
    totalNodesVisited: visitedOrder.length,
    pathCost,
    executionTimeMs: Math.round((t1 - t0) * 100) / 100,
  };
}

// Maze generation using recursive backtracking
export function generateMaze(
  rows: number,
  cols: number,
  startPos: [number, number],
  endPos: [number, number]
): [number, number][] {
  // Start with all walls
  const maze: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => true)
  );

  const carveOrder: [number, number][] = [];

  function isValid(r: number, c: number) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
  }

  function carve(r: number, c: number) {
    maze[r][c] = false;
    carveOrder.push([r, c]);

    const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    // Shuffle
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (isValid(nr, nc) && maze[nr][nc]) {
        // Carve the wall between
        const mr = r + dr / 2;
        const mc = c + dc / 2;
        maze[mr][mc] = false;
        carveOrder.push([mr, mc]);
        carve(nr, nc);
      }
    }
  }

  // Start carving from an even cell
  const sr = startPos[0] % 2 === 0 ? startPos[0] : 1;
  const sc = startPos[1] % 2 === 0 ? startPos[1] : 1;
  carve(sr, sc);

  // Ensure start and end are carved
  maze[startPos[0]][startPos[1]] = false;
  maze[endPos[0]][endPos[1]] = false;

  // Return the wall positions (cells that remain true)
  const walls: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] && !(r === startPos[0] && c === startPos[1]) && !(r === endPos[0] && c === endPos[1])) {
        walls.push([r, c]);
      }
    }
  }

  return walls;
}
