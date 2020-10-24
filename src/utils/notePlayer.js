import np from 'noteplayer';

let intervalId, playIndex = -1
const playAllNotes = (arr, setIsPlaying) => {
    if(playIndex == arr.length) {
        clearInterval(intervalId)
        intervalId = -1
        setIsPlaying(false)
        return
    }
    np.buildFromKeyNb(arr[playIndex]).play()
    playIndex++
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
