import { GraphNodeLink } from './GraphNodeLink'

/*

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