import React from 'react';

const ArrowLeft = ({color}) => (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.535 3.515L3.05 12L11.535 20.485L12.95 19.071L5.878 12L12.95 4.929L11.535 3.515Z" fill={color}/>
    </svg>
)
ArrowLeft.defaultProps = {
    color: "#0176B8"
}
export default ArrowLeft
