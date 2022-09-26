import { useState } from 'react';
import ResetBubble from './ResetBubble';

const ResetBubbleArea = ({ onBubblePopped }) => {
    const [coordinates, setCoordinates] = useState();

    const mouseDownHandler = event => {
        const x = event.clientX;
        const y = event.clientY;
        setCoordinates({ x, y })
    }

    const touchStartHandler = event => {
        console.log(event);
        const x = event.changedTouches[0].clientX;
        const y = event.changedTouches[0].clientY;
        setCoordinates({ x, y })
    }

    const endHandler = () => {
        setCoordinates(undefined);
    }

    return (
        <div
            style={{ height: '8rem', position: 'relative' }}
            onMouseDown={mouseDownHandler}
            onMouseUp={endHandler}
            onTouchStart={touchStartHandler}
            onTouchEnd={endHandler}>
                {coordinates && <ResetBubble onBubblePopped={onBubblePopped} coordinates={coordinates} />}
        </div>
    )
}

export default ResetBubbleArea;