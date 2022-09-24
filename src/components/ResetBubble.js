import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pop = keyframes`
0% {
    border: 4px solid white;
    background-color: rgba(255, 255, 255, 1);
    transform: scale(5);
}

50% {
    background-color: rgba(255, 255, 255, 0);
}

100% {
    border: 1px solid white;
    background-color: transparent;
    transform: scale(12);
}
`;

const Bubble = styled.div`
display: inline-block;
margin: auto;
width: 16px;
height: 16px;
border-radius: 8px;
background-color: ${props => props.growing ? 'white' : 'black'};
transition: ${props => props.popping ? 'inherit' : 'transform 1s ease;'}
transform: ${props => props.growing ? 'scale(5)' : 'inherit'};
animation-name: ${props => props.popping ? pop : 'inherit'};
animation-duration: 0.25s;
animation-timing-function: linear;
animation-delay: 0s;
pointer-events: ${props => props.popping ? 'none' : 'inherit'};
user-select: ${props => props.popping ? 'none' : 'inherit'};
`;

const ResetBubble = ({ onBubblePopped }) => {
    const [touched, setTouched] = useState(false);
    const [popping, setPopping] = useState(false);

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
            onMouseEnter={() => setTouched(true)}
            onMouseLeave={() => setTouched(false)}
            onTouchStart={() => setTouched(true)}
            onTouchEnd={() => setTouched(false)} />
    )
}

export default ResetBubble;