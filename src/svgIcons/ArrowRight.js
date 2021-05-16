import React from 'react';

const ArrowRight = ({color}) => (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.465 3.515L16.95 12L8.465 20.485L7.05 19.071L14.122 12L7.05 4.929L8.465 3.515Z" fill={color}/>
    </svg>
)
ArrowRight.defaultProps = {
    color: "#0176B8"
}
export default ArrowRight
