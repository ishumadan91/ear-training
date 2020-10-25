import np from 'noteplayer';

let intervalId, playIndex = -1

const playAllNotes = (arr, setIsPlaying) => {
    if(playIndex == arr.length) {
        clearInterval(intervalId)
        intervalId = -1
        setIsPlaying(false)
        return
    }
    playSingleNote(arr[playIndex])
    playIndex++
}
export const getNoteBuild = (num) =>  np.buildFromKeyNb(num)

export const playSingleNote = ({build}) => {
    build.play()
}
export const playNotes = (questionArray, notesGap, setIsPlaying) => {
    playIndex = 0
    intervalId = setInterval(() => {
        playAllNotes(questionArray, setIsPlaying)
    }, notesGap)
}
export const stopPlaying = () => {
    clearInterval(intervalId)
    intervalId = null
}
