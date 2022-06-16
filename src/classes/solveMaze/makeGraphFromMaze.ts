import { Graph, GraphNode } from '../DataStructures/Graph'
import { TCell } from '../types'

// ========================Types====================

interface IAnalyzedMazeCell {
  isPath: boolean;
  isEnd: boolean;
  isStart: boolean;
  isJunction: boolean;
}

// =================================================

/*

*/
const cellIsPath = (val: any) => (
  val === 'p' || val === 's' || val === 'e'
)

/*

*/
export const makeGraphFromMaze = (maze: string[][], rootCellIndex: TCell, endCellIndex: TCell): Graph => {
  // The maze is a square (same length rows as columns)
  const analyzedMaze: IAnalyzedMazeCell[][] = (new Array(maze.length)).fill(null).map(() => ([]))

  // Graph
  const graph = new Graph()

  //
  for (let rowIdx = 0; rowIdx < maze.length; rowIdx++) {
    for (let colIdx = 0; colIdx < maze.length; colIdx++) {
      const currentCellData = maze[rowIdx][colIdx]
      const analyzedMazeCell: IAnalyzedMazeCell = {
        isPath: cellIsPath(currentCellData),
        isEnd: currentCellData === 'e',
        isStart: currentCellData === 's',
        isJunction: false
      }
      analyzedMaze[rowIdx].push(analyzedMazeCell)
    }
  }

  //
  let leftJunctionUnconnected: GraphNode | null = null
  let topJunctions: (GraphNode | null)[] = (new Array(maze.length)).fill(null)

  for (let rowIdx = 0; rowIdx < maze.length; rowIdx++) {
    // Forget the (horizontal) left unconnected junction at the start of each row
    leftJunctionUnconnected = null
    
    for (let colIdx = 0; colIdx < maze.length; colIdx++) {
      const currentCell = analyzedMaze[rowIdx][colIdx]
      
      const canGoUp = (rowIdx > 0) ? analyzedMaze[rowIdx - 1][colIdx].isPath : false
      const canGoRight = (colIdx + 1 < maze.length) ? analyzedMaze[rowIdx][colIdx + 1].isPath : ''
      const canGoDown = (rowIdx + 1 < maze.length) ? analyzedMaze[rowIdx + 1][colIdx].isPath : ''
      const canGoleft = (colIdx > 0) ? analyzedMaze[rowIdx][colIdx - 1].isPath : ''

      if (!currentCell.isPath) {
        leftJunctionUnconnected = null
        topJunctions[colIdx] = null
        continue
      }

      const isAJunction = (
        currentCell.isStart ||
        currentCell.isEnd ||
        (canGoUp && canGoleft) ||
        (canGoUp && canGoRight) ||
        (canGoDown && canGoleft) ||
        (canGoDown && canGoRight)
      )

      if (isAJunction) {
        analyzedMaze[rowIdx][colIdx].isJunction = true
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

  // 
  graph.setRootNode(rootCellIndex.rowIdx, rootCellIndex.colIdx)
  graph.setEndNode(endCellIndex.rowIdx, endCellIndex.colIdx)

  return graph
}