import { GraphNode } from './GraphNode'

/*

*/
export class GraphNodeLink {
  node: GraphNode;
  weight: number;

  constructor (node: GraphNode, weight: number) {
    this.node = node
    this.weight = weight
  }
}