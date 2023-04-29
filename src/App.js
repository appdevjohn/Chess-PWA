import { useState } from 'react'
import useGame from './hooks/useGame'
import Game from './components/Game'
import ResetBubbleArea from './components/ResetBubbleArea'
import Drawer from './components/Drawer'
import Toolbar from './components/Toolbar'
import Slider from './components/Slider'
import ColorPicker from './components/ColorPicker'
import levelDescriptions from './util/levelDescriptions'

function App() {
  const {
    game,
    oldGameState,
    isResettingBoard,
    previewGameState,
    playerColor,
    playerColorFull,
    focusedSquare,
    focusedSquareLegalMoves,
    opponentCheck,
    playerCheck,
    opponentCheckmate,
    playerCheckmate,
    opponentStalemate,
    playerStalemate,
    isDrawGame,
    skillLevel,
    resetGameHandler,
    undoMoveHandler,
    suggestMoveHandler,
    showPreviousMoveHandler,
    pieceDroppedHandler,
    squareTappedHandler,
    isPieceMovableHandler,
    setSkillLevel,
    setPlayerColor,
  } = useGame()

  const [drawerMode, setDrawerMode] = useState()

  return (
    <div className='relative'>
      <Game
        game={game}
        oldGameState={oldGameState}
        isResettingBoard={isResettingBoard}
        previewGameState={previewGameState}
        playerColor={playerColor}
        playerColorFull={playerColorFull}
        focusedSquare={focusedSquare}
        focusedSquareLegalMoves={focusedSquareLegalMoves}
        opponentCheck={opponentCheck}
        playerCheck={playerCheck}
        opponentCheckmate={opponentCheckmate}
        playerCheckmate={playerCheckmate}
        opponentStalemate={opponentStalemate}
        playerStalemate={playerStalemate}
        isDrawGame={isDrawGame}
        resetGameHandler={resetGameHandler}
        pieceDroppedHandler={pieceDroppedHandler}
        squareTappedHandler={squareTappedHandler}
        isPieceMovableHandler={isPieceMovableHandler}
      />
      <ResetBubbleArea onBubblePopped={resetGameHandler} />
      <Drawer
        backgroundColor='white'
        borderRadius='12px'
        drawerMode={drawerMode}
        setDrawerMode={setDrawerMode}
        difficultyView={
          <Slider
            value={skillLevel}
            onChange={setSkillLevel}
            labelText={`Level ${Math.round(skillLevel * 20)}: ${
              levelDescriptions[Math.round(skillLevel * 10)]
            }`}
          />
        }
        colorView={
          <ColorPicker color={playerColor} setColor={setPlayerColor} />
        }
      >
        <Toolbar
          resetGameHandler={resetGameHandler}
          undoMoveHandler={undoMoveHandler}
          suggestMoveHandler={suggestMoveHandler}
          showPreviousMoveHandler={showPreviousMoveHandler}
        />
        <button onClick={() => setDrawerMode('difficulty')}>
          Change Difficulty
        </button>
        <button onClick={() => setDrawerMode('color')}>Change Color</button>
        <Slider
          value={skillLevel}
          onChange={setSkillLevel}
          labelText={`Level ${Math.round(skillLevel * 20)}: ${
            levelDescriptions[Math.round(skillLevel * 10)]
          }`}
        />
      </Drawer>
    </div>
  )
}

export default App
