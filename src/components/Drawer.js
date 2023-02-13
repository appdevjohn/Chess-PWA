import { useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'
import styled from 'styled-components'

const DragBar = styled.div`
display: block;
position: absolute;
margin: 4px auto;
left: 0;
right: 0;
padding: 0;
width: 75px;
height: 6px;
border-radius: 3px;
background-color: #dddddd;
`;

const Drawer = ({ children, backgroundColor, borderRadius }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [dragOffset, setDragOffset] = useState(0)

    const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyPriority('--sab').slice(0, -2);

    let drawerHeight = 60;
    if (dragOffset === 0) {
        drawerHeight = isOpen ? 600 : drawerHeight;
    } else {
        drawerHeight = (isOpen ? 600 : drawerHeight) + dragOffset;
    }

    const bind = useDrag(({ last, movement: [_, dy] }) => {
        if (last) {
            if (dy > 0) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
            setDragOffset(0)
        } else {
            setDragOffset(-dy)
        }
    }, {
        axis: 'y'
    })

    const styles = useSpring({
        height: drawerHeight + safeAreaBottom + 'px',
        config: {
            tension: 170,
            mass: 0.2,
            friction: 10
        }
    })

    return (
        <animated.div
            style={{
                position: 'fixed',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: backgroundColor || 'transparent',
                borderTopLeftRadius: borderRadius || '0',
                borderTopRightRadius: borderRadius || '0',
                touchAction: 'none',
                zIndex: '10',
                ...styles
            }}
            {...bind()}>
            <DragBar />
            {children}
        </animated.div>
    )
}

export default Drawer;