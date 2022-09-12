import styled from 'styled-components';

const WhiteKing = styled.div`
display: inline-block;
width: ${props => `${props.width}px`};
height: ${props => `${props.width}px`};
background-image: url("https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png");
background-position: center;
background-repeat: no-repeat;
background-size: contain;
transform: ${props => props.isDragging ? `translateY(-${props.width/3}px)` : `inherit`};
`;

const pieces = {
    wK: ({ squareWidth, isDragging }) => <WhiteKing width={squareWidth} isDragging={isDragging} />
}

export default pieces;