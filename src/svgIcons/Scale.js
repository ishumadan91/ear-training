import React from 'react';

const Scale = ({color}) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 1.875V7.675C7.20625 7.56875 6.89375 7.5 6.5625 7.5C5.00625 7.5 3.75 8.75625 3.75 10.3125C3.75 11.8687 5.00625 13.125 6.5625 13.125C8.00625 13.125 9.1875 12.0312 9.34375 10.625H9.375V3.75H11.875V1.875H7.5Z" fill={color}/>
        <path d="M33 18H15C13.9 18 13 18.9 13 20V28C13 29.1 13.9 30 15 30H33C34.1 30 35 29.1 35 28V20C35 18.9 34.1 18 33 18ZM33 28H15V20H17V24H19V20H21V24H23V20H25V24H27V20H29V24H31V20H33V28Z" fill={color}/>
    </svg>
)
Scale.defaultProps = {
    color: "#E40000"
}
export default Scale
