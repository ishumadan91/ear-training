import React, { useEffect, useRef, useState } from 'react';

import Icon, { ICON_TYPES } from './Icon';
import { getGroupedNotes, getOnlyKeys } from '../utils/noteMapper';
import PianoOctave from './PianoOctave';

export const VIEW_TYPES = {
    viewOnly: 'viewOnly',
    notesOnly: 'notesOnly',
    range: 'range'
}

const scrollMagnitude = 80
const Piano = ({viewType, range}) => {
    let element = null, hasArrows = false
    const [scroll, setScroll] = useState(0)
    const [boundations, setBoundations] = useState([])
    const pianoKeysContainerRef = useRef()
    const onClickKey = ({keynb, octave}) => {
        console.log(keynb, octave)
    }
    if(viewType == VIEW_TYPES.notesOnly) {
        element = <PianoOctave notes={getOnlyKeys()} onClickKey={onClickKey} />
    } else {
        hasArrows = true
        const groupedOctaves = getGroupedNotes()
        element = Object.keys(groupedOctaves).map((octave) => {
            return (
                <PianoOctave key={octave} onClickKey={onClickKey} notes={groupedOctaves[octave]} range={range} octave={octave} hasRangeSlider={viewType == VIEW_TYPES.range} />
            )
        })
    }
    const onScroll = (multiplier) => {
        let newScrollValue = scroll + scrollMagnitude * multiplier
        const boundationValue = boundations[multiplier > 0?0:1]
        if((newScrollValue * -multiplier) < boundationValue) {
            newScrollValue = boundationValue
        }
        setScroll(newScrollValue)
    }
    useEffect(() => {
        const {current} = pianoKeysContainerRef
        if(viewType != VIEW_TYPES.notesOnly) {
            const pianoWrapperElements = current.querySelectorAll('.piano-key-wrapper')
            const singleWidth = pianoWrapperElements[0].clientWidth
            const containerWidth = current.clientWidth
            const width = singleWidth * pianoWrapperElements.length - containerWidth
            const boundations = [30, -width - 30]
            setBoundations(boundations)
            const rangeAvg = Math.ceil((range[0] + range[1])/2)
            const avgNoteWidth = singleWidth * 7/12
            const frameCapacity = Math.floor(containerWidth / avgNoteWidth) - 1
            const leftMostNote = Math.floor(rangeAvg - frameCapacity/2) - 1
            let scrollPosition = -(leftMostNote * avgNoteWidth)
            if(scrollPosition > boundations[0]) {
                scrollPosition = boundations[0]
            } else if (scrollPosition < boundations[1]) {
                scrollPosition = boundations[1]
            }
            setScroll(scrollPosition)
        }
    }, [pianoKeysContainerRef])
    return (
        <div className={`piano-wrap-outer`}>
            <div className={`piano-wrap-middle ${hasArrows?'with-arrows':''}`}>
                {hasArrows?
                    <>
                        <a onClick={() => onScroll(1)} className="piano-arrow left"><Icon type={ICON_TYPES.arrowLeft} /></a>
                        <a onClick={() => onScroll(-1)} className="piano-arrow right"><Icon type={ICON_TYPES.arrowRight} /></a>
                    </>
                    :null
                }
                <div ref={pianoKeysContainerRef} style={{left: scroll}} className="piano-wrap-inner">
                    {element}
                </div>
            </div>
        </div>
    )
}
export default Piano
