import { set } from 'lodash'
import React, { useEffect, useState } from  'react'
import { getNoteName } from '../utils/noteMapper'
import { playSingleNote } from '../utils/notePlayer'

const onInputChange = (value, setNoteValue) => {
    let newValue = ""
    if(value.length == 1) {
        const charCode = value.charCodeAt(0)
        if(charCode >= 97 && charCode <= 103) {
            newValue = value.toUpperCase()
        } else if(charCode >= 65 && charCode <= 71) {
            newValue = value
        }
    } else if(value.length == 2) {
        const charCode = value.charCodeAt(1)
        if(charCode >= 48 && charCode <= 56) {
            newValue = value
        } else {
            newValue = value[0]
        }
    } else if(value.length >= 3) {
        newValue = value.substr(0, 2)
    }
    setNoteValue(newValue)
}
const playOnFocus = (noteObj, isPlaying) => {
    if(!isPlaying) {
        playSingleNote(noteObj)
    }
}
const NoteInputBox = ({noteObj, value, isPlaying, setNoteValue, shouldReveal}) => {
    return (
        <li>
            <input value={value} onFocus={() => playOnFocus(noteObj, isPlaying) } onChange={(e) => onInputChange(e.target.value, setNoteValue)} type="text" />
            <p>{shouldReveal?getNoteName(noteObj.index):null}</p>
        </li>
    )
}

const NotesInput = ({resetCounter, questionArray, isPlaying}) => {
    const [noteValues, setNoteValues] = useState({})
    const [shouldReveal, setShouldReveal] = useState(false)
    const setNoteValue = (index, value) => {
        setNoteValues({...noteValues, ...{[index]: value} })
    }
    useEffect(() => {
        setShouldReveal(false)
        setNoteValues({})
    }, [resetCounter])
    return (
        <div>
            <ul className="notes-input-list">
                {
                    questionArray.map((item, index) => (<NoteInputBox key={index} value={noteValues[index] || ""} noteObj={item} isPlaying={isPlaying} setNoteValue={(value) => setNoteValue(index, value)} shouldReveal={shouldReveal} />))
                }
            </ul>
            <a onClick={() => setShouldReveal(true)} className="action-link">Check your answer</a>
        </div>
    )
}
export default NotesInput
