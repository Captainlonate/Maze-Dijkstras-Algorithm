import { Graph, GraphNode } from '../DataStructures/Graph'
import { SortedLinkedList } from '../DataStructures/SortedLinkedList'
import { DijkstrasPathLookupTable } from '../DataStructures/DijkstrasPathLookupTable'

/*
  Given a graph, this function will find the shortest path to each node by
  using Dijkstra's Algorithm.

  Here I'm going to explain Dijkstra's algorithm, and the custom data structures
  I built for use by this function.

  I made use of several other Data structure's for this implementation. They
  definitely weren't necessary, but I think it helps the readability of the code,
  and was good practice either way. In these cases, I could have gotten away with
  a couple objects and arrays and some procedural-style code.

  Let me explain what I used these data structures for:
    SortedLinkedList{} (SortedLinkedListNode)
    DijkstrasLookupTable{}

  For this, I needed some sort of "Priority Queue". Somewhere I can queue up
  some nodes (from a graph) that still need to be visited by Dijkstra's Algorithm.
  Each time I add a new node to the queue, I need to re-sort that list, which happens
  on each iteration of the loop. On a big graph, that could mean sorting an array
  thousands or ten's of thousands of times.
  Option 1)
    I could have used an array, and used array.sort() for every iteration,
    but sort() is extreeeemly bad performance.
  Option 2)
    I could have used an array, and manually constructed a new array, by
    inserting/splicing the node-to-be-visited into a concatenation of arrays.
    Example: [...oldArray.slice(0, 3), newNode, ...oldArray.slice(3)]
    This is definitely better than sort(). Also, Array.unshift() is not performant
    as it pushes all the other elements down.
  Option 3)
    I chose this one. I used a singly linked list, where all the nodes in the
    list are sorted. So, I created the SortedLinkedList data structure for this.
  
  Next, Dijkstra'a Algorithm requires some way to store data about each node
  in the graph. We need something that can represent this type of data:
    Node    ShortestPath    PreviousNode
    ----    -------------   --------------
    A       0
    B       3               D
    C       Infinity
    D       1               A
    E       2               D
  Where, the shortest path to 'Node B' takes 3 units/weights, and can be
  mapped out by: A -> D -> B, by checking the PreviousNode of each node (work
    backwards from 'Node B' to the starting/root node).
  In this case, I could have just used an object like:
    { B: { distance: 3, prevNode: 'D' }, D: { distance: 1, prevNode: 'A' } }
  I created the DijkstrasPathLookupTable datastructure for obvious readability
  with the method calls, but also so I could build-in the backtracking code
  to build and return the path: 'A, D, B'.

  Here's my summary of Dijkstra's Algorithm:
  
  Dijkstra's Algorithm is a graph-traversal algorithm, that finds the shortest path
  to each node in the graph, from a given starting/root node.
  You start at the root node, and recognize it's distance to itself is 0.
  Then you analyze all of the connected nodes to it. You measure each of their distances
  and store them in the LookupTable.
  All of those connected nodes have not been visited yet, so you add them to a priority queue
  to keep track of which nodes need to be visited next. When you add them to the queue,
  you order them from smallest distance to greatest. Because of this, the "next" node
  to visit will always be the connected node which had the shortest CUMULATIVE path. So,
  when choosing the next node to analyze, you want the "closest / smallest distance" node.
  As you move through the other nodes, you'll notice that some of them are also connected
  to nodes that you've already measured the distance of. You'll re-measure the distance
  to these nodes, each time using the cumulative (summed) distance so far.

  So, initially the distance from 'A' to 'B' might be 7, and from 'A' to 'D' is only 2.
  Since 'A' to 'D' is shorter, you move to 'D' first.
  Then you discover that the distance from A -> D -> B is shorter than just A -> B.
  So, that new distance becomes the "shortest path" from A to B (by going through D).

     (7)
  A ----- B _
  |     /    \  E
  |  /      / 
  D ---- C

  Dijkstra's Algorithm does not stop when a path is found to the final node.
  It will consider EVERY node in the graph, and build a table of the shortest paths
  to all nodes, from the starting node.

  You can use this same table to work backward from the target node, back to the
  root node by checking the 'PreviousNode' column of the table.
*/
export const solveMazeGraphDijkstras = (graph: Graph): GraphNode[] => {
  // The algorithm starts at this node of the graph
  const startingNode = graph.rootNode
  // The algorithm does not care/know about the endingNode technically.
  // But here it's used to build the path from startingNode -> endingNode
  const endingNode = graph.endNode
  // Just a sanity check. Just in case the provided graph is bugged.
  if (!startingNode || !endingNode) {
    console.error('There was no start or end node located!')
    return []
  }
  // Create the Dijkstra's Lookup Table to store the shortest path to each node,
  // as well as which nodes contributed to that path.
  // First, populate the table with all the nodes from the graph.
  const table = new DijkstrasPathLookupTable()
  table.addNode(...graph.nodesArr.map((node) => node.id))
  // When we start traversing the graph using Dijkstra's Algorithm, we'll
  // want to know if we have already considered the links attached to each node.
  // This object will store true/false for each node { nodeId1: true,... }
  // This is a quick way to check if a node is visited yet, or not.
  let visitedNodes: { [key: string]: boolean } = (
    Object.keys(graph.nodesObj).reduce((cache, nodeId) => {
      cache[nodeId] = false
      return cache
    }, {} as { [key: string]: boolean })
  )
  // This is a priority queue which is sorted from shortest path -> longest path per node.
  // This is used so we know which node needs to be considered next.
  // After the graph traversal begins, the loop knows to stop looking when this queue is empty
  const unvisitedNodes = new SortedLinkedList<GraphNode>()
  // The first unvisited node, will be the starting node
  unvisitedNodes.addAndSort(startingNode, 0)
  // The distance of the starting node, back to itself is already known to be 0.
  table.setShortestPath(startingNode.id, 0)
  //
  // Keep track of how many iterations the loop does (how many cells are considered)
  // While not used for the algorithm, I keep track of it for performance, and as
  // a safety-sentinel value to break out of buggy infinite-while loops.
  let count = 0

  while (!unvisitedNodes.isEmpty) {
    // Safety check for bugs causing infinite while loops
    count++
    if (count >= 100000) {
      console.error('Warning: While loop is infinite. Broke out early.')
      break
    }
    // Get the next unvisited node from the priority queue, which will be
    // the one with the shortest summed distance (so far) from the starting node.
    let currentNode = unvisitedNodes.getNext()

    if (currentNode) {
      // Since we're about to consider the links to this node, meaning measure
      // the new distances and add them to the queue, this is the time to 
      // mark that this node has been visited (and the distance from this node
      // to it's linked nodes never needs measured again.)
      visitedNodes[currentNode.id] = true
      // Go through all the linked nodes for the current node (in the graph)
      // These nodeLink objects contain a reference to the node, but also the
      // weight (distance) between the two nodes.
      for (const nodeLink of currentNode.links) {
        // Then analyze the distance to these nodes from the start
        // and check to see if any of these are the shortest distances
        // so far. If so, update the table's distance and previous nodes.
        const totalDistanceToThisNode = table.getShortestPath(currentNode.id) + nodeLink.weight
        // If this connected Node has not been considered yet, queue it up to be
        // considered later.
        if (!visitedNodes[nodeLink.node.id]) {
          // Add each univisited node to the beginning of the priority queue
          unvisitedNodes.addAndSort(nodeLink.node, totalDistanceToThisNode)
        }
        // By measuring the distance to the current Node from the root node, and adding
        // it to the distance from the current node to the linked node, we can see
        // if this is shorter than the previously known distance to the linked node.
        if (totalDistanceToThisNode < table.getShortestPath(nodeLink.node.id)) {
          // This is the new shortest path to this node
          table.setShortestPath(nodeLink.node.id, totalDistanceToThisNode)
          table.setPreviousNode(nodeLink.node.id, currentNode.id)
        }
      }
    }
  }

  // Use the Dijkstra's Lookup Table to construct the path
  // by working backward from the end cell, to the start cell.
  // Store the 'previousNode' of each cell.
  const pathOfIds = table.getPathToCell(endingNode.id)
  const pathOfNodes = pathOfIds.map((nodeId) => graph.getNodeById(nodeId))

  return pathOfNodes
}