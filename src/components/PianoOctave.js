import React from 'react';
import PianoOctaveInfo from './PianoOctaveInfo';
import PianoRangeSlider, { RANGE_TYPES } from './PianoRangeSlider';

const PianoKey = ({keynb, name, isBlack, range, octave, hasRangeSlider, onClick}) => {
    let rangeElem = null
    const isInactive = range.length && (keynb < range[0] || keynb > range[1] )
    if(hasRangeSlider) {
        const rangeElementType = keynb == range[0]?RANGE_TYPES.start:keynb == range[1]?RANGE_TYPES.end:null
        rangeElem = rangeElementType?<PianoRangeSlider type={rangeElementType} />:null
    }
    return  (
        <div className={`piano-key-mid-wrap ${isBlack?'black':''}`}>
            <a onClick={() => onClick({keynb, octave})} className={`piano-key ${isInactive?' inactive':''}`}></a>
            {rangeElem}
        </div>
    )
}

const PianoOctave = ({notes, range=[], octave, hasRangeSlider, onClickKey}) => {
    const keyElements = []
    for(let i = 0;i < notes.length;i++) {
        const {name, keynb, octave} = notes[i]
        const props = {onClick: onClickKey, octave, range, hasRangeSlider}
        const keyElement = <PianoKey {...props} keynb={keynb} name={name} />
        const nextKeyName = notes[(i + 1) % notes.length].name
        let nextKeyElement = null
        let hasBlack = false
        if(nextKeyName.indexOf('#') != -1) {
            nextKeyElement = <PianoKey {...props} keynb={keynb + 1} name={nextKeyName} isBlack={true} />
            hasBlack = true
            i++
        }
        keyElements.push(
            <div key={keynb} className={`piano-key-wrapper ${hasBlack?'has-black':''}`}>
                {keyElement}
                {nextKeyElement}
            </div>
        )
    }
    return (
        <div className="piano-octave-wrapper">
            {octave != undefined?<PianoOctaveInfo octave={octave} />:null}
            {keyElements}
        </div>
    )
}
export default PianoOctave
