import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';

const useGame = () => {
    // The game state, in the chess.js format.
    const [game, setGame] = useState();

    // To create the animation to a new game, we need to keep the old game state briefly.
    const [oldGameState, setOldGameState] = useState();
    const [isResettingBoard, setIsResettingBoard] = useState(false);

    // The player's color.
    const [playerColor, setPlayerColor] = useState();
    const playerColorFull = playerColor === 'w' ? 'white' : 'black';

    // Manages what happens after each the game state changes.
    useEffect(() => {
        if (oldGameState) { return }

        // Either fetch the game saved in localStorage or start a new game.
        if (!game) {
            const savedGameFEN = localStorage.getItem('game-fen');
            const savedPlayerColor = localStorage.getItem('player-color');
            setGame(new Chess(savedGameFEN || undefined));
            setPlayerColor(savedPlayerColor ? savedPlayerColor : Math.random() > 0.5 ? 'w' : 'b');
            return;
        }

        localStorage.setItem('game-fen', game.fen());
        localStorage.setItem('player-color', playerColor);

        // If opponent's move, hit the API for a move.
        if (game.turn() !== playerColor && !game.game_over()) {
            // Call API to get next move.
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
                if (!result) { return; }

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

        // After the piece animates, display an alert if applicable.
        setTimeout(() => {
            if (game.turn() === playerColor && game.in_checkmate()) {
                alert('Checkmate');
            } else if (game.turn() === playerColor && game.in_check()) {
                alert('Check');
            }
        }, 300)

    }, [game, playerColor, playerColorFull, oldGameState])

    // The DOM has updated with the new chess board. It can now be animated.
    useEffect(() => {
        if (oldGameState) {
            setIsResettingBoard(true);
            setGame(prevState => {
                const gameCopy = { ...prevState };
                gameCopy.reset();
                return gameCopy;
            });
            setPlayerColor(Math.random() > 0.5 ? 'w' : 'b');
        }
    }, [oldGameState])

    // The board reset is finished; remove the animation elements.
    useEffect(() => {
        if (isResettingBoard) {
            setTimeout(() => {
                setOldGameState(undefined);
                setIsResettingBoard(false);
            }, 500)
        }
    }, [isResettingBoard])

    // Handles what happens when a game reset is requested.
    const resetGameHandler = () => {
        setOldGameState({
            fen: game.fen(),
            color: playerColorFull
        });
    }

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

    return {
        game,
        oldGameState,
        isResettingBoard,
        playerColor,
        playerColorFull,
        resetGameHandler,
        pieceDroppedHandler
    }
}

export default useGame;