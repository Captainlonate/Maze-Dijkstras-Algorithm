import React, { createContext, useContext, useReducer } from 'react'

// ========================Types=======================

// Reducer Action Types
export enum EMazeActionTypes {
  SET_RENDER_MAZE = 'SET_RENDER_MAZE',
  SET_RENDER_JUNCTIONS = 'SET_RENDER_JUNCTIONS',
  SET_RENDER_SOLUTION = 'SET_RENDER_SOLUTION',
}

// Reducer State
type TMazeReducerState = {
  render_maze: boolean;
  render_junctions: boolean;
  render_solution: boolean;
}

// Reducer Actions + Payload types
type TMazeReducerAction =
 | { type: EMazeActionTypes.SET_RENDER_MAZE, payload: boolean }
 | { type: EMazeActionTypes.SET_RENDER_JUNCTIONS, payload: boolean }
 | { type: EMazeActionTypes.SET_RENDER_SOLUTION, payload: boolean };

type InitialContextState = {

}

// ====================================================

// The initial state of the Reducer
const initialMazeState: TMazeReducerState = {
  render_maze: true,
  render_junctions: true,
  render_solution: true,
}

// ====================================================

const mazeControlsReducer = (state: TMazeReducerState, action: TMazeReducerAction): TMazeReducerState => {
  switch (action.type) {
    case EMazeActionTypes.SET_RENDER_MAZE:
      return {
        ...state,
        render_maze: action.payload
      }
    case EMazeActionTypes.SET_RENDER_JUNCTIONS:
      return {
        ...state,
        render_junctions: action.payload
      }
    case EMazeActionTypes.SET_RENDER_SOLUTION:
      return {
        ...state,
        render_solution: action.payload
      }
    default:
      return state
  }
}

// ====================================================

// const MazeControlContext = createContext<{
//   state: TMazeReducerState;
//   dispatch: React.Dispatch<any>;
// }>([
const MazeControlContext = createContext<([
  TMazeReducerState,
  React.Dispatch<TMazeReducerAction>
])>([
  Object.assign({}, initialMazeState),
  () => null
])
// }>({
//   state: Object.assign({}, initialMazeState),
//   dispatch: () => null
// })

// Example: const [mazeState, setMazeState] = useMazeContext()
export const useMazeContext = () => useContext(MazeControlContext)

interface MazeProviderProps {
  children: React.ReactNode;
}

export const MazeProvider: React.FC<MazeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mazeControlsReducer, initialMazeState)
  return (
    <MazeControlContext.Provider value={[state, dispatch]}>
      {children}
    </MazeControlContext.Provider>
  )
}
