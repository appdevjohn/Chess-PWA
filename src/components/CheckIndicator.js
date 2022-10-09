import styled from 'styled-components';

const Indicator = styled.div`
display: inline-block;
font-size: 0.7rem;
font-weight: 700;
text-transform: uppercase;
color: white;
background-color: gray;
display: flex;
justify-content: center;
align-items: center;
border-radius: 100px;
padding: 0 8px;
transform: ${props => props.showing ? 'translateX(0)' : 'translateX(-50px)'};
opacity: ${props => props.showing ? '100%' : '0'};
transition: transform 0.3s ease, opacity 0.3s ease;

@media (min-width: 40rem) {
    font-size: 1rem;
}
`;

const CheckIndicator = ({ check, checkmate, stalemate, draw }) => {
    let text = 'Draw';
    if (stalemate) {
        text = 'Stalemate';
    } else if (checkmate) {
        text = 'Checkmate';
    } else if (check) {
        text = 'Check';
    }
    
    return <Indicator showing={check || checkmate || stalemate || draw}>{text}</Indicator>
}

export default CheckIndicator;