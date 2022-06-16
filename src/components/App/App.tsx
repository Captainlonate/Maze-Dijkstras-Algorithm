import MazeCanvas from '../MazeCanvas/MazeCanvas'
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
    </MazeProvider>
    <section className='below_maze'>
      Below The Maze
    </section>
  </div>
)

export default App