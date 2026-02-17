# Visual Route Spark - Pathfinding Visualizer

An interactive web application for visualizing pathfinding algorithms built with React, TypeScript, and Vite.

## Features

- **Interactive Grid**: Click and drag to create walls and weighted nodes
- **Multiple Algorithms**: Visualize Dijkstra's algorithm and A* search
- **Algorithm Comparison**: Side-by-side comparison of different algorithms
- **Maze Generation**: Automatically generate random mazes
- **Real-time Visualization**: Watch algorithms explore the grid step by step
- **Statistics**: View algorithm performance metrics (nodes visited, path cost, execution time)

## Algorithms Implemented

- **Dijkstra's Algorithm**: Guarantees shortest path, explores uniformly
- **A* Search**: Uses heuristics for faster pathfinding, also guarantees shortest path

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd visual-route-spark
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Drawing Obstacles**: Click and drag on the grid to draw walls (black) or weighted nodes (brown)
2. **Moving Start/End Points**: Drag the green (start) and red (end) markers to reposition them
3. **Choose Algorithm**: Select between Dijkstra's and A* from the control panel
4. **Visualize**: Click "Visualize" to see the algorithm in action
5. **Compare Mode**: Enable compare mode to see both algorithms side by side
6. **Generate Maze**: Click "Generate Maze" for a random maze layout
7. **Clear**: Use "Clear Path" to remove the visualization or "Clear Board" to reset everything

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Technology Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Radix UI** - Headless UI components

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components (shadcn/ui)
│   ├── ControlPanel.tsx
│   ├── GridNode.tsx
│   ├── PathfinderGrid.tsx
│   └── StatsOverlay.tsx
├── lib/
│   ├── algorithms.ts  # Pathfinding algorithm implementations
│   └── utils.ts       # Utility functions
├── pages/             # Page components
└── hooks/             # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with modern React development practices
- Inspired by classic pathfinding visualizations
- Uses efficient algorithm implementations for smooth animations
