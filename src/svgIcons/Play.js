import React from 'react';

const Play = ({color}) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 19L19 12L8 5V19Z" fill={color}/>
    </svg>
)
Play.defaultProps = {
    color: "#E71717"
}
export default Play
