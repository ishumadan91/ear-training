import np from 'noteplayer';

export const getNoteName = (num) => {
    return np.getNotesInfo()[num - 1].name
}