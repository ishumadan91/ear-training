const playLink = document.querySelector('.js-play')
const replayLink = document.querySelector('.js-replay')
const revealLink = document.querySelector('.js-reveal')
const resultElement = document.querySelector('.js-result')
const notes = ["C", "D", "E", "F", "G", "A", "B", "C"]
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
const length = 6

let arr = []


function playAllNotes(arr, index) {
    if(index == arr.length) {
        return
    }
    np.buildFromName(arr[index]).play()
    setTimeout(() => {
        playAllNotes(arr, index + 1)
    },1000)
}
playLink.addEventListener('click', () => {
    arr = []
    resultElement.innerHTML = ''
    for(let i=0; i < length;i++) {
        const num = Math.floor(getRandomArbitrary(0, notes.length))
        const octave = num >= 5?4:3
        arr.push(notes[num] + octave)
    }
    console.log(arr)
    playAllNotes(arr, 0)
})
replayLink.addEventListener('click', () => {
    playAllNotes(arr, 0)
})

revealLink.addEventListener('click', () => {
    resultElement.innerHTML = arr.join(', ')
})