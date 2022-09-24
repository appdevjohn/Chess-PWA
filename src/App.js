import useGame from './hooks/useGame';
import Game from './components/Game';
// import Toolbar from './components/Toolbar';
import ResetBubble from './components/ResetBubble';


function App() {
    const {
        game,
        oldGameState,
        isResettingBoard,
        playerColor,
        playerColorFull,
        focusedSquare,
        focusedSquareLegalMoves,
        resetGameHandler,
        pieceDroppedHandler,
        squareTappedHandler,
        isPieceMovableHandler
    } = useGame();

    return (
        <div className='relative'>
            <Game
                game={game}
                oldGameState={oldGameState}
                isResettingBoard={isResettingBoard}
                playerColor={playerColor}
                playerColorFull={playerColorFull}
                focusedSquare={focusedSquare}
                focusedSquareLegalMoves={focusedSquareLegalMoves}
                resetGameHandler={resetGameHandler}
                pieceDroppedHandler={pieceDroppedHandler}
                squareTappedHandler={squareTappedHandler}
                isPieceMovableHandler={isPieceMovableHandler} />
            <div className='center-content'><ResetBubble onBubblePopped={resetGameHandler} /></div>
            {/* <Toolbar resetGameHandler={resetGameHandler} /> */}
        </div>
    );
}

export default App;
