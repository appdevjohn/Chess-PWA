import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pop = keyframes`
0% {
    border: 20px solid white;
    background-color: rgba(255, 255, 255, 1);
    width: 120px;
    height: 120px;
    transform: translate(-52px, -52px);
}

50% {
    background-color: transparent;
}

100% {
    border: 1px solid white;
    background-color: transparent;
    transform: translate(-88px, -88px);
    width: 192px;
    height: 192px;
}
`;

const Bubble = styled.div`
display: inline-block;
position: fixed;
top: ${props => `${props.y - 8}px` || '0'};
left: ${props => `${props.x - 8}px` || '0'};
margin: auto;
width: ${props => props.growing ? '120px' : '16px'};
height: ${props => props.growing ? '120px' : '16px'};
border-radius: 100px;
background-color: ${props => props.growing ? 'white' : 'transparent'};
transform: ${props => props.growing ? 'translate(-52px, -52px)' : 'inherit'};
transition: ${props => props.popping ? 'inherit' : 'width 1s ease, height 1s ease, transform 1s ease'};
animation-name: ${props => props.popping ? pop : 'inherit'};
animation-duration: 0.25s;
animation-timing-function: ease-out;
animation-delay: 0s;
pointer-events: ${props => props.popping ? 'none' : 'inherit'};
user-select: ${props => props.popping ? 'none' : 'inherit'};
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
        <Bubble
            growing={touched}
            popping={popping}
            x={coordinates.x}
            y={coordinates.y}
        />
    )
}

export default ResetBubble;