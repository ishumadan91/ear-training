const module = (() => {
    //Config
    let config = {
        range: [40, 52],
        omitted: [41, 43, 46, 48, 50],
        tuneLength: 6,
        notesGap: 700
    }

    const states = {
        isPlaying: false,
        notePausedAt: -1,
        questionGenerated: false
    }

    const elements  = {}
    
    
    let questionArray = []
    
    
    const playAllNotes = (arr, index) => {
        if(index == arr.length) {
            return
        }
        np.buildFromKeyNb(arr[index]).play()
        setTimeout(() => {
            playAllNotes(arr, index + 1)
        }, config.notesGap)
    }
    
    const getNoteName = (num) => {
        return np.getNotesInfo()[num - 1].name
    }
    const fillWithRandomNotes = () => {
        questionArray = []
        const selectNotes = []
        for(let i = config.range[0];i <= config.range[1];i++) {
            if(config.omitted.indexOf(i) == -1) {
                selectNotes.push(i)
            }
        }
        for(let i=0; i < config.tuneLength;i++) {
            const index = Math.floor(Math.random() *  selectNotes.length)
            questionArray.push(selectNotes[index])
        }
    }
    const setConfigValues = (obj) => {
        config = {...config, ...obj}
    }
    const bindEvents = () => {
        elements['playLink'] = document.querySelector('.js-play')
        elements['replayLink'] = document.querySelector('.js-replay')
        elements['revealLink'] = document.querySelector('.js-reveal')
        elements['result'] = document.querySelector('.js-result')
        elements.playLink.addEventListener('click', () => {
            elements.result.innerHTML = ''
            fillWithRandomNotes()
            console.log(questionArray)
            playAllNotes(questionArray, 0)
        })
        elements.replayLink.addEventListener('click', () => {
            playAllNotes(questionArray, 0)
        })
        
        elements.revealLink.addEventListener('click', () => {
            elements.result.innerHTML = questionArray.map(num => getNoteName(num)).join(', ')
        })
    }
    return {
        setConfigValues,
        bindEvents
    }
})()
module.bindEvents()
