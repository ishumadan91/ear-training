import React, { useEffect, useState } from 'react';
import NotesInput from './components/NotesInput';
import PlayPause from './components/PlayPause';
import {getConfigValue} from './config'
import { getNoteBuild } from './utils/notePlayer';

const fillWithRandomNotes = (range, tuneLength, omitted) => {
    const questionArray = []
    const selectNotes = []
    for(let i = range[0];i <= range[1];i++) {
        if(omitted.indexOf(i) == -1) {
            selectNotes.push(i)
        }
    }
    for(let i=0; i < tuneLength;i++) {
        const index = Math.floor(Math.random() *  selectNotes.length)
        const num = selectNotes[index]
        questionArray.push({index: num, build: getNoteBuild(num)})
    }
    return questionArray
}

const App = () => {
    const [questionArray, setQuestionArray] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [resetCounter, setResetCounter] = useState(0)
    let range = getConfigValue('range')
    let tuneLength = getConfigValue('tuneLength')
    let omitted = getConfigValue('omitted')
    const resetQuestionArray = () => {
        setQuestionArray(fillWithRandomNotes(range, tuneLength, omitted))
        setResetCounter(resetCounter + 1)
    }
    useEffect(()  =>  {
        resetQuestionArray()
    }, [])
    return (
        <div className="container">
            <h1>Ear trainer</h1>
            <PlayPause questionArray={questionArray} notesGap={getConfigValue('notesGap')} setIsPlaying={setIsPlaying} isPlaying={isPlaying} />
            <NotesInput resetCounter={resetCounter} isPlaying={isPlaying} questionArray={questionArray} />
            <a onClick={() => resetQuestionArray()} className="action-link">Reset</a>
        </div>
    )
}

export default App
