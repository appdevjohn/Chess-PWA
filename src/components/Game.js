import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chessboard } from 'react-chessboard';
import Spinner from './Spinner';

const GameContainer = styled.div`
display: grid;
grid-template-rows: 2rem auto 2rem;
margin: 3rem 0;
width: 100%
overflow: hidden;
`;

const InfoContainer = styled.div`
color: white;
padding: 4px 8px;
`;

const OpponentInfo = styled(InfoContainer)`
display: flex;
flex-direction: row-reverse;
`;

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
    pieceDroppedHandler }) => {

    // The board width in pixels, as required by react-chessboard.
    const [boardWidth, setBoardWidth] = useState(window.visualViewport.width);

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
                snapToCursor={true}
                animationDuration={game.history().length === 0 ? 0 : 300}
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
                <Spinner hidden={!game || game.turn() === playerColor || game.game_over()} />
            </OpponentInfo>
            <ChessboardCell>
                <ChessboardContainer isResettingBoard={isResettingBoard}>
                    {chessBoards}
                </ChessboardContainer>
            </ChessboardCell>
            <PlayerInfo></PlayerInfo>
        </GameContainer>
    )
}

export default Game;