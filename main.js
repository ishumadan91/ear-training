const module = (() => {
    const notesInfo = np.getNotesInfo()
    //Config
    let config = {
        range: [40, 52],
        omitted: [41, 43, 46, 48, 50],
        tuneLength: 6,
        notesGap: 700
    }
    
    const playLink = document.querySelector('.js-play')
    const replayLink = document.querySelector('.js-replay')
    const revealLink = document.querySelector('.js-reveal')
    const resultElement = document.querySelector('.js-result')
    
    function getRandomNote() {
        const arr = []
        for(let i = config.range[0];i <= config.range[1];i++) {
            if(config.omitted.indexOf(i) == -1) {
                arr.push(i)
            }
        }
        return arr[Math.floor(Math.random() *  arr.length)];
    }
    
    let arr = []
    
    
    function playAllNotes(arr, index) {
        if(index == arr.length) {
            return
        }
        np.buildFromKeyNb(arr[index]).play()
        setTimeout(() => {
            playAllNotes(arr, index + 1)
        }, config.notesGap)
    }
    
    
    const setConfigValues = (obj) => {
        config = {...config, ...obj}
    }
    const bindEvents = () => {
        playLink.addEventListener('click', () => {
            arr = []
            resultElement.innerHTML = ''
            for(let i=0; i < config.tuneLength;i++) {
                arr.push(getRandomNote())
            }
            console.log(arr)
            playAllNotes(arr, 0)
        })
        replayLink.addEventListener('click', () => {
            playAllNotes(arr, 0)
        })
        
        revealLink.addEventListener('click', () => {
            resultElement.innerHTML = arr.map(num => notesInfo[num - 1].name).join(', ')
        })
    }
    return {
        setConfigValues,
        bindEvents
    }
})()
module.bindEvents()
