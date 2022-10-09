import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chessboard } from 'react-chessboard';
import Spinner from './Spinner';
import CheckIndicator from './CheckIndicator';

const GameContainer = styled.div`
display: grid;
grid-template-rows: 2.5rem auto 2.5rem;
margin: auto;
margin-top: 3rem;
width: 100%
overflow: hidden;
max-width: 40rem;
position: relative;

@media (min-width: 40rem) {
    grid-template-rows: 3rem auto 3rem;
}
`;

const InfoContainer = styled.div`
color: white;
padding: 8px;
display: flex;
flex-direction: row;
justify-content: space-between;
`;

const OpponentInfo = styled(InfoContainer)``;

const PlayerInfo = styled(InfoContainer)``;

const ChessboardCell = styled.div`
width: 100vw;
overflow: hidden;
aspect-ratio: 1 / 1;

@media (min-width: 40rem) {
    width: 40rem;
}
`;

const ChessboardContainer = styled.div`
left: 0;
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
width: ${props => props.isResettingBoard ? 'calc(200vw + 2rem)' : 'initial'};
column-gap: ${props => props.isResettingBoard ? '2rem' : 'initial'};
transform: ${props => props.isResettingBoard ? 'translateX(calc(-100vw - 2rem))' : 'initial'};
transition: ${props => props.isResettingBoard ? 'transform 0.5s ease-in-out' : 'initial'};

@media (min-width: 40rem) {
    width: ${props => props.isResettingBoard ? 'calc(80rem + 2rem)' : 'initial'};
    transform: ${props => props.isResettingBoard ? 'translateX(calc(-40rem - 2rem))' : 'initial'};
}
`;

const Game = ({
    game,
    oldGameState,
    isResettingBoard,
    playerColor,
    playerColorFull,
    pieceDroppedHandler,
    focusedSquare,
    focusedSquareLegalMoves,
    opponentCheck,
    playerCheck,
    opponentCheckmate,
    playerCheckmate,
    opponentStalemate,
    playerStalemate,
    isDrawGame,
    squareTappedHandler,
    isPieceMovableHandler }) => {

    // The board width in pixels, as required by react-chessboard.
    const [boardWidth, setBoardWidth] = useState(window.visualViewport.width < 640 ? window.visualViewport.width : 640);
    const boardAreaRef = useRef();

    const squareStyles = {};
    focusedSquareLegalMoves.forEach(m => {
        squareStyles[m.to] = {
            background:
                game.get(m.to) && game.get(m.to).color !== game.get(focusedSquare).color
                    ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
            borderRadius: '50%'
        }
    });
    if (focusedSquare) {
        squareStyles[focusedSquare] = {
            background: 'rgba(255, 255, 0, 0.4)'
        }
    }

    // Manages the width of the board in pixels.
    useEffect(() => {
        const resizeBoard = () => setBoardWidth(boardAreaRef.current.offsetWidth);
        window.addEventListener('resize', resizeBoard);
        return () => window.removeEventListener('resize', resizeBoard)
    }, [])

    // Chessboard array. If resetting a game, a board with the resigned game
    // will be added to the front of the array, and both boards will appear
    // briefly on the screen.
    const chessBoards = []
    if (game) {
        chessBoards.push(
            <Chessboard
                id='chessboard'
                boardOrientation={playerColorFull}
                boardWidth={boardWidth}
                position={game.fen()}
                onPieceDrop={pieceDroppedHandler}
                onPieceDragBegin={() => squareTappedHandler(null)}
                onSquareClick={squareTappedHandler}
                customSquareStyles={squareStyles}
                snapToCursor={true}
                animationDuration={game.history().length === 0 ? 0 : 300}
                isDraggablePiece={isPieceMovableHandler}
                key='main'
            />
        )
    }
    if (oldGameState) {
        chessBoards.unshift(
            <Chessboard
                boardOrientation={oldGameState.color}
                boardWidth={boardWidth}
                position={oldGameState.fen}
                snapToCursor={true}
                animationDuration={0}
                key='animated'
            />
        )
    }

    return (
        <GameContainer>
            <OpponentInfo>
                <CheckIndicator check={opponentCheck} checkmate={opponentCheckmate} stalemate={opponentStalemate} draw={isDrawGame} />
                <Spinner hidden={!game || game.turn() === playerColor || game.game_over()} />
            </OpponentInfo>
            <ChessboardCell ref={boardAreaRef}>
                <ChessboardContainer isResettingBoard={isResettingBoard}>
                    {chessBoards}
                </ChessboardContainer>
            </ChessboardCell>
            <PlayerInfo>
                <CheckIndicator check={playerCheck} checkmate={playerCheckmate} stalemate={playerStalemate} draw={isDrawGame} />
            </PlayerInfo>
        </GameContainer>
    )
}

export default Game;