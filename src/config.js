let config = {
    range: [40, 52],
    omitted: [41, 43, 46, 48, 50],
    tuneLength: 6,
    notesGap: 700
}

export const setConfigValues = (obj) => {
    config = {...config, ...obj}
}
export const getConfigValue = (name) => config[name]

window.setConfigValues = setConfigValues;
