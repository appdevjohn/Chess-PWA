import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

import './App.css';


function App() {
    // The board width in pixels, as required by react-chessboard.
    const [boardWidth, setBoardWidth] = useState(window.visualViewport.width);

    // The game state, in the chess.js format.
    const [game, setGame] = useState(new Chess());

    // To create the animation to a new game, we need to keep the old game state briefly.
    const [oldGameFEN, setOldGameFEN] = useState();

    // The player's color.
    const playerColor = useState(Math.random() > 0.5 ? 'w' : 'b')[0];
    const playerColorFull = playerColor === 'w' ? 'white' : 'black';

    // Manages the width of the board in pixels.
    useEffect(() => {
        const resizeBoard = () => {
            if (window.visualViewport.width < window.visualViewport.height) {
                setBoardWidth(window.visualViewport.width);
            } else {
                setBoardWidth(window.visualViewport.height);
            }
        }

        window.addEventListener('resize', resizeBoard);
        return () => window.removeEventListener('resize', resizeBoard)

    }, [])

    // Manages what happens after each the game state changes.
    useEffect(() => {
        if (oldGameFEN) { return }

        if (game.turn() !== playerColor) {
            // Call API to get best possible move.
            fetch('http://localhost:8000/suggest-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'board_position': game.fen()
                })
            }).then(response => {
                return response.json();
            }).then(result => {
                const bestMove = {
                    from: result['best_move'].substring(0, 2),
                    to: result['best_move'].substring(2, 4)
                }
                const gameCopy = { ...game };
                gameCopy.move(bestMove);
                setGame(gameCopy);

            }).catch(error => {
                console.error(error);
            });
        }

        setTimeout(() => {
            if (game.turn() === playerColor && game.in_checkmate()) {
                alert('Checkmate');
            } else if (game.turn() === playerColor && game.in_check()) {
                alert('Check');
            }
        }, 300)

    }, [game, playerColor, playerColorFull, oldGameFEN])

    // Ends the animation of a game reset.
    useEffect(() => {
        if (oldGameFEN) {
            setTimeout(() => {
                setOldGameFEN(undefined);
            }, 500)
        }
    }, [oldGameFEN])

    // Make a move. Returns true if the move is valid.
    const makeMove = move => {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result;
    }

    // Handles what happens when a piece is dropped on a square.
    const pieceDroppedHandler = (sourceSquare, targetSquare) => {
        const move = {
            from: sourceSquare,
            to: targetSquare
        }

        const validMove = makeMove(move);
        return validMove !== null;
    }

    // Handles what happens when a game reset is requested.
    const resetGameHandler = () => {
        setOldGameFEN(game.fen());
        const gameCopy = { ...game };
        gameCopy.reset();
        setGame(gameCopy);
    }

    // Chessboard array. If resetting a game, a board with the resigned game
    // will be added to the front of the array, and both boards will appear
    // briefly on the screen.
    const chessBoards = [
        <Chessboard
            id='chess-game-1'
            boardOrientation={playerColorFull}
            boardWidth={boardWidth}
            position={game.fen()}
            onPieceDrop={pieceDroppedHandler}
            snapToCursor={false}
            animationDuration={game.history().length === 0 ? 0 : 300}
            key='main'
        />
    ]
    if (oldGameFEN) {
        chessBoards.unshift(
            <Chessboard
                boardOrientation={playerColorFull}
                boardWidth={boardWidth}
                position={oldGameFEN}
                snapToCursor={false}
                animationDuration={0}
                key='animated'
            />
        )
    }

    return (
        <div className="App">
            <button style={{ position: 'absolute', zIndex: 2 }} onClick={resetGameHandler}>Reset</button>
            <div className={oldGameFEN ? 'chessboard-container tossed-game' : 'chessboard-container'}>{chessBoards}</div>
        </div>
    );
}

export default App;
