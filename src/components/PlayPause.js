import React, { useState } from 'react';
import { playNotes, stopPlaying } from '../utils/notePlayer';

const PlayPause = ({notesGap, isPlaying, setIsPlaying, questionArray}) => {
    const onClickPlay = () => {
        console.log('onClickPlay', isPlaying)
        if(isPlaying) {
            setIsPlaying(false)
            stopPlaying()
        } else {
            playNotes(questionArray, notesGap, setIsPlaying)
            setIsPlaying(true)
        }
    }
    return (
        <a onClick={() => onClickPlay()} className="action-link">{isPlaying?'Stop':'Play'}</a>
    )
}
export default PlayPause
