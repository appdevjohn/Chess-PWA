import { useState, useEffect } from 'react'
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
`

const DrawerModeView = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.5rem;
  padding: 0 0.5rem;
`

const DrawerModeDismissButton = styled.button`
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
`

const Drawer = ({
  children,
  backgroundColor,
  borderRadius,
  drawerMode,
  setDrawerMode,
  difficultyView,
  colorView,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  let currentView
  let currentViewSize
  switch (drawerMode) {
    case 'difficulty':
      currentView = difficultyView
      currentViewSize = 120
      break
    case 'color':
      currentView = colorView
      currentViewSize = 80
      break
    default:
      currentView = null
      currentViewSize = 60
      break
  }

  console.log(currentView)

  useEffect(() => {
    if (drawerMode && isOpen) {
      setIsOpen(false)
    }
  }, [drawerMode, isOpen])

  const safeAreaBottom = getComputedStyle(document.documentElement)
    .getPropertyPriority('--sab')
    .slice(0, -2)

  let drawerHeight = currentViewSize
  if (!drawerMode && dragOffset === 0) {
    drawerHeight = isOpen ? 600 : drawerHeight
  } else if (!drawerMode) {
    drawerHeight = (isOpen ? 600 : drawerHeight) + dragOffset
  }

  const bind = useDrag(
    ({ last, movement: [_, dy] }) => {
      if (last) {
        if (dy > 0) {
          setIsOpen(false)
        } else {
          setIsOpen(true)
        }
        setDragOffset(0)
      } else {
        setDragOffset(-dy)
      }
    },
    {
      axis: 'y',
    }
  )

  const styles = useSpring({
    height: drawerHeight + safeAreaBottom + 'px',
    config: {
      tension: 170,
      mass: 0.2,
      friction: 10,
    },
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
        ...styles,
      }}
      {...bind()}
    >
      {drawerMode && (
        <DrawerModeView>
          {currentView}
          <DrawerModeDismissButton onClick={() => setDrawerMode()}>
            Done
          </DrawerModeDismissButton>
        </DrawerModeView>
      )}
      {!drawerMode && [<DragBar />, children]}
    </animated.div>
  )
}

export default Drawer
