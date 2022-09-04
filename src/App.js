import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

import './App.css';


function App() {
    const [boardWidth, setBoardWidth] = useState(window.visualViewport.width);
    const [game, setGame] = useState(new Chess());
    const [isResettingGame, setIsResettingGame] = useState(false);
    const playerColor = useState(Math.random() > 0.5 ? 'w' : 'b')[0];

    const playerColorFull = playerColor === 'w' ? 'white' : 'black';

    window.addEventListener('resize', () => {
        if (window.visualViewport.width < window.visualViewport.height) {
            setBoardWidth(window.visualViewport.width);
        } else {
            setBoardWidth(window.visualViewport.height);
        }
    });

    useEffect(() => {
        if (isResettingGame) { return }

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

    }, [game, playerColor, playerColorFull, isResettingGame])

    useEffect(() => {
        if (isResettingGame && game.history().length > 0) {
            const gameCopy = { ...game };
            gameCopy.reset();
            setGame(gameCopy);
            setTimeout(() => {
                setIsResettingGame(false);
            }, 300)
        }
    }, [game, isResettingGame])

    const makeMove = move => {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result;
    }

    const pieceDroppedHandler = (sourceSquare, targetSquare) => {
        const move = {
            from: sourceSquare,
            to: targetSquare
        }

        const validMove = makeMove(move);
        return validMove !== null;
    }

    return (
        <div className="App">
            <button style={{ position: 'absolute', zIndex: 2 }} onClick={() => setIsResettingGame(true)}>Reset</button>
            {isResettingGame ? (
                <div className='chessboard-container tossed-game'>
                    <Chessboard
                        id='chessboard'
                        boardOrientation={playerColorFull}
                        boardWidth={boardWidth}
                        position={game.fen()}
                        snapToCursor={false}
                        animationDuration={0}
                    />
                    <Chessboard
                        boardOrientation={playerColorFull}
                        boardWidth={boardWidth}
                        position={new Chess().fen()}
                        snapToCursor={false}
                        animationDuration={0}
                    />
                </div>
            ) : (
                <div className='chessboard-container'>
                    <Chessboard
                        id='chessboard'
                        boardOrientation={playerColorFull}
                        boardWidth={boardWidth}
                        position={game.fen()}
                        onPieceDrop={pieceDroppedHandler}
                        snapToCursor={false}
                        animationDuration={300}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
