import _ from 'lodash';
import np from 'noteplayer';

const keysWithoutOctave = [
    {
        "keynb": 1,
        "name": "C"
    },
    {
        "keynb": 2,
        "name": "C#"
    },
    {
        "keynb": 3,
        "name": "D"
      },
    {
        "keynb": 4,
        "name": "D#"
      },
    {
        "keynb": 5,
        "name": "E"
      },
    {
        "keynb": 6,
        "name": "F"
      },
    {
        "keynb": 7,
        "name": "F#"
    },
    {
        "keynb": 8,
        "name": "G"
    },
    {
        "keynb": 9,
        "name": "G#"
    },
    {
        "keynb": 10,
        "name": "A"
    },
    {
        "keynb": 11,
        "name": "A#"
    },
    {
        "keynb": 12,
        "name": "B"
    }
]
const keys = [
    {
      "keynb": 1,
      "freq": 27.5,
      "name": "A",
      "octave": 0
    },
    {
      "keynb": 2,
      "freq": 29.13523509488062,
      "name": "A#",
      "octave": 0
    },
    {
      "keynb": 3,
      "freq": 30.867706328507758,
      "name": "B",
      "octave": 0
    },
    {
      "keynb": 4,
      "freq": 32.703195662574835,
      "name": "C",
      "octave": 1
    },
    {
      "keynb": 5,
      "freq": 34.64782887210902,
      "name": "C#",
      "octave": 1
    },
    {
      "keynb": 6,
      "freq": 36.708095989675954,
      "name": "D",
      "octave": 1
    },
    {
      "keynb": 7,
      "freq": 38.89087296526012,
      "name": "D#",
      "octave": 1
    },
    {
      "keynb": 8,
      "freq": 41.203444614108754,
      "name": "E",
      "octave": 1
    },
    {
      "keynb": 9,
      "freq": 43.6535289291255,
      "name": "F",
      "octave": 1
    },
    {
      "keynb": 10,
      "freq": 46.249302838954314,
      "name": "F#",
      "octave": 1
    },
    {
      "keynb": 11,
      "freq": 48.99942949771868,
      "name": "G",
      "octave": 1
    },
    {
      "keynb": 12,
      "freq": 51.91308719749316,
      "name": "G#",
      "octave": 1
    },
    {
      "keynb": 13,
      "freq": 55.00000000000002,
      "name": "A",
      "octave": 1
    },
    {
      "keynb": 14,
      "freq": 58.27047018976126,
      "name": "A#",
      "octave": 1
    },
    {
      "keynb": 15,
      "freq": 61.73541265701554,
      "name": "B",
      "octave": 1
    },
    {
      "keynb": 16,
      "freq": 65.40639132514968,
      "name": "C",
      "octave": 2
    },
    {
      "keynb": 17,
      "freq": 69.29565774421805,
      "name": "C#",
      "octave": 2
    },
    {
      "keynb": 18,
      "freq": 73.41619197935192,
      "name": "D",
      "octave": 2
    },
    {
      "keynb": 19,
      "freq": 77.78174593052026,
      "name": "D#",
      "octave": 2
    },
    {
      "keynb": 20,
      "freq": 82.40688922821752,
      "name": "E",
      "octave": 2
    },
    {
      "keynb": 21,
      "freq": 87.30705785825101,
      "name": "F",
      "octave": 2
    },
    {
      "keynb": 22,
      "freq": 92.49860567790864,
      "name": "F#",
      "octave": 2
    },
    {
      "keynb": 23,
      "freq": 97.99885899543737,
      "name": "G",
      "octave": 2
    },
    {
      "keynb": 24,
      "freq": 103.82617439498634,
      "name": "G#",
      "octave": 2
    },
    {
      "keynb": 25,
      "freq": 110.00000000000006,
      "name": "A",
      "octave": 2
    },
    {
      "keynb": 26,
      "freq": 116.54094037952254,
      "name": "A#",
      "octave": 2
    },
    {
      "keynb": 27,
      "freq": 123.4708253140311,
      "name": "B",
      "octave": 2
    },
    {
      "keynb": 28,
      "freq": 130.8127826502994,
      "name": "C",
      "octave": 3
    },
    {
      "keynb": 29,
      "freq": 138.59131548843615,
      "name": "C#",
      "octave": 3
    },
    {
      "keynb": 30,
      "freq": 146.8323839587039,
      "name": "D",
      "octave": 3
    },
    {
      "keynb": 31,
      "freq": 155.5634918610406,
      "name": "D#",
      "octave": 3
    },
    {
      "keynb": 32,
      "freq": 164.81377845643513,
      "name": "E",
      "octave": 3
    },
    {
      "keynb": 33,
      "freq": 174.6141157165021,
      "name": "F",
      "octave": 3
    },
    {
      "keynb": 34,
      "freq": 184.9972113558174,
      "name": "F#",
      "octave": 3
    },
    {
      "keynb": 35,
      "freq": 195.99771799087486,
      "name": "G",
      "octave": 3
    },
    {
      "keynb": 36,
      "freq": 207.6523487899728,
      "name": "G#",
      "octave": 3
    },
    {
      "keynb": 37,
      "freq": 220.00000000000026,
      "name": "A",
      "octave": 3
    },
    {
      "keynb": 38,
      "freq": 233.08188075904525,
      "name": "A#",
      "octave": 3
    },
    {
      "keynb": 39,
      "freq": 246.94165062806238,
      "name": "B",
      "octave": 3
    },
    {
      "keynb": 40,
      "freq": 261.62556530059896,
      "name": "C",
      "octave": 4
    },
    {
      "keynb": 41,
      "freq": 277.1826309768725,
      "name": "C#",
      "octave": 4
    },
    {
      "keynb": 42,
      "freq": 293.66476791740797,
      "name": "D",
      "octave": 4
    },
    {
      "keynb": 43,
      "freq": 311.1269837220814,
      "name": "D#",
      "octave": 4
    },
    {
      "keynb": 44,
      "freq": 329.62755691287043,
      "name": "E",
      "octave": 4
    },
    {
      "keynb": 45,
      "freq": 349.22823143300445,
      "name": "F",
      "octave": 4
    },
    {
      "keynb": 46,
      "freq": 369.994422711635,
      "name": "F#",
      "octave": 4
    },
    {
      "keynb": 47,
      "freq": 391.99543598174995,
      "name": "G",
      "octave": 4
    },
    {
      "keynb": 48,
      "freq": 415.30469757994587,
      "name": "G#",
      "octave": 4
    },
    {
      "keynb": 49,
      "freq": 440.0000000000008,
      "name": "A",
      "octave": 4
    },
    {
      "keynb": 50,
      "freq": 466.1637615180908,
      "name": "A#",
      "octave": 4
    },
    {
      "keynb": 51,
      "freq": 493.88330125612504,
      "name": "B",
      "octave": 4
    },
    {
      "keynb": 52,
      "freq": 523.2511306011983,
      "name": "C",
      "octave": 5
    },
    {
      "keynb": 53,
      "freq": 554.3652619537453,
      "name": "C#",
      "octave": 5
    },
    {
      "keynb": 54,
      "freq": 587.3295358348163,
      "name": "D",
      "octave": 5
    },
    {
      "keynb": 55,
      "freq": 622.2539674441631,
      "name": "D#",
      "octave": 5
    },
    {
      "keynb": 56,
      "freq": 659.2551138257412,
      "name": "E",
      "octave": 5
    },
    {
      "keynb": 57,
      "freq": 698.4564628660092,
      "name": "F",
      "octave": 5
    },
    {
      "keynb": 58,
      "freq": 739.9888454232704,
      "name": "F#",
      "octave": 5
    },
    {
      "keynb": 59,
      "freq": 783.9908719635004,
      "name": "G",
      "octave": 5
    },
    {
      "keynb": 60,
      "freq": 830.6093951598922,
      "name": "G#",
      "octave": 5
    },
    {
      "keynb": 61,
      "freq": 880.000000000002,
      "name": "A",
      "octave": 5
    },
    {
      "keynb": 62,
      "freq": 932.327523036182,
      "name": "A#",
      "octave": 5
    },
    {
      "keynb": 63,
      "freq": 987.7666025122505,
      "name": "B",
      "octave": 5
    },
    {
      "keynb": 64,
      "freq": 1046.502261202397,
      "name": "C",
      "octave": 6
    },
    {
      "keynb": 65,
      "freq": 1108.730523907491,
      "name": "C#",
      "octave": 6
    },
    {
      "keynb": 66,
      "freq": 1174.659071669633,
      "name": "D",
      "octave": 6
    },
    {
      "keynb": 67,
      "freq": 1244.5079348883266,
      "name": "D#",
      "octave": 6
    },
    {
      "keynb": 68,
      "freq": 1318.5102276514829,
      "name": "E",
      "octave": 6
    },
    {
      "keynb": 69,
      "freq": 1396.912925732019,
      "name": "F",
      "octave": 6
    },
    {
      "keynb": 70,
      "freq": 1479.9776908465412,
      "name": "F#",
      "octave": 6
    },
    {
      "keynb": 71,
      "freq": 1567.9817439270012,
      "name": "G",
      "octave": 6
    },
    {
      "keynb": 72,
      "freq": 1661.2187903197848,
      "name": "G#",
      "octave": 6
    },
    {
      "keynb": 73,
      "freq": 1760.0000000000045,
      "name": "A",
      "octave": 6
    },
    {
      "keynb": 74,
      "freq": 1864.6550460723645,
      "name": "A#",
      "octave": 6
    },
    {
      "keynb": 75,
      "freq": 1975.5332050245017,
      "name": "B",
      "octave": 6
    },
    {
      "keynb": 76,
      "freq": 2093.004522404795,
      "name": "C",
      "octave": 7
    },
    {
      "keynb": 77,
      "freq": 2217.461047814983,
      "name": "C#",
      "octave": 7
    },
    {
      "keynb": 78,
      "freq": 2349.318143339267,
      "name": "D",
      "octave": 7
    },
    {
      "keynb": 79,
      "freq": 2489.015869776654,
      "name": "D#",
      "octave": 7
    },
    {
      "keynb": 80,
      "freq": 2637.020455302967,
      "name": "E",
      "octave": 7
    },
    {
      "keynb": 81,
      "freq": 2793.8258514640393,
      "name": "F",
      "octave": 7
    },
    {
      "keynb": 82,
      "freq": 2959.955381693084,
      "name": "F#",
      "octave": 7
    },
    {
      "keynb": 83,
      "freq": 3135.9634878540037,
      "name": "G",
      "octave": 7
    },
    {
      "keynb": 84,
      "freq": 3322.437580639571,
      "name": "G#",
      "octave": 7
    },
    {
      "keynb": 85,
      "freq": 3520.0000000000105,
      "name": "A",
      "octave": 7
    },
    {
      "keynb": 86,
      "freq": 3729.310092144731,
      "name": "A#",
      "octave": 7
    },
    {
      "keynb": 87,
      "freq": 3951.0664100490053,
      "name": "B",
      "octave": 7
    },
    {
      "keynb": 88,
      "freq": 4186.009044809592,
      "name": "C",
      "octave": 8
    }
]
const groupedNotes = _.groupBy(keys, 'octave')
export const getNoteName = (num) => {
    return keys[num - 1].name
}
export const getGroupedNotes = () => {
    return groupedNotes
}
export const getOnlyKeys = () => {
    return keysWithoutOctave
}