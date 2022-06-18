import { GraphNode } from './GraphNode'

/*
  In a weighted graph structure, each node could have
  edges/links to other nodes.
  It wouldn't be enough to simply store references to other nodes.
  This is because these edges can be "weighted", which is to say,
  NodeA might be.... "5 miles" from NodeB, so "5" would be the weight.
*/
export class GraphNodeLink {
  node: GraphNode;
  weight: number;

  constructor (node: GraphNode, weight: number) {
    this.node = node
    this.weight = weight
  }
}