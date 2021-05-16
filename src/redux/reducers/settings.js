const initState = {
    notation: "western",
    range: [39, 60]
}

const settings = (state = initState, action) => {
    switch (action.type) {
        case 'SET_NOTATION':
            return {
                ...state,
                notation: action.payload
            }
        default:
            return state
    }
}

export default settings;
