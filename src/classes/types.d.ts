/**
  * Represents a cell in the maze (which is a 2d array)
  * So each cell would have a row index, and column index
  */
export type TCell = {
  rowIdx: number;
  colIdx: number;
}

/**
 * The "input" given to the Maze class, which it will convert
 * into a Graph.
 * Each cell in the graph should be one of the cell types.
 * ('p', 'w', 's', 'e')
 */
export type TMazeData = {
  maze: CellType[][],
  startCell: TCell,
  endCell: TCell
}

export type TLineSegment = {
  from: TCell;
  to: TCell;
}

export type CellType = 
  | 'p'
  | 'w'
  | 'e'
  | 's';
