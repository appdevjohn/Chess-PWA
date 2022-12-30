import { useState, useEffect } from 'react';
import chessAPI from '../util/chessAPI';
import { Chess } from 'chess.js';

const useGame = () => {
    // The game state, in the chess.js format.
    const [game, setGame] = useState();

    // To create the animation to a new game, we need to keep the old game state briefly.
    const [oldGameState, setOldGameState] = useState();
    const [isResettingBoard, setIsResettingBoard] = useState(false);

    // Temporarily store a game state to demonstrate a move suggestion or previous move.
    const [previewGameState, setPreviewGameState] = useState();

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
                'fen': game.fen()
            }, {
                signal: controller.signal
            }).then(response => {
                const result = response.data;
                if (!result) { return; }

                const bestMove = {
                    from: result['best_move'].substring(0, 2),
                    to: result['best_move'].substring(2, 4),
                    promotion: 'q'
                }
                setGame(prevState => {
                    const gameCopy = { ...prevState };
                    gameCopy.move(bestMove);
                    return gameCopy;
                })

            }).catch(error => {
                console.error(error);
            });

            return () => {
                controller.abort();
            }
        }

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

    // Handles an Undo request.
    const undoMoveHandler = () => {
        const moves = []
        setGame(prevState => {
            const gameCopy = { ...prevState };

            if (gameCopy.turn() === playerColor && !gameCopy.game_over()) {
                moves.push(gameCopy.undo());
                moves.push(gameCopy.undo());
            } else if (gameCopy.turn() !== playerColor && !gameCopy.game_over()) {
                moves.push(gameCopy.undo());
            }

            return gameCopy;
        })

        return moves;
    }

    // Handles a move suggestion request.
    const suggestMoveHandler = async () => {
        const gameCopy = new Chess()
        gameCopy.load_pgn(game.pgn());
        setPreviewGameState(gameCopy);

        try {
            const response = await chessAPI.post('/suggest-move', {
                'fen': game.fen()
            })

            const result = response.data;
            if (!result) { return; }

            const bestMove = {
                from: result['best_move'].substring(0, 2),
                to: result['best_move'].substring(2, 4),
                promotion: 'q'
            }

            setPreviewGameState(prevState => {
                const gameCopy = { ...prevState };
                gameCopy.move(bestMove);
                return gameCopy;
            })

            setTimeout(() => {
                setPreviewGameState();
            }, 1000);

        } catch (error) {
            setPreviewGameState()
        }
    }

    // Handles a request to show the previously made move.
    const showPreviousMoveHandler = () => {
        const gameCopy = new Chess()
        gameCopy.load_pgn(game.pgn());
        gameCopy.undo();

        setPreviewGameState(gameCopy);

        setTimeout(() => {
            setPreviewGameState();
        }, 1000);
    }

    // Make a move. Returns true if the move is valid.
    const makeMove = move => {
        let result;
        setGame(prevState => {
            const gameCopy = { ...prevState };
            result = gameCopy.move(move);
            return gameCopy;
        })

        return result;
    }

    // Handles what happens when a piece is dropped on a square.
    const pieceDroppedHandler = (sourceSquare, targetSquare) => {
        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        }

        const validMove = makeMove(move);
        return validMove !== null;
    }

    // Handles the event where a piece is tapped.
    const squareTappedHandler = square => {
        if (!square) {
            setFocusedSquare(undefined);
            return null;
        }

        const pieceOnSquare = game.get(square);

        if (
            focusedSquare === square ||
            (!focusedSquare && pieceOnSquare && pieceOnSquare.color !== playerColor) ||
            game.turn() !== playerColor ||
            previewGameState
        ) {
            setFocusedSquare(undefined);
            return null;
        }

        if ((!focusedSquare && pieceOnSquare) || (focusedSquare && pieceOnSquare && pieceOnSquare.color === playerColor)) {
            setFocusedSquare(square);
            return null;

        } else if (focusedSquare) {
            const move = {
                from: focusedSquare,
                to: square,
                promotion: 'q'
            }

            const validMove = makeMove(move);
            setFocusedSquare(undefined);
            return validMove !== null;

        } else if (pieceOnSquare) {
            setFocusedSquare(square);
            return null;
        }
    }

    const isPieceMovableHandler = ({ sourceSquare }) => {
        const pieceOnSquare = game.get(sourceSquare);
        return (
            pieceOnSquare &&
            pieceOnSquare.color === playerColor &&
            game && !game.game_over() &&
            game.turn() === playerColor &&
            !previewGameState
        )
    }

    return {
        game: game,
        oldGameState,
        isResettingBoard,
        previewGameState,
        playerColor,
        playerColorFull,
        focusedSquare,
        focusedSquareLegalMoves,
        opponentCheck: game && game.turn() !== playerColor && game.in_check(),
        playerCheck: game && game.turn() === playerColor && game.in_check(),
        opponentCheckmate: game && game.turn() !== playerColor && game.in_checkmate(),
        playerCheckmate: game && game.turn() === playerColor && game.in_checkmate(),
        opponentStalemate: game && game.turn() !== playerColor && game.in_stalemate(),
        playerStalemate: game && game.turn() === playerColor && game.in_stalemate(),
        isDrawGame: game && game.in_draw(),
        resetGameHandler,
        undoMoveHandler,
        suggestMoveHandler,
        showPreviousMoveHandler,
        pieceDroppedHandler,
        squareTappedHandler,
        isPieceMovableHandler,
    }
}

export default useGame;