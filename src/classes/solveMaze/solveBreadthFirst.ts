import { Graph, GraphNode } from "../DataStructures/Graph"

/*
  Simple Breadth-First traversal of the graph (not considering weights at all)

  Makes no attempt at finding the shortest path
*/
export const solveMazeGraphBreadthFirst = (graph: Graph, maze: string[][]): GraphNode[] => {
  // Will contain the final solution
  const pathFromStartToEnd: GraphNode[] = []
  const startingNode = graph.rootNode
  const endNode = graph.endNode
  // Keep track of how many iterations the loop does (how many cells are considered)
  let count = 0
  // Newly discovered cells will be added to the beginning of this list
  // (That's what makes it breadth-first)
  const queue = [startingNode]
  // Prevents traversing cells twice
  const alreadyVisitedNodes: { [key: string]: boolean } = {}
  // For each junction cell visited, keep track of which other junction node
  // led to the node in question. By the end of this, we can start from the
  // end cell, and work backward to the start cell, to build the solution path
  // Ex: { 'node2': 'node1', 'node3': 'node2' } - Means node1 led to node2, which led to node3
  const reverseLookupNodeCache: { [key: string]: string } = {}

  if (!startingNode || !endNode) {
    console.error('There was no start or end node located!')
    return []
  }

  // Go ahead and mark the starting node as being visited
  alreadyVisitedNodes[startingNode.id] = true

  let currentNode: GraphNode | null | undefined = undefined
  let foundASolution = false
  while (queue.length > 0) {
    count++
    currentNode = queue.pop()

    // Infinite loops scare me
    if (count > 1000) {
      console.error('Safety check to prevent infinite loop.')
      break;
    }

    // This shouldn't be possible I don't think
    if (!currentNode) {
      console.error('CurrentNode was undefined for some reason!')
      break
    }

    // Since this algorithm doesn't check for shortest path, stop when a solution is found
    if (currentNode.id === endNode.id) {
      foundASolution = true
      break;
    }

    // Check all the links from the current node (top, right, down, left)
    for (const nodeLink of currentNode.links) {
      // If this connected node has not been visited yet, then add it
      // to be the next-considered node, and mark it as visited
      if (!alreadyVisitedNodes[nodeLink.node.id]) {
        alreadyVisitedNodes[nodeLink.node.id] = true
        queue.unshift(nodeLink.node)
        // Keep track that this current node is what led to the connected node
        // (the connected node will be the next node considered because this node
        // linked to it.)
        reverseLookupNodeCache[nodeLink.node.id] = currentNode.id
      }
    }

  }

  // It's time to work backward from the end cell, back to the starting cell.
  // The reverseLookupNodeCache will start at the end cell, and see which
  // cell led to the end cell, and so on and so on...
  // This will eventually lead back to the starting cell, if there is a solution
  if (foundASolution) {
    currentNode = endNode
    let safetyCounter = 0
    while (!!currentNode && safetyCounter < 100) {
      safetyCounter++
      pathFromStartToEnd.push(currentNode)
      currentNode = graph.getNodeById(reverseLookupNodeCache[currentNode.id])
    }
  }

  return pathFromStartToEnd.reverse()
}