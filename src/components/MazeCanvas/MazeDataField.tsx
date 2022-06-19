import React, { useState } from 'react'
import { useMazeContext, EMazeActionTypes } from './MazeControlContext'
import './mazeDataField.css'
import { TMazeData, TCell, CellType } from '../../classes/types'

// ======================Helpers========================

const validateGrid = (grid: string[][]) => {
  let numOfStart = 0
  let numOfEnd = 0

  let tmpCell: string | null = null
  for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
    for (let colIdx = 0; colIdx < grid[rowIdx].length; colIdx++) {
      tmpCell = grid[rowIdx][colIdx]
      if (tmpCell === 's') {
        numOfStart++
      } else if (tmpCell === 'e') {
        numOfEnd++
      } else if (tmpCell !== 'p' && tmpCell !== 'w') {
        // No cell types other than ['s', 'p', 'w', 'e'] (no empty cells either)
        throw new Error(`Cell at ${rowIdx},${colIdx} ("${tmpCell}") must be one of: "s", "e", "p", "w".`)
      }
    }
  }
  // Exactly one 's'
  if (numOfStart !== 1) {
    throw new Error(`Maze must have exactly 1 start cell ("s") but had ${numOfStart} instead.`)
  } 
  // Exactly one 'e'
  if (numOfEnd !== 1) {
    throw new Error(`Maze must have exactly 1 end cell ("e") but had ${numOfEnd} instead.`)
  } 
  // Same number of rows as columns
  const wrongDimensions = grid.some((row) => row.length !== grid.length)
  if (wrongDimensions) {
    throw new Error('Maze must be a square (same # of rows as # of columns per row).')
  }
}

const formatArrayPretty = (grid: string[][]): string => {
  let str = '['
  for (const row of grid) {
    str += '\n  [ "' + row.join('", "') + '" ],'
  }
  str = str.slice(0, -1)
  str += '\n]'
  return str
}

const getInitialMaze = (mazeData: string[][]): string => {
  try {
    const pretty = formatArrayPretty(mazeData)
    return pretty
  } catch (error) {
    const fallbackExample = [
      ["w", "s", "w"],
      ["w", "p", "w"],
      ["w", "e", "w"]
    ]
    return formatArrayPretty(fallbackExample)
  }
}

const createMazeData = (grid: CellType[][]): TMazeData => {
  const startCell = { rowIdx: 0, colIdx: 0 } as TCell
  const endCell = { rowIdx: 0, colIdx: 0 } as TCell

  for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
    for (let colIdx = 0; colIdx < grid[rowIdx].length; colIdx++) {
      if (grid[rowIdx][colIdx] === 's') {
        startCell.rowIdx = rowIdx
        startCell.colIdx = colIdx
      } else if (grid[rowIdx][colIdx] === 'e') {
        endCell.rowIdx = rowIdx
        endCell.colIdx = colIdx
      }
    }
  }

  return { maze: grid, startCell, endCell }
}

// =====================================================

const MazeDataField = () => {
  const [mazeState, updateMazeState] = useMazeContext()
  const [textAreaText, setDataStr] = useState<string>(() => getInitialMaze(mazeState.defaultMazeData.maze))
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onFormatOrSubmit = (submitOnSuccess: boolean) => () => {
    try {
      // The user might use single quotes, but JSON.parse() needs double quotes
      const fixedQuotes = textAreaText.replaceAll("'", '"')
      // string[][] because we haven't checked if it has only valid cell string types
      const parsed = JSON.parse(fixedQuotes) as string[][]
      // Ensure it only has valid "CellType" strings.
      // This will throw an error if it's invalid
      validateGrid(parsed)
      const prettyStr = formatArrayPretty(parsed)
      // Since there were no issues with the user-input, remove any error messages
      setErrorMessage('')
      // And update the user-input with the pretty-formatted version
      setDataStr(prettyStr)
      // If (in addition to formatting the grid string), we're also supposed to
      // update the context with this new Maze data (for use by the canvas)...
      if (submitOnSuccess) {
        updateMazeState({
          type: EMazeActionTypes.SET_MAZE_DATA,
          // We relied on validateGrid() to ensure that parsed only contains valid cell types
          payload: createMazeData(parsed as CellType[][])
        })
      }
    } catch (error) {
      let errorMessage = (error instanceof Error) ? error?.message : "Something went wrong"
      setErrorMessage(errorMessage)
    }
  }

  const onResetTextArea = () => {
    setErrorMessage('')
    setDataStr(getInitialMaze(mazeState.defaultMazeData.maze))
  }

  return (
    <div className='mazedatafield'>
      <div className='mazedatafield__legend'>
        <code className='mazedatafield__legendkey'><strong>"s"</strong> = Start (1)</code>
        <code className='mazedatafield__legendkey'><strong>"e"</strong> = End (1)</code>
        <code className='mazedatafield__legendkey'><strong>"w"</strong> = Wall</code>
        <code className='mazedatafield__legendkey'><strong>"p"</strong> = Path</code>
      </div>
      <div className='mazedatafield__textarea__container'>
        <textarea
          className={`mazedatafield__textarea${errorMessage ? ' mazedatafield__textarea--error' : ''}`}
          onChange={(e) => setDataStr(e.target.value)}
          value={textAreaText} />
      </div>
      <div className='mazedatafield__errormessage'>
        {errorMessage}
      </div>
      <div className='mazedatafield__buttons'>
        <button className='mazedatafield__button' onClick={onFormatOrSubmit(true)}>Render Maze</button>
        <button className='mazedatafield__button' onClick={onFormatOrSubmit(false)}>Format</button>
        <button className='mazedatafield__button' onClick={onResetTextArea}>Reset</button>
      </div>
    </div>
  )
}

export default MazeDataField