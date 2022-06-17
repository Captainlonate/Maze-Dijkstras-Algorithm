import { useEffect, useRef } from 'react'
import './mazeCanvas.css'
import Maze from '../../classes/Maze'
import TestMaze from './testMaze.json'
import { useMazeContext } from './MazeControlContext'

const MazeCanvas = () => {
  const [mazeState] = useMazeContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mazeRef = useRef<Maze | null>(null)

  useEffect(() => {
    // Only ever create the maze instance once (other useEffects can update it though)
    if (containerRef.current && canvasRef.current && !mazeRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        mazeRef.current = new Maze(
          containerRef.current,
          canvasRef.current,
          ctx,
          JSON.parse(JSON.stringify(TestMaze))
        )
        // Set what should be initially rendered
        mazeRef.current.updateWhatIsRendered(
          mazeState.render_maze,
          mazeState.render_junctions,
          mazeState.render_solution
        )
      }
    }

    if (mazeRef.current) {
      mazeRef.current.bindListeners()
    }

    return () => {
      mazeRef.current?.unBindListeners()
    }
    // I don't want to bind/unbind the listeners every time the mazeState changes
    // This useEffect() is only the one-time, initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mazeRef.current) {
      mazeRef.current.updateWhatIsRendered(
        mazeState.render_maze,
        mazeState.render_junctions,
        mazeState.render_solution
      )
    }
  }, [mazeState.render_maze, mazeState.render_junctions, mazeState.render_solution])

  useEffect(() => {
    if (mazeRef.current) {
      mazeRef.current.updateMazeData(mazeState.activeMazeData)
    }
  }, [mazeState.activeMazeData])

  return (
    <div className="canvas__container" ref={containerRef}>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </div>
  )
}

export default MazeCanvas