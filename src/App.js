import React, { useEffect, useState } from 'react';
import PlayPause from './components/PlayPause';
import {getConfigValue} from './config'
import { getNoteName } from './utils/noteMapper';

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
        questionArray.push(selectNotes[index])
    }
    return questionArray
}

const onClickReplay = () => {

}
const onClickReveal = (questionArray, setRevealText) => {
    setRevealText(questionArray.map(num => getNoteName(num)).join(', '))
}
const App = () => {
    const [revealText, setRevealText] = useState("")
    const [questionArray, setQuestionArray] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    let range = getConfigValue('range')
    let tuneLength = getConfigValue('tuneLength')
    let omitted = getConfigValue('omitted')
    useEffect(()  =>  {
        setQuestionArray(fillWithRandomNotes(range, tuneLength, omitted))
    }, [])
    return (
        <div className="container">
            <h1>Ear trainer</h1>
            <PlayPause questionArray={questionArray} notesGap={getConfigValue('notesGap')} setIsPlaying={setIsPlaying} isPlaying={isPlaying} />
            <div>
                <a onClick={() => onClickReplay()} className="action-link">Replay</a>
            </div>
            <div>
                <a onClick={() => onClickReveal(questionArray, setRevealText)} className="action-link">Reveal</a>
            </div>
            <p className="reveal-text">{revealText}</p>
        </div>
    )
}

export default App
