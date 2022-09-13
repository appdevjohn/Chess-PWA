import useGame from './hooks/useGame';
import Game from './components/Game';
import Toolbar from './components/Toolbar';


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
        <div style={{ position: 'relative' }}>
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
            <Toolbar resetGameHandler={resetGameHandler} />
        </div>
    );
}

export default App;
