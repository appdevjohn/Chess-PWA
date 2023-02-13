import styled from 'styled-components';

const Container = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
position: relative;
`;

const Color = styled.div`
display: inline-block;
box-sizing: border-box;
margin: 16px;
width: 36px;
height: 36px;
border-radius: 18px;
border: 2px solid black;
background-color: ${props => props.color};
cursor: pointer;
z-index: 2;
`;

const Highlight = styled.div`
display: inline-block;
width: 52px;
height: 52px;
border-radius: 26px;
background-color: #CCCCCC;
position: absolute;
z-index: 1;
transform: translateX(${({ color }) => color === 'b' ? '-34px' : '34px'});
transition: transform 0.2s ease;
`;

const ColorPicker = ({ color, setColor }) => {
    return (
        <Container>
            <Highlight color={color} />
            <Color color='black' onClick={() => setColor('b')} />
            <Color color='white' onClick={() => setColor('w')} />
        </Container>
    )
}

export default ColorPicker;