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
        resetGameHandler,
        pieceDroppedHandler
    } = useGame();

    return (
        <div style={{ position: 'relative' }}>
            <Game
                game={game}
                oldGameState={oldGameState}
                isResettingBoard={isResettingBoard}
                playerColor={playerColor}
                playerColorFull={playerColorFull}
                resetGameHandler={resetGameHandler}
                pieceDroppedHandler={pieceDroppedHandler} />
            <Toolbar resetGameHandler={resetGameHandler} />
        </div>
    );
}

export default App;
