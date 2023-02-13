import { useRef } from 'react'
import styled from 'styled-components'
import { useDrag } from '@use-gesture/react'

const Container = styled.div`
margin: 1rem 0;
padding: 1rem;
position: relative;
`

const Bar = styled.div`
position: relative;
display: flex;
justify-content: center;
align-items: center;
height: 4px;
border-radius: 2px;
background-color: black;
overflow: visible;
touch-action: none;
`

const Mark = styled.div`
display: inline-block;
height: 44px;
width: 44px;
border-radius: 22px;
background-color: gray;
position: absolute;
cursor: grab;
touch-action: none;
overflow: visible;
`

const LabelText = styled.div`
text-align: center;
color: gray;
margin-bottom: 30px;
`;

// const LabelBubble = styled.div`
// display: flex;
// justify-content: center;
// align-items: center;
// height: 44px;
// width: 150px;
// background-color: white;
// border: 1px solid black;
// position: relative;
// bottom: 52px;
// left: calc(-75px + 22px);
// `

const Slider = ({ value, onChange, labelText }) => {
    const ref = useRef()
    const width = ref?.current?.getBoundingClientRect()['width']  // Width of the element.

    const bind = useDrag(({ initial: [x, _], movement: [dx, __], currentTarget }) => {
        const viewportPosition = currentTarget.getBoundingClientRect();
        const elementWidth = currentTarget.clientWidth;
        const newPercent = (x - viewportPosition.x + dx - 22) / (elementWidth - 44);

        if (newPercent > 1) {
            onChange(1)
        } else if (newPercent < 0) {
            onChange(0)
        } else {
            onChange(newPercent)
        }
    })

    return (
        <Container>
            <LabelText>{labelText}</LabelText>
            <Bar ref={ref} {...bind()}>
                <Mark
                    style={{
                        left: `${value * (width - 44)}`
                    }}>
                        {/* <LabelBubble>{labelText}</LabelBubble> */}
                </Mark>
            </Bar>
        </Container>
    )
}

export default Slider