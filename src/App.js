import useGame from './hooks/useGame';
import Game from './components/Game';
import ResetBubbleArea from './components/ResetBubbleArea';
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
        opponentCheck,
        playerCheck,
        opponentCheckmate,
        playerCheckmate,
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
                opponentCheck={opponentCheck}
                playerCheck={playerCheck}
                opponentCheckmate={opponentCheckmate}
                playerCheckmate={playerCheckmate}
                resetGameHandler={resetGameHandler}
                pieceDroppedHandler={pieceDroppedHandler}
                squareTappedHandler={squareTappedHandler}
                isPieceMovableHandler={isPieceMovableHandler} />
            <ResetBubbleArea onBubblePopped={resetGameHandler} />
            <Toolbar resetGameHandler={resetGameHandler} />
        </div>
    );
}

export default App;
