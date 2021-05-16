import React from 'react';

const Toggle = ({color}) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM17 15C15.34 15 14 13.66 14 12C14 10.34 15.34 9 17 9C18.66 9 20 10.34 20 12C20 13.66 18.66 15 17 15Z" fill={color}/>
    </svg>
)
Toggle.defaultProps = {
    color: "#E40000"
}
export default Toggle