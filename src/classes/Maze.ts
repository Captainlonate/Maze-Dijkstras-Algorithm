import { isNonEmptyArray } from '../utils'
import { Graph, GraphNode } from './DataStructures/Graph'
import { TCell, TMazeData } from './types'
import {
  makeGraphFromMaze,
  solveMazeGraphDijkstras
} from './solveMaze'

// ================================================

// To draw the line segments between junction nodes, we
// need to store the start (from) and endpoints of the line
type TJunctionLineSegment = {
  from: TCell;
  to: TCell;
}

type MazeFlags = {
  renderMaze: boolean;
  renderJunctions: boolean;
  renderSolution: boolean;
}

// ================================================

// The colors that the UI will use when rendering the maze
const COLORS: { [key: string]: string } = {
  // Maze's starting cell
  's': '#8cf68c',
  // Maze's end cell
  'e': '#ff7f50',
  // Maze's Path cell
  'p': '#eeeeee',
  // Maze's Wall cell
  'w': '#008080',
  'highlighted_fill': '#c788f8',
  'highlighted_stroke': '#c788f8',
  'solution_stroke': '#f0f33b',
  'cell_index_text': '#333333'
}

// ================================================

class Maze {
  private containerEl: HTMLDivElement
  private canvasEl: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private canvasDimensions: number // Pixels
  private mazeArray: string[][]
  private rootCellIndex: TCell
  private endCellIndex: TCell
  private graph: Graph | null
  //
  private flags: MazeFlags
  // Used for rendering things onto the canvas (the UI)
  private junctionNodesUI: TCell[]
  private pathFromStartToEndUI: TCell[]
  private junctionLinksUI: TJunctionLineSegment[]
  private cellWidth: number

  constructor (
    container: HTMLDivElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    mazeData: TMazeData
  ) {
    this.containerEl = container
    this.canvasEl = canvas
    this.ctx = ctx
    this.canvasDimensions = 100
    this.mazeArray = mazeData.maze
    this.rootCellIndex = mazeData.startCell
    this.endCellIndex = mazeData.endCell
    this.junctionNodesUI = []
    this.junctionLinksUI = []
    this.pathFromStartToEndUI = []
    this.graph = null
    //
    this.flags = {
      renderMaze: true,
      renderJunctions: true,
      renderSolution: true,
    }

    //
    this.cellWidth = 0
    this.onWindowResize()

    // Run
    this.parseMazeIntoGraph()
    this.solveMaze()
  }

  bindListeners () {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  }

  unBindListeners () {
    window.removeEventListener('resize', this.onWindowResize)
  }

  onWindowResize = () => {
    const containerRect = this.containerEl.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // Find the dimensions of the square maze / canvas
    let newCanvasSquareDimensions: number = containerWidth
    if (containerWidth > containerHeight) {
      newCanvasSquareDimensions = containerHeight
    }
    this.canvasDimensions = Math.floor(newCanvasSquareDimensions)

    // Resize the canvas element
    this.canvasEl.width = this.canvasDimensions * window.devicePixelRatio
    this.canvasEl.height = this.canvasDimensions * window.devicePixelRatio
    this.canvasEl.style.width = this.canvasDimensions + 'px'
    this.canvasEl.style.height = this.canvasDimensions + 'px'
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // How wide and tall (square) is each maze cell
    this.cellWidth = isNonEmptyArray(this.mazeArray)
      ? Math.floor(this.canvasDimensions / this.mazeArray.length)
      : 0

    this.drawCanvas()
  }

  clearCanvas () {
    // Clear the entire canvas (transparent black)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    // Fill the canvas with a solid color
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  drawCanvas () {
    this.clearCanvas()

    this.flags.renderMaze && this.drawMaze()
    this.flags.renderJunctions && this.drawJunctions()
    this.flags.renderSolution && this.drawSolution()
  }

  drawMaze () {
    this.ctx.globalAlpha = 1.0
    for (let rowIdx = 0; rowIdx < this.mazeArray.length; rowIdx++) {
      for (let colIdx = 0; colIdx < this.mazeArray.length; colIdx++) {
        const cellColor = this.mazeArray[rowIdx][colIdx]
        this.ctx.fillStyle = COLORS[cellColor] ?? '#111111'
        this.ctx.fillRect(
          colIdx * this.cellWidth,
          rowIdx * this.cellWidth,
          this.cellWidth,
          this.cellWidth
        )
      }
    }
  }

  drawJunctions () {
    // The circle markers that go on each junction
    if (isNonEmptyArray(this.junctionNodesUI)) {
      this.ctx.lineWidth = 1
      this.ctx.globalAlpha = 0.8
      this.ctx.beginPath()
      this.ctx.textAlign = 'left'
      for (const { rowIdx, colIdx } of this.junctionNodesUI) {
        this.ctx.moveTo(
          (colIdx * this.cellWidth) + (0.5 * this.cellWidth),
          (rowIdx * this.cellWidth) + (0.5 * this.cellWidth),
        )
        this.ctx.arc(
          (colIdx * this.cellWidth) + (0.5 * this.cellWidth), // center x
          (rowIdx * this.cellWidth) + (0.5 * this.cellWidth), // center y
          (0.3 * this.cellWidth), // radius
          0, // start angle,
          2 * Math.PI // end angle
        )
        // Write the text of the index of the cell ("4,3")
        this.ctx.strokeStyle = COLORS.cell_index_text
        this.ctx.strokeText(
          `${rowIdx},${colIdx}`,
          (colIdx * this.cellWidth) + (0.1 * this.cellWidth),
          (rowIdx * this.cellWidth) + (0.2 * this.cellWidth),
        )
      }
      this.ctx.fillStyle = COLORS.highlighted_fill
      this.ctx.fill()
    }

    // The lines that connect the circle junction markers
    this.ctx.globalAlpha = 0.4
    if (isNonEmptyArray(this.junctionLinksUI)) {
      const offsetStart = this.cellWidth * .8
      const offsetEnd = this.cellWidth * .2
      const halfCell = this.cellWidth * .5
      this.ctx.beginPath()
      this.ctx.strokeStyle = COLORS.highlighted_stroke
      this.ctx.lineWidth = 3
      this.ctx.lineCap = 'round'
      for (const junctionLink of this.junctionLinksUI) {
        if (junctionLink.from.colIdx === junctionLink.to.colIdx) {
          // If it's a vertical line
          this.ctx.moveTo(
            junctionLink.from.colIdx * this.cellWidth + halfCell,
            junctionLink.from.rowIdx * this.cellWidth + offsetStart,
          )
          this.ctx.lineTo(
            junctionLink.to.colIdx * this.cellWidth + halfCell,
            junctionLink.to.rowIdx * this.cellWidth + offsetEnd,
          )
        } else {
          // If it's a horizontal line
          this.ctx.moveTo(
            junctionLink.from.colIdx * this.cellWidth + offsetStart,
            junctionLink.from.rowIdx * this.cellWidth + halfCell,
          )
          this.ctx.lineTo(
            junctionLink.to.colIdx * this.cellWidth + offsetEnd,
            junctionLink.to.rowIdx * this.cellWidth + halfCell,
          )
        }
      }
      this.ctx.stroke()
    }
  }

  drawSolution () {
    this.ctx.globalAlpha = 0.9
    if (isNonEmptyArray(this.pathFromStartToEndUI)) {
      const halfCell = this.cellWidth * .5
      this.ctx.beginPath()
      this.ctx.strokeStyle = COLORS.solution_stroke
      this.ctx.lineWidth = 8
      this.ctx.lineCap = 'round'
      for (const pathSegment of this.pathFromStartToEndUI) {
        this.ctx.lineTo(
          pathSegment.colIdx * this.cellWidth + halfCell,
          pathSegment.rowIdx * this.cellWidth + halfCell
        )
      }
      this.ctx.stroke()
    }
  }

  updateWhatIsRendered (renderMaze: boolean, renderJunctions: boolean, renderSolution: boolean) {
    this.flags.renderMaze = renderMaze
    this.flags.renderJunctions = renderJunctions
    this.flags.renderSolution = renderSolution
    this.drawCanvas()
  }

  updateMazeData (newMazeData: TMazeData) {
    try {
      const clonedMazeData = JSON.parse(JSON.stringify(newMazeData))
      this.mazeArray = clonedMazeData.maze
      this.rootCellIndex = clonedMazeData.startCell
      this.endCellIndex = clonedMazeData.endCell
      this.parseMazeIntoGraph()
      this.solveMaze()
    } catch (error) {
      console.log('Could not update (JSON.parse) new maze data!', newMazeData)
    }
    this.drawCanvas()
  }

  solveMaze () {
    this.getJunctions()
    if (this.graph) {
      // const pathFromStartToEnd: GraphNode[] = solveMazeGraphBreadthFirst(this.graph, this.mazeArray)
      const pathFromStartToEnd: GraphNode[] = solveMazeGraphDijkstras(this.graph, this.mazeArray)
      this.pathFromStartToEndUI = pathFromStartToEnd.map((node) => ({
        rowIdx: node.rowIdx, colIdx: node.colIdx
      } as TCell))
    }
    this.drawCanvas()
  }

  parseMazeIntoGraph () {
    // This will convert the maze to a weighted Graph data structure where
    // all nodes have bi-directional edges
    this.graph = makeGraphFromMaze(this.mazeArray, this.rootCellIndex, this.endCellIndex)
  }

  getJunctions () {
    if (!this.graph) {
      return
    }
    // The markers drawn for each junction node
    // this.junctionNodesUI = this.graph.nodesArr.map((node) => ([node.rowIdx, node.colIdx]))
    this.junctionNodesUI = this.graph.nodesArr.map((node) => ({
      rowIdx: node.rowIdx, colIdx: node.colIdx
    } as TCell))
    // The lines drawn between Junction Nodes.
    // All nodes in the graph (which I call junctions in the maze) are
    // two-way. ( NodeA <---> NodeB ).
    // There's no need to draw each link line twice, so here I deduplicate
    // the lines by only drawing from top to bottom, or left to right.
    this.junctionLinksUI = (
      this.graph.nodesArr
        .map((node) => (
          // "from" each node in the graph, "to" each node it has a link to
          node.links.map((link) => ({
            from: { rowIdx: node.rowIdx, colIdx: node.colIdx },
            to: { rowIdx: link.node.rowIdx, colIdx: link.node.colIdx },
          }))
        ))
        .flat()
        .filter(({ from, to }) => (
          // If line goes top to bottom, or left to right
          (from.rowIdx <= to.rowIdx) && (from.colIdx <= to.colIdx)
        ))
    )
  }
}

export default Maze