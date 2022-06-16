/*
  I used this explanation of Dijkstra's Algorithm:
    https://www.youtube.com/watch?v=pVfj6mxhdMw

  The following datastructure allows me to represent
  this type of lookup table.

  For each node in the graph, I can keep track of the
  shortest known path so far

    Node    ShortestPath    PrevVertex
    ----    -------------   --------------
    A       0
    B       3               D
    C       Infinity
    D       1               A
    E       2               D

*/
export class DijkstrasPathLookupTable {
  private _nodes: {
    [key: string]: {
      shortestPath: number,
      previousNode: string | null
    }
  }

  constructor () {
    this._nodes = {}
  }

  // ==================GETTERS & SETTERS================

  get nodes () {
    return Object.keys(this._nodes)
  }

  // =======================METHODS=====================

  addNode (...ids: string[]) {
    for (const id of ids) {
      this._nodes[id] = {
        shortestPath: Infinity,
        previousNode: null
      }
    }
  }

  getNode (id: string) {
    // Clones the object so that it can't be mutated outside this class
    return this._nodes[id] ? { ...this._nodes[id] } : null
  }

  setShortestPath (id: string, weight: number) {
    if (!this._nodes[id]) {
      this.addNode(id)
    }
    this._nodes[id].shortestPath = weight
  }

  getShortestPath (id: string) {
    if (!this._nodes[id]) {
      this.addNode(id)
    }
    return this._nodes[id].shortestPath
  }

  setPreviousNode (id: string, previousNodeId: string) {
    if (!this._nodes[id]) {
      this.addNode(id)
    }
    this._nodes[id].previousNode = previousNodeId
  }

  getPreviousNode (id: string) {
    if (!this._nodes[id]) {
      this.addNode(id)
    }
    return this._nodes[id].previousNode
  }

  getPathToCell (id: string): string[] {
    const pathFromStartToTargetCell: string[] = []
    let tmpNodeId: string | null = id
    while (tmpNodeId) {
      pathFromStartToTargetCell.push(tmpNodeId)
      tmpNodeId = this.getPreviousNode(tmpNodeId)
    }
    return pathFromStartToTargetCell.reverse()
  }

  debug () {
    // console.table(this._nodes)
    return this._nodes
  }
}