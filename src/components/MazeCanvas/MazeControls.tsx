import React from 'react'
import { useMazeContext, EMazeActionTypes } from './MazeControlContext'
import './mazeControls.css'

// =================================================

export const MazeControls = () => {
  const [mazeState, updateMazeState] = useMazeContext()

  const onCheck = (actionType: EMazeActionTypes) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMazeState({ type: actionType, payload: e.target.checked })
  }

  return (
    <div className='mazecontrols__container'>
      <div className='mazecontrols__fieldgroup'>
        <input id='render_maze' type='checkbox' onChange={onCheck(EMazeActionTypes.SET_RENDER_MAZE)} checked={mazeState.render_maze} />
        <label htmlFor='render_maze'>Render Maze</label>
      </div>
      <div className='mazecontrols__fieldgroup'>
        <input id='render_junctions' type='checkbox' onChange={onCheck(EMazeActionTypes.SET_RENDER_JUNCTIONS)} checked={mazeState.render_junctions} />
        <label htmlFor='render_junctions'>Render Junctions</label>
      </div>
      <div className='mazecontrols__fieldgroup'>
        <input id='render_solution' type='checkbox' onChange={onCheck(EMazeActionTypes.SET_RENDER_SOLUTION)} checked={mazeState.render_solution} />
        <label htmlFor='render_solution'>Render Solution</label>
      </div>
    </div>
  )
}