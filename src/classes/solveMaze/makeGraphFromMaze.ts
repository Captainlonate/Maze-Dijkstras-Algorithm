import { Graph, GraphNode } from '../DataStructures/Graph'
import { TCell, CellType } from '../types'

/*
  If a user were solving the maze with a pencil, would the cell
  be one where they could draw their line.
*/
const cellIsWalkable = (val: CellType) => val !== 'w'

/*
  
*/
export const makeGraphFromMaze = (maze: CellType[][], rootCellIndex: TCell, endCellIndex: TCell): Graph => {
  // Graph that will be populated and returned
  const graph = new Graph()

  //  These will help us remember nodes that we can link to
  let leftJunctionUnconnected: GraphNode | null = null
  const topJunctions: (GraphNode | null)[] = (new Array(maze.length)).fill(null)

  // Pre-declare these to avoid a lot of garbage collection (for large mazes)
  let currentCellValue = undefined
  let canGoUp = false, canGoRight = false, canGoDown = false, canGoLeft = false, isAJunction = false;

  for (let rowIdx = 0; rowIdx < maze.length; rowIdx++) {
    // Forget the (horizontal) left unconnected junction at the start of each row
    leftJunctionUnconnected = null
    
    for (let colIdx = 0; colIdx < maze[rowIdx].length; colIdx++) {
      currentCellValue = maze[rowIdx][colIdx]

      canGoUp = (rowIdx > 0) ? cellIsWalkable(maze[rowIdx - 1][colIdx]) : false
      canGoRight = (colIdx + 1 < maze.length) ? cellIsWalkable(maze[rowIdx][colIdx + 1]) : false
      canGoDown = (rowIdx + 1 < maze.length) ? cellIsWalkable(maze[rowIdx + 1][colIdx]) : false
      canGoLeft = (colIdx > 0) ? cellIsWalkable(maze[rowIdx][colIdx - 1]) : false

      if (!cellIsWalkable(currentCellValue)) {
        leftJunctionUnconnected = null
        topJunctions[colIdx] = null
        continue
      }

      isAJunction = (
        currentCellValue === 's' ||
        currentCellValue === 'e' ||
        ((canGoUp || canGoDown) && (canGoLeft || canGoRight))
      )

      if (isAJunction) {
        const currentCellNode = new GraphNode(maze[rowIdx][colIdx], rowIdx, colIdx)
        graph.addNode(currentCellNode)

        if (leftJunctionUnconnected) {
          graph.linkTwoNodes(
            leftJunctionUnconnected,
            currentCellNode,
            currentCellNode.colIdx - leftJunctionUnconnected.colIdx
          )
        }

        const unconnectedJunctionAbove = topJunctions[colIdx]
        if (unconnectedJunctionAbove) {
          graph.linkTwoNodes(
            unconnectedJunctionAbove,
            currentCellNode,
            currentCellNode.rowIdx - unconnectedJunctionAbove.rowIdx
          )
        }

        // If right cell is a path, this junction is the new rememberLeft
        // If right cell is a wall or end of board, rememberLeft is now null
        leftJunctionUnconnected = canGoRight ? currentCellNode : null
        
        // If bottom cell is a path, this junction is the new top junction for this column
        // If bottom cell is a wall or end of board, rememberTop is now null
        topJunctions[colIdx] = canGoDown ? currentCellNode : null
      }
    }
  }

  // This must be done AFTER the graph is populated (with these two nodes)
  graph.setRootNode(rootCellIndex.rowIdx, rootCellIndex.colIdx)
  graph.setEndNode(endCellIndex.rowIdx, endCellIndex.colIdx)

  return graph
}