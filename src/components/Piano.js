import React from 'react';

import np from 'noteplayer';
import Icon, { ICON_TYPES } from './Icon';

console.log(np.getNotesInfo())

const PianoKey = ({name, isBlack}) => {
    return  (
        <a className={`piano-key${isBlack?' black':''}`}></a>
    )
}
export const VIEW_TYPES = {
    viewOnly: 'viewOnly',
    notesOnly: 'notesOnly',
    range: 'range'
}
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const getKeyElements = (notes) => {
    const keyElements = []
    for(let i = 0;i < notes.length;i++) {
        const keyName = notes[i]
        const keyElement = <PianoKey name={keyName} />
        const nextKeyValue = notes[(i + 1) % notes.length]
        let nextKeyElement = null
        if(nextKeyValue.indexOf('#') != -1) {
            nextKeyElement = <PianoKey name={nextKeyValue} isBlack={true} />
            i++
        }
        keyElements.push(
            <div key={keyName} className="piano-key-wrapper">
                {keyElement}
                {nextKeyElement}
            </div>
        )
    }
    return keyElements
}
const Piano = ({viewType, range}) => {
    let element = null, hasArrows = false
    if(viewType == VIEW_TYPES.notesOnly) {
        element = getKeyElements(notes)
    } else {
        hasArrows = true
        element = getKeyElements(np.getNotesInfo().map(({name}) => name ))
    }
    return (
        <div className={`piano-wrap-outer ${hasArrows?'with-arrows':''}`}>
            <div className="piano-wrap-inner">
                {hasArrows?
                    <>
                        <a className="piano-arrow left"><Icon type={ICON_TYPES.arrowLeft} /></a>
                        <a className="piano-arrow right"><Icon type={ICON_TYPES.arrowRight} /></a>
                    </>
                    :null
                }
                {element}
            </div>
        </div>
    )
}
export default Piano
