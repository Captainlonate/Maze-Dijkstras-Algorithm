import { GraphNodeLink } from './GraphNodeLink'
import { GraphNode } from './GraphNode'

// ========================Types====================

type TGraphNodeLookupTable = {
  [key: string]: GraphNode
}

// =================================================

/**
 * A Graph Data structure that relies on GraphNodes to have
 * GraphNodeLinks to other GraphNodes.
 */
export class Graph {
  _nodesObj: TGraphNodeLookupTable;
  rootNode: GraphNode | null;
  endNode: GraphNode | null;

  constructor () {
    this._nodesObj = {}
    this.rootNode = null
    this.endNode = null
  }

  // ==================GETTERS & SETTERS================

  get nodesArr (): GraphNode[] {
    return Object.values(this._nodesObj)
  }
  
  get nodesObj (): TGraphNodeLookupTable {
    return this._nodesObj
  }

  // =======================METHODS=====================

  addNode (newNode: GraphNode) {
    this._nodesObj[newNode.id] = newNode
  }

  linkTwoNodes (nodeOne: GraphNode, nodeTwo: GraphNode, weight: number) {
    nodeOne.addLink(new GraphNodeLink(nodeTwo, weight))
    nodeTwo.addLink(new GraphNodeLink(nodeOne, weight))
  }

  setRootNode (rootRowIdx: number, rootColIdx: number) {
    const rootNode = this.getNodeByIdx(rootRowIdx, rootColIdx)
    if (rootNode) {
      this.rootNode = rootNode
    } else {
      console.error(`The graph did not have a matching (start) ${GraphNode.name} at the index [${rootRowIdx},${rootColIdx}]`)
    }
  }

  setEndNode (endRowIdx: number, endColIdx: number) {
    const endNode = this.getNodeByIdx(endRowIdx, endColIdx)
    if (endNode) {
      this.endNode = endNode
    } else {
      console.error(`The graph did not have a matching (end) ${GraphNode.name} at the index [${endRowIdx},${endColIdx}]`)
    }
  }

  getNodeByIdx (rowIdx: number, colIdx: number): GraphNode {
    return this._nodesObj[GraphNode.makeNodeId(rowIdx, colIdx)]
  }

  getNodeById (nodeId: string): GraphNode {
    return this._nodesObj[nodeId]
  }

  debug () {
    console.table(this._nodesObj)
  }
}