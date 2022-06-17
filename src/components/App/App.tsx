import MazeCanvas from '../MazeCanvas/MazeCanvas'
import MazeDataField from '../MazeCanvas/MazeDataField'
import { FixedImageLink } from '../FixedImageLink/FixedImageLink'
import { MazeControls } from '../MazeCanvas/MazeControls'
import { MazeProvider } from '../MazeCanvas/MazeControlContext'

import './app.css'

const App = () => (
  <div>
    {/* The octocat picture that links to my github */}
    <FixedImageLink url='https://github.com/Captainlonate/Maze-Dijkstras-Algorithm' />
    <section className='hero'>
      <h2 className='hero__titletext'>Maze with Dijkstra's Algorithm</h2>
      <p className='hero__bodyoftext'>
        Hi, I'm Nathan and I wanted to better understand how to use Dijkstra's Algorithm to solve a maze.
      </p>
    </section>
    <MazeProvider>
      <MazeControls />
      <section className='maze_container'>
        <MazeCanvas />
      </section>
      <MazeDataField />
    </MazeProvider>
    <section className='description__section'>
      <h3 className='description__title'>What is happening?</h3>
      <p className='description__paragraph'>
        The first thing I do, is I scan every cell of the maze, one time, and locate the cells which can be thought of as "decision points". These are junction cells with 3 or 4 possible routes. I store these junction cells (their row and column indices), as well as the start and end cells. If any two junction cells can be connected by a straight line of path cells (with no walls in between), then those junction cells each have a link to each other. Effectively, this creates a graph structure (which you can visualize by toggling off rendering of the maze above).
      </p>
      <p className='description__paragraph'>
        Now that I've created a graph structure, when it comes time to find the best path from start to finish, I no longer need to re-consider (potentially multiple times) EVERY cell of the maze. Also, by creating a link between nodes which is always a straight line of path cells, I can count them up, and store that number as the distance between them. This is why the graph is a "weighted graph". If NodeA and NodeB have 2 path nodes between them, they will each have a Link between them, with a weight of 2.
      </p>
      <p className='description__paragraph'>
        Dijkstra's Shortest Path Algorithm is intended to operate on a weighted graph structure (like the one I built above). The algorithm is too difficult to explain with only words, so I'd recommend just watching <a href="https://www.youtube.com/watch?v=pVfj6mxhdMw" target='_blank' rel="noreferrer">THIS</a> 11-minute youtube video.
      </p>
      <p className='description__paragraph'>
        At this point I'll assume you watched that video. After building out the weighted graph, I still needed two more data structures. First, I needed some sort of Lookup Table (like the one used in the video), where I can store the shortest distance to each node, as well as the previous node that led to it. For this I built <a href="https://github.com/Captainlonate/Maze-Dijkstras-Algorithm/blob/main/src/classes/DataStructures/DijkstrasPathLookupTable.ts" target='_blank' rel="noreferrer"><code>DijkstrasPathLookupTable.ts</code></a>, but a simple nested object would have been fine too. It essentially represents this data:
      </p>
      <div>
        <table className='simpletable'>
          <thead>
            <tr>
              <th>Node (key)</th>
              <th>shortestPath</th>
              <th>previousNode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>(4,4)</td>
              <td>4</td>
              <td>(0,4)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className='description__paragraph'>
        And lastly, I needed some way to keep track of which graph node should be visited next. As I visited each node, and examined all of the connected nodes to it, I needed a way to make sure that the "next" node I visit is always the node that, so far, has the shortest possible path of all the unvisited nodes. In other words, I needed a list that is constantly (re)sorted every time I place a new element into it. I needed a Priority Queue. I implemented a sorted, singly-linked-list in <a href="https://github.com/Captainlonate/Maze-Dijkstras-Algorithm/blob/main/src/classes/DataStructures/SortedLinkedList.ts" target='_blank' rel="noreferrer"><code>SortedLinkedList.ts</code></a> (just the parts that I needed for this project).
      </p>
      <p className='description__paragraph'>
        Once the graph is analyzed and the Lookup Table is completely populated for every node in the graph, the only thing left to do is work backward from the end cell to the start cell, using the Lookup Table's <code>previousNode</code> fields.
      </p>
      <p className='description__paragraph'>
        Thanks for stopping by, and feel free to reach out to me via <a href="https://www.linkedin.com/in/nate-d-lough/" target="_blank" rel="noreferrer">LinkedIN</a>.
      </p>
    </section>
  </div>
)

export default App