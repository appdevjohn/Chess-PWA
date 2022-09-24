import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chessboard } from 'react-chessboard';
import Spinner from './Spinner';
import CheckIndicator from './CheckIndicator';

const GameContainer = styled.div`
display: grid;
grid-template-rows: 2.5rem auto 2.5rem;
margin: 3rem 0;
width: 100%
overflow: hidden;
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
aspect-ratio: 1 / 1;
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
    squareTappedHandler,
    isPieceMovableHandler }) => {

    // The board width in pixels, as required by react-chessboard.
    const [boardWidth, setBoardWidth] = useState(window.visualViewport.width);

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
                <CheckIndicator check={opponentCheck} checkmate={opponentCheckmate} />
                <Spinner hidden={!game || game.turn() === playerColor || game.game_over()} />
            </OpponentInfo>
            <ChessboardCell>
                <ChessboardContainer isResettingBoard={isResettingBoard}>
                    {chessBoards}
                </ChessboardContainer>
            </ChessboardCell>
            <PlayerInfo>
                <CheckIndicator check={playerCheck} checkmate={playerCheckmate} />
            </PlayerInfo>
        </GameContainer>
    )
}

export default Game;