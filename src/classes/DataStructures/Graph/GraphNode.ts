import { GraphNodeLink } from './GraphNodeLink'

/*
  This version of the GraphNode expects to represent
  a maze cell (junction), so it will have a rowIdx and colIdx
  within that 2d array.

  So, this Graph Node is specialized for this task, rather
  than being a general purpose one.

  I also gave it a public 'id' field, so user-code can keep track
  of it while traversing the graph (to which this node would belong).
  The id is a string representation of the 2d array index.
*/
export class GraphNode {
  data: any;
  rowIdx: number;
  colIdx: number;
  id: string;
  _links: GraphNodeLink[];

  constructor (data: any, rowIdx: number, colIdx: number) {
    this.data = data
    this.rowIdx = rowIdx
    this.colIdx = colIdx
    this.id = GraphNode.makeNodeId(rowIdx, colIdx)
    this._links = []
  }

  // ==================GETTERS & SETTERS================

  get links (): GraphNodeLink[] {
    return this._links.slice()
  }

  // =======================STATIC======================

  static makeNodeId (rowIdx: number, colIdx: number) {
    return `${rowIdx}:${colIdx}`
  }

  // =======================METHODS=====================

  addLink (nodeLink: GraphNodeLink) {
    this._links.push(nodeLink)
  }

}