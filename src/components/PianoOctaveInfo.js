import React, { useEffect, useRef, useState } from 'react';

const PianoOctaveInfo = ({octave}) => {
    return (
        <div className="piano-octave-info">
            <p>{octave}</p>
        </div>
    )
}
export default PianoOctaveInfo