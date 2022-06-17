/*
  Represents a cell in the maze (which is a 2d array)
  So each cell would have a row index, and column index
*/
export type TCell = {
  rowIdx: number;
  colIdx: number;
}

export type TMazeData = {
  maze: string[][],
  startCell: TCell,
  endCell: TCell
}