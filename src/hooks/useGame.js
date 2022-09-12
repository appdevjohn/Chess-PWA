import { useState, useEffect } from 'react';
import chessAPI from '../util/chessAPI';
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

    const [focusedSquare, setFocusedSquare] = useState();
    const focusedSquareLegalMoves = focusedSquare ? game.moves({ square: focusedSquare, verbose: true }) : [];

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
            const controller = new AbortController();

            chessAPI.post('/suggest-move', {
                'board_position': game.fen()
            }, {
                signal: controller.signal
            }).then(response => {
                const result = response.data;
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

            return () => {
                controller.abort();
            }
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

    // Handles the event where a piece is tapped.
    const squareTappedHandler = square => {
        if (!square) {
            setFocusedSquare(undefined);
            return null;
        } else if (focusedSquare === square) {
            setFocusedSquare(undefined);
            return null;
        }

        const pieceOnSquare = game.get(square);

        if (focusedSquare && pieceOnSquare) {
            setFocusedSquare(square);
            return null;

        } else if (focusedSquare) {
            const move = {
                from: focusedSquare,
                to: square
            }

            const validMove = makeMove(move);
            setFocusedSquare(undefined);
            return validMove !== null;

        } else if (pieceOnSquare) {
            setFocusedSquare(square);
            return null;
        }
    }

    return {
        game,
        oldGameState,
        isResettingBoard,
        playerColor,
        playerColorFull,
        focusedSquare,
        focusedSquareLegalMoves,
        resetGameHandler,
        pieceDroppedHandler,
        squareTappedHandler
    }
}

export default useGame;