import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pop = keyframes`
0% {
    border: 20px solid white;
    background-color: white;
    width: 120px;
    height: 120px;
}

50% {
    background-color: transparent;
}

100% {
    border: 1px solid white;
    background-color: transparent;
    width: 192px;
    height: 192px;
}
`;

const Bubble = styled.div`
display: inline-block;
width: ${props => props.growing ? '120px' : '16px'};
height: ${props => props.growing ? '120px' : '16px'};
border-radius: 100px;
background-color: ${props => props.growing ? 'white' : 'transparent'};
transition: ${props => props.popping ? 'inherit' : 'width 1s ease, height 1s ease'};
animation-name: ${props => props.popping ? pop : 'inherit'};
animation-duration: 0.25s;
animation-timing-function: ease-out;
animation-delay: 0s;
pointer-events: ${props => props.popping ? 'none' : 'inherit'};
user-select: ${props => props.popping ? 'none' : 'inherit'};
`;

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: fixed;
width: 192px;
height: 192px;
top: ${props => `${props.y - 96}px` || '0'};
left: ${props => `${props.x - 96}px` || '0'};
`;

const ResetBubble = ({ onBubblePopped, coordinates }) => {
    const [touched, setTouched] = useState(false);
    const [popping, setPopping] = useState(false);

    useEffect(() => {
        if (coordinates) {
            setTouched(true);
        }
    }, [coordinates])

    useEffect(() => {
        if (touched) {
            const timeout = setTimeout(() => {
                setTouched(false);
                setPopping(true);
                onBubblePopped();
            }, 1000);

            return () => {
                clearTimeout(timeout);
            }
        }
    }, [touched, onBubblePopped])

    useEffect(() => {
        if (popping) {
            const timeout = setTimeout(() => {
                setPopping(false);
            }, 1000);

            return () => {
                clearTimeout(timeout);
            }
        }
    }, [popping])

    return (
        <Container x={coordinates.x} y={coordinates.y}>
            <Bubble growing={touched} popping={popping} />
        </Container>
    )
}

export default ResetBubble;