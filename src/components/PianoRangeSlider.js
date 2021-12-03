import React from 'react';
import Draggable from './Draggable';

export const RANGE_TYPES = {
    start: 'start',
    end: 'end'
}
const Link = ({type, x, y, isDragging, onMouseDown, onMouseUp, onMouseMove}) => {
    let styleObj = {transform: `translate(${x}px, ${y}px)`, cursor: 'grab' }
    if(isDragging) {
        styleObj = {...styleObj, ...{opacity: 0.8, cursor: 'grabbing'}}
    }
    return (
        <a onMouseDown={onMouseDown} onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={onMouseUp} style={styleObj} className={`piano-range-link ${type}`}></a>
    )

}
const PianoRangeSlider = ({type}) => {
    return (
        <Draggable Component={Link} type={type} />
    )
}
export default PianoRangeSlider
