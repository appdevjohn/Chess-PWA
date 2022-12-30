import useGame from './hooks/useGame';
import Game from './components/Game';
import ResetBubbleArea from './components/ResetBubbleArea';
import Drawer from './components/Drawer';
import Toolbar from './components/Toolbar';

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
        resetGameHandler,
        undoMoveHandler,
        suggestMoveHandler,
        showPreviousMoveHandler,
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
                isPieceMovableHandler={isPieceMovableHandler} />
            <ResetBubbleArea onBubblePopped={resetGameHandler} />
            <Drawer backgroundColor='white' borderRadius='12px'>
                <Toolbar
                    resetGameHandler={resetGameHandler}
                    undoMoveHandler={undoMoveHandler}
                    suggestMoveHandler={suggestMoveHandler}
                    showPreviousMoveHandler={showPreviousMoveHandler} />
            </Drawer>
        </div>
    );
}

export default App;
