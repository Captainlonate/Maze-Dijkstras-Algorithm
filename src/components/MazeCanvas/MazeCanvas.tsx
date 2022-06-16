import { useEffect, useRef } from 'react'
import './mazeCanvas.css'
import Maze from '../../classes/Maze'
import TestMaze from './testMaze.json'
import { useMazeContext } from './MazeControlContext'

const MazeCanvas = () => {
  const [mazeState, updateMazeState] = useMazeContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mazeRef = useRef<Maze | null>(null)

  useEffect(() => {
    if (containerRef.current && canvasRef.current && !mazeRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        mazeRef.current = new Maze(
          containerRef.current,
          canvasRef.current,
          ctx,
          JSON.parse(JSON.stringify(TestMaze))
        )
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

  return (
    <div className="canvas__container" ref={containerRef}>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </div>
  )
}

export default MazeCanvas