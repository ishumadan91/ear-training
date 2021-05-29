import React, { useEffect, useRef, useState } from 'react';
import PianoOctaveInfo from './PianoOctaveInfo';

const PianoKey = ({keynb, name, isBlack, range, octave, onClick}) => {
    const isInactive = range.length && (keynb < range[0] || keynb > range[1] )
    return  (
        <a onClick={() => onClick({keynb, octave})} className={`piano-key ${isBlack?'black':''} ${isInactive?' inactive':''}`}></a>
    )
}

const PianoOctave = ({notes, range=[], octave, onClickKey}) => {
    const keyElements = []
    for(let i = 0;i < notes.length;i++) {
        const {name, keynb, octave} = notes[i]
        const props = {onClick: onClickKey, octave, range}
        const keyElement = <PianoKey {...props} keynb={keynb} name={name} />
        const nextKeyName = notes[(i + 1) % notes.length].name
        let nextKeyElement = null
        if(nextKeyName.indexOf('#') != -1) {
            nextKeyElement = <PianoKey {...props} keynb={keynb + 1} name={nextKeyName} isBlack={true} />
            i++
        }
        keyElements.push(
            <div key={keynb} className="piano-key-wrapper">
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
