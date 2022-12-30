import styled from 'styled-components';

const Container = styled.div`
display: flex;
position: static;
padding: 8px;
bottom: 0;
width: 100%;
background-color: transparent;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const BarSide = styled.div`
display: inline-block;
`;

const LeftSide = styled(BarSide)`
text-align: left;
`;

const RightSide = styled(BarSide)`
text-align: right;
`;

const Button = styled.button`
color: #283228;
font-size: 0.75rem;
font-weight: 700;
width: 2.75rem;
height: 2.75rem;
text-align: center;
background-color: #ededed;
box-shadow: 1px 2px 2px #cccccc;
border: none;
cursor: pointer;
padding: 0;
border: none;
border-radius: 1.375rem;
text-transform: uppercase;
margin: 0 16px;

&:active {
    opacity: 0.5;
}
`;

const Toolbar = ({ resetGameHandler, undoMoveHandler, suggestMoveHandler, showPreviousMoveHandler }) => (
    <Container>
        <LeftSide>
            <Button onClick={resetGameHandler}>New</Button>
            <Button onClick={undoMoveHandler}>Undo</Button>
        </LeftSide>
        <RightSide>
            <Button onClick={suggestMoveHandler}>Sug</Button>
            <Button onClick={showPreviousMoveHandler}>SWPV</Button>
        </RightSide>
    </Container>
)

export default Toolbar;