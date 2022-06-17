# Solving a maze with Dijkstra's Algorithm

This is a react & typescript website. When given some maze data, it will solve the maze and render the solution in a `<canvas>`. 

The reason I built this is because I wanted to learn how Dijkstra's Algorithm works, and use it for something.

__The final thing looks like this:__

<img src='./readme_images/maze_screenshot.png' alt='Screenshot of the maze' />

The maze is converted into a weighted graph data structure, where the nodes of the graph come from the "junction points" / "decision points" of the maze. The app will render little markers on the junction point cells (the circles in the picture above), so you can see the nodes of the graph.

<img src='./readme_images/maze_junctions.png' alt='Maze showing only junctions' />

Next, Dijkstra's algorithm will find the shortest path to all nodes in the graph, but we're interested in the one to the end cell of the maze.

## Details

- The app makes use of several data structures, which can be found in `/src/classes/DataStructures`
  - Graph (with it's GraphNode, GraphNodeLink)
  - SortedLinkedList (which is used as a priority queue)
  - DijkstrasPathLookupTable (which is what stores the shortest distance and path to each node)
- The maze is first converted to a weighted graph datastructure.
  - That takes place in `/src/solveMaze/makeGraphFromMaze.ts`
- The graph is analyzed with Dijkstra's Algorithm
  - That takes place in `/src/solveDijkstras.ts`
- I put basically all the other logic in `/src/classes/Maze.ts`
- The React stuff is in `/src/components/`, but there isn't much interesting there except maybe the test maze data (the input to the `Maze.ts`)

## Running it locally

There isn't much to it. It's a [create-react-app](https://create-react-app.dev/) website, so you just:

1) Clone the repo
2) cd into the directory that was created
3) `npm install`
4) `npm start`
