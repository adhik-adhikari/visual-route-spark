

# Pathfinder: Interactive Algorithm Visualizer

## Overview
A responsive web app for visualizing pathfinding algorithms (Dijkstra's and A*) on an interactive 2D grid with animated search exploration and shortest path highlighting.

---

## Feature 1: Interactive Grid
- Render a 2D grid of square nodes (responsive sizing, ~25 rows × 50 columns on desktop)
- Each node has a visual state: Empty, Wall, Start, End, Visited, Shortest Path — each with a distinct color
- Click and drag to draw/erase walls
- Draggable Start (green) and End (red) markers that can be repositioned anywhere on the grid

## Feature 2: Control Panel
- **Algorithm Selector** — dropdown to choose between Dijkstra's Algorithm and A* Search (Manhattan distance heuristic)
- **Speed Slider** — adjusts animation delay (Slow / Medium / Fast)
- **Action Buttons:**
  - "Visualize" — runs the selected algorithm with step-by-step animation
  - "Clear Board" — resets grid to empty state
  - "Clear Path" — removes visited/path coloring but preserves walls and markers

## Feature 3: Algorithm Engine & Visualization
- Implement Dijkstra's algorithm (unweighted BFS-style) and A* with Manhattan distance heuristic
- Animate node exploration with a "pop" scale + fade-in effect as each node is visited (light blue)
- Once the target is found, animate the shortest path backtrack in yellow
- Disable controls during animation to prevent conflicts

## Feature 4: Polish & Responsiveness
- Clean header with app title and brief instructions
- Responsive layout — grid scales down on smaller screens
- Efficient rendering using refs/memoization so only changed cells re-render
- Subtle animations and smooth color transitions using Tailwind + CSS

