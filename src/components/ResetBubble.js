import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pop = keyframes`
0% {
    border: 20px solid white;
    background-color: rgba(255, 255, 255, 1);
    width: 80px;
    height: 80px;
    transform: translateY(-32px);
}

50% {
    background-color: transparent;
}

100% {
    border: 1px solid white;
    background-color: transparent;
    transform: translateY(-88px);
    width: 192px;
    height: 192px;
}
`;

const Bubble = styled.div`
display: inline-block;
margin: auto;
width: ${props => props.growing ? '80px' : '16px'};
height: ${props => props.growing ? '80px' : '16px'};
border-radius: 100px;
background-color: ${props => props.growing ? 'white' : 'black'};
transform: ${props => props.growing ? 'translateY(-32px)' : 'inherit'};
transition: ${props => props.popping ? 'inherit' : 'width 1s ease, height 1s ease, transform 1s ease'};
animation-name: ${props => props.popping ? pop : 'inherit'};
animation-duration: 0.25s;
animation-timing-function: ease-out;
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